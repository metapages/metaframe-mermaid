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
PACKAGE_NAME_SHORT                 := file_name(`cat package.json | jq -r '.name' | sed 's/.*\///'`)
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
    echo -e "    Publish URL 🔗 {{green}}https://$(cat package.json | jq -r '.name' | sd '@metapages/metaframe-' '').mtfm.io/{{normal}}"
    echo -e "    Develop URL 🔗 {{green}}https://{{APP_FQDN}}:{{APP_PORT}}/{{normal}}"
    echo -e ""

# Run the dev server. Opens the web app in browser.
dev: _mkcert _ensure_npm_modules (_tsc "--build")
    #!/usr/bin/env bash
    set -euo pipefail
    APP_ORIGIN=https://${APP_FQDN}:${APP_PORT}
    echo "Browser development pointing to: ${APP_ORIGIN}"
    npm i
    export HOST={{APP_FQDN}}
    export PORT={{APP_PORT}}
    export CERT_FILE=.certs/{{APP_FQDN}}.pem
    export CERT_KEY_FILE=.certs/{{APP_FQDN}}-key.pem
    export BASE=
    VITE_APP_ORIGIN=${APP_ORIGIN} {{vite}} --clearScreen false

generate-readme-from-notion:
    NOTION_PAGE_ID="https://www.notion.so/metapages/README-md-markdown-mtfm-io-4e9e1f23e599460fa9a8320b5cbde988?pvs=4" just ~/dev/git/metapages/cetami.io/api/functions/notion-page-to-markdown {{justfile_directory()}}/public README.md

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
build BASE="": _ensure_npm_modules (_tsc "--build") (_browser_client_build BASE)

# Deletes: [ .certs, dist ]
@clean:
    rm -rf .certs dist

# Rebuild the browser assets on changes, but do not serve
watch:
    watchexec -w src -w tsconfig.json -w package.json -w vite.config.ts -- just _browser_assets_build

# Watch and serve browser client. Can't use vite to serve: https://github.com/vitejs/vite/issues/2754
serve: _mkcert build
    cd docs && \
    npx http-server --cors '*' -a {{APP_FQDN}} -p {{APP_PORT}} --ssl --cert ../.certs/{{APP_FQDN}}.pem --key ../.certs/{{APP_FQDN}}-key.pem

# bumps version, commits change, git tags
@_npm_version npmversionargs="patch":
    npm version {{npmversionargs}}
    echo -e "  📦 new version: {{green}}$(cat package.json | jq -r .version){{normal}}"

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

_ensureGitPorcelain:
    #!/usr/bin/env bash
    set -eo pipefail
    # In github actions, we modify .github/actions/cloud/action.yml for reasons
    # so do not do this check there
    if [ "${GITHUB_WORKSPACE}" = "" ]; then
        deno run --allow-all --unstable {{DENO_SOURCE}}/git/git-fail-if-uncommitted-files.ts
    fi

_fix_git_actions_permission:
    #!/usr/bin/env bash
    set -eo pipefail
    # workaround for github actions docker permissions issue
    if [ "${GITHUB_WORKSPACE}" != "" ]; then
        git config --global --add safe.directory /github/workspace
        git config --global --add safe.directory /repo
        git config --global --add safe.directory $(pwd)
        export GIT_CEILING_DIRECTORIES=/__w
        git config --global user.email "robot@metapage.io"
        git config --global user.name "Metaframe Robot"
    fi
