###############################################################
# Minimal commands to develop, build, test, and deploy
###############################################################
# just docs: https://github.com/casey/just
set shell                          := ["bash", "-c"]
set dotenv-load                    := true
# E.g. 'my.app.com'. Some services e.g. auth need know the external endpoint for example OAuth
# The root domain for this app, serving index.html
export APP_FQDN                    := env_var_or_default("APP_FQDN", "metaframe1.localhost")
export APP_PORT                    := env_var_or_default("APP_PORT", "4430")
ROOT                               := env_var_or_default("GITHUB_WORKSPACE", `(which git >/dev/null && git rev-parse --show-toplevel) || pwd`)
export CI                          := env_var_or_default("CI", "")
PACKAGE_NAME_SHORT                 := file_name(`cat package.json | jq -r '.name' | sd '.*/' ''`)
# Store the CI/dev docker image in github
# ghcr.io packages cannot have more than one "/" after the organization name
export DOCKER_IMAGE_PREFIX         := "ghcr.io/metapages/" + PACKAGE_NAME_SHORT
# Always assume our current cloud ops image is versioned to the exact same app images we deploy
export DOCKER_TAG                  := `if [ "${GITHUB_ACTIONS}" = "true" ]; then echo "${GITHUB_SHA}"; else echo "$(git rev-parse --short=8 HEAD)"; fi`
# The NPM_TOKEN is required for publishing to https://www.npmjs.com
NPM_TOKEN                          := env_var_or_default("NPM_TOKEN", "")
# Source of deno scripts. When developing we need to switch this
DENO_SOURCE                        := env_var_or_default("DENO_SOURCE", "https://deno.land/x/metapages@v0.0.14")
# vite needs an extra memory boost
vite                               := "VITE_APP_FQDN=" + APP_FQDN + " VITE_APP_PORT=" + APP_PORT + " NODE_OPTIONS='--max_old_space_size=16384' ./node_modules/vite/bin/vite.js"
tsc                                := "./node_modules/typescript/bin/tsc"
# minimal formatting, bold is very useful
bold                               := '\033[1m'
normal                             := '\033[0m'
green                              := "\\e[32m"
yellow                             := "\\e[33m"
blue                               := "\\e[34m"
magenta                            := "\\e[35m"
grey                               := "\\e[90m"

# If not in docker, get inside
@_help:
    echo -e ""
    just --list --unsorted --list-heading $'🌱 Commands:\n\n'
    echo -e ""
    echo -e "    Github  URL 🔗 {{green}}$(cat package.json | jq -r '.repository.url'){{normal}}"
    echo -e "    Publish URL 🔗 {{green}}https://$(cat package.json | jq -r '.name' | sd '/.*' '' | sd '@' '').github.io/{{PACKAGE_NAME_SHORT}}/{{normal}}"
    echo -e "    Develop URL 🔗 {{green}}https://{{APP_FQDN}}:{{APP_PORT}}/{{normal}}"
    echo -e ""

# Run the dev server. Opens the web app in browser.
dev: _mkcert _ensure_npm_modules (_tsc "--build")
    #!/usr/bin/env bash
    set -euo pipefail
    APP_ORIGIN=https://${APP_FQDN}:${APP_PORT}
    echo "Browser development pointing to: ${APP_ORIGIN}"
    deno run --allow-all --unstable {{DENO_SOURCE}}/exec/open_url.ts https://metapages.github.io/load-page-when-available/?url=https://${APP_FQDN}:${APP_PORT}
    npm i
    export HOST={{APP_FQDN}}
    export PORT={{APP_PORT}}
    export CERT_FILE=.certs/{{APP_FQDN}}.pem
    export CERT_KEY_FILE=.certs/{{APP_FQDN}}-key.pem
    export BASE=
    VITE_APP_ORIGIN=${APP_ORIGIN} {{vite}} --clearScreen false

# Increment semver version, push the tags (triggers "on-tag-version")
@publish npmversionargs="patch": _fix_git_actions_permission _ensureGitPorcelain (_npm_version npmversionargs)
    # Push the tags up
    git push origin v$(cat package.json | jq -r '.version')

# Publish targets (add to the end of the on-tag-version command to execute):
#   - `_npm_publish`: publish to npm
#   - `_githubpages_publish`: publish to github pages
#   - `_cloudflare_pages_publish`: publish to cloudflare pages
# Reaction to "publish". On new git version tag: publish code [github pages, cloudflare pages, npm]
on-tag-version: _fix_git_actions_permission _ensure_npm_modules _ensureGitPorcelain _cloudflare_pages_publish

# build the browser app in ./docs (default for github pages)
_browser_client_build BASE="":
    HOST={{APP_FQDN}} \
    OUTDIR=./docs \
    BASE={{BASE}} \
        deno run --allow-all --unstable {{DENO_SOURCE}}/browser/vite-build.ts --versioning=true

# Test: currently bare minimum: only building. Need proper test harness.
@test: (_tsc "--build") build

# Build the [browser app, npm lib] for production. Called automatically by "test" and "publish"
build BASE="": _ensure_npm_modules (_tsc "--build") (_browser_client_build BASE) _npm_build

# Deletes: [ .certs, dist ]
@clean:
    rm -rf .certs dist

# Rebuild the browser assets on changes, but do not serve
watch:
    watchexec -w src -w tsconfig.json -w package.json -w vite.config.ts -- just build

# Watch and serve browser client. Can't use vite to serve: https://github.com/vitejs/vite/issues/2754
serve: _mkcert build
    cd docs && \
    npx http-server --cors '*' -a {{APP_FQDN}} -p {{APP_PORT}} --ssl --cert ../.certs/{{APP_FQDN}}.pem --key ../.certs/{{APP_FQDN}}-key.pem

# Build npm package for publishing
@_npm_build: _ensure_npm_modules
    mkdir -p dist
    rm -rf dist/*
    {{tsc}} --noEmit false --project ./tsconfig.npm.json
    OUTDIR=./dist \
    DEPLOY_TARGET=lib \
        deno run --allow-all --unstable {{DENO_SOURCE}}/browser/vite-build.ts
    echo "  ✅ npm build"

# bumps version, commits change, git tags
@_npm_version npmversionargs="patch":
    npm version {{npmversionargs}}
    echo -e "  📦 new version: {{green}}$(cat package.json | jq -r .version){{normal}}"

# If the npm version does not exist, publish the module
_npm_publish: _require_NPM_TOKEN _npm_build
    #!/usr/bin/env bash
    set -euo pipefail
    if [ "$CI" != "true" ]; then
        # This check is here to prevent publishing if there are uncommitted changes, but this check does not work in CI environments
        # because it starts as a clean checkout and git is not installed and it is not a full checkout, just the tip
        if [[ $(git status --short) != '' ]]; then
            git status
            echo -e '💥 Cannot publish with uncommitted changes'
            exit 2
        fi
    fi

    PACKAGE_EXISTS=true
    if npm search $(cat package.json | jq -r .name) | grep -q  "No matches found"; then
        echo -e "  👉 new npm module !"
        PACKAGE_EXISTS=false
    fi
    VERSION=$(cat package.json | jq -r '.version')
    if [ $PACKAGE_EXISTS = "true" ]; then
        INDEX=$(npm view $(cat package.json | jq -r .name) versions --json | jq "index( \"$VERSION\" )")
        if [ "$INDEX" != "null" ]; then
            echo -e '  🌳 Version exists, not publishing'
            exit 0
        fi
    fi

    echo -e "  👉 PUBLISHING npm version $VERSION"
    if [ ! -f .npmrc ]; then
        echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
    fi
    npm publish --access public .

# compile typescript src, may or may not emit artifacts
_tsc +args="": _ensure_npm_modules
    {{tsc}} {{args}}

# DEV: generate TLS certs for HTTPS over localhost https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/
@_mkcert:
    APP_FQDN={{APP_FQDN}} CERTS_DIR=.certs deno run --allow-all --unstable {{DENO_SOURCE}}/commands/ensure_mkcert.ts

@_ensure_npm_modules:
    if [ ! -f "{{tsc}}" ]; then npm i; fi

# vite builder commands
@_vite +args="":
    {{vite}} {{args}}

# update "gh-pages" branch with the (versioned and default) current build (./docs) (and keeping all previous versions)
@_githubpages_publish: _ensure_npm_modules
    BASE=$(if [ -f "public/CNAME" ]; then echo ""; else echo "{{PACKAGE_NAME_SHORT}}"; fi) \
        deno run --unstable --allow-all {{DENO_SOURCE}}/browser/gh-pages-publish-to-docs.ts --versioning=true

@_cloudflare_pages_publish: _ensure_npm_modules
    deno run --unstable --allow-all {{DENO_SOURCE}}/browser/gh-pages-publish-to-docs.ts --versioning=true

####################################################################################
# Ensure docker image for local and CI operations
# Hoist into a docker container with all require CLI tools installed
####################################################################################
# Hoist into a docker container with all require CLI tools installed
@_docker +args="bash": _build_docker
    echo -e "🌱 Entering docker context: {{bold}}{{DOCKER_IMAGE_PREFIX}}:{{DOCKER_TAG}} from <repo/>Dockerfile 🚪🚪{{normal}}"
    mkdir -p {{ROOT}}/.tmp
    touch {{ROOT}}/.tmp/.bash_history
    touch {{ROOT}}/.tmp/.aliases
    if [ -f ~/.aliases ]; then cp ~/.aliases {{ROOT}}/.tmp/.aliases; fi
    export WORKSPACE=/repo && \
        docker run \
            --platform linux/$(docker version -f '{{{{json .}}' | jq -r '.Server.Arch') \
            --rm \
            -ti \
            -e DOCKER_IMAGE_PREFIX=${DOCKER_IMAGE_PREFIX} \
            -e PS1="<$(basename $PWD)/> " \
            -e PROMPT="<%/% > " \
            -e DOCKER_IMAGE_PREFIX={{DOCKER_IMAGE_PREFIX}} \
            -e HISTFILE=$WORKSPACE/.tmp/.bash_history \
            -e WORKSPACE=$WORKSPACE \
            -e DENO_DIR=/root/.cache/deno \
            -v {{ROOT}}:$WORKSPACE \
            -v {{PACKAGE_NAME_SHORT}}_node_modules:$WORKSPACE/node_modules \
            -v {{PACKAGE_NAME_SHORT}}_root_npm:/root/.npm \
            -v {{PACKAGE_NAME_SHORT}}_deno:/root/.cache/deno \
            $(if [ -d $HOME/.gitconfig ]; then echo "-v $HOME/.gitconfig:/root/.gitconfig"; else echo ""; fi) \
            $(if [ -d $HOME/.ssh ]; then echo "-v $HOME/.ssh:/root/.ssh"; else echo ""; fi) \
            -p {{APP_PORT}}:{{APP_PORT}} \
            --add-host {{APP_FQDN}}:127.0.0.1 \
            -w $WORKSPACE \
            {{DOCKER_IMAGE_PREFIX}}:{{DOCKER_TAG}} {{args}} || true

# If the ./app docker image in not build, then build it
_build_docker:
    #!/usr/bin/env bash
    set -euo pipefail

    if [[ "$(docker images -q {{DOCKER_IMAGE_PREFIX}}:{{DOCKER_TAG}} 2> /dev/null)" == "" ]]; then
        echo -e "🌱🌱  ➡ {{bold}}Building docker image ...{{normal}} 🚪🚪 ";
        echo -e "🌱 </> {{bold}}docker build --platform linux/$(docker version -f '{{{{json .}}' | jq -r '.Server.Arch') -t {{DOCKER_IMAGE_PREFIX}}:{{DOCKER_TAG}} . {{normal}}🚪 ";
        docker build --platform linux/$(docker version -f '{{{{json .}}' | jq -r '.Server.Arch') -t {{DOCKER_IMAGE_PREFIX}}:{{DOCKER_TAG}} . ;
    fi

_ensure_inside_docker:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f /.dockerenv ]; then
        echo -e "🌵🔥🌵🔥🌵🔥🌵 Not inside a docker container. First run the command: 'just' 🌵🔥🌵🔥🌵🔥🌵"
        exit 1
    fi

_ensureGitPorcelain:
    #!/usr/bin/env bash
    set -eo pipefail
    # In github actions, we modify .github/actions/cloud/action.yml for reasons
    # so do not do this check there
    if [ "${GITHUB_WORKSPACE}" = "" ]; then
        deno run --allow-all --unstable {{DENO_SOURCE}}/git/git-fail-if-uncommitted-files.ts
    fi

@_require_NPM_TOKEN:
	if [ -z "{{NPM_TOKEN}}" ]; then echo "Missing NPM_TOKEN env var"; exit 1; fi

_fix_git_actions_permission:
    #!/usr/bin/env bash
    set -eo pipefail
    # workaround for github actions docker permissions issue
    if [ "${GITHUB_WORKSPACE}" != "" ]; then
        git config --global --add safe.directory /github/workspace
        git config --global --add safe.directory /repo
        git config --global --add safe.directory $(pwd)
        export GIT_CEILING_DIRECTORIES=/__w
    fi
