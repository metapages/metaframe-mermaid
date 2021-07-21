# just docs: https://github.com/casey/just

set shell                          := ["bash", "-c"]
# E.g. 'my.app.com'. Some services e.g. auth need know the external endpoint for example OAuth
# The root domain for this app, serving index.html
export APP_FQDN                    := env_var_or_default("APP_FQDN", "metaframe1.dev")
export APP_PORT                    := env_var_or_default("APP_PORT", "443")
vite                               := "VITE_APP_FQDN=" + APP_FQDN + "VITE_APP_PORT=" + APP_PORT + " NODE_OPTIONS='--max_old_space_size=16384' ./node_modules/vite/bin/vite.js"
tsc                                := "./node_modules/typescript/bin/tsc"

# minimal formatting, bold is very useful
bold     := '\033[1m'
normal   := '\033[0m'

_help:
    @just --list --unsorted --list-heading $'🚪 Commands:\n\n'

# Build the client static files
build +args="--mode=production": _ensure_npm_modules (_tsc "--build") (_build args)
_build +args="--mode=production":
    {{vite}} build {{args}}

# Run the browser dev server (optionally pointing to any remote app)
dev: _ensure_npm_modules _mkcert (_tsc "--build")
    #!/usr/bin/env bash
    # Running inside docker requires modified startup configuration, HMR and HTTPS are disabled
    if [ -f /.dockerenv ]; then
        # This is NOT well tested with vite.
        # TODO: https://vitejs.dev/config/#server-hmr
        APP_FQDN=${APP_FQDN} APP_PORT=${PORT_BROWSER} {{vite}}
    else
        APP_ORIGIN=https://${APP_FQDN}:${APP_PORT}
        echo "Browser development pointing to: ${APP_ORIGIN}"
        VITE_APP_ORIGIN=${APP_ORIGIN} {{vite}}
    fi

# rebuild the client on changes, but do not serve
watch:
    watchexec -w src -w tsconfig.json -w package.json -w vite.config.ts -- just build

# deletes .certs dist
clean:
    rm -rf .certs dist

# compile typescript src, may or may not emit artifacts
_tsc +args="":
    {{tsc}} {{args}}

# DEV: generate TLS certs for HTTPS over localhost https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/
_mkcert:
    #!/usr/bin/env bash
    echo -e "🚪 Check local mkcert certificates and /etc/hosts with APP_FQDN=${APP_FQDN}"
    if [ -n "$CI" ]; then
        echo "CI=$CI ∴ skipping mkcert"
        exit 0
    fi
    if [ -f /.dockerenv ]; then \
        echo "Inside docker context, assuming mkcert has been run on the host"
        exit 0;
    fi
    if ! command -v mkcert &> /dev/null; then echo "💥 {{bold}}mkcert{{normal}}💥 is not installed (manual.md#host-requirements): https://github.com/FiloSottile/mkcert"; exit 1; fi
    if [ ! -f .certs/{{APP_FQDN}}-key.pem ]; then
        mkdir -p .certs/ ;
        cd .certs/ && mkcert -cert-file {{APP_FQDN}}.pem -key-file {{APP_FQDN}}-key.pem {{APP_FQDN}} localhost ;
    fi
    if ! cat /etc/hosts | grep "{{APP_FQDN}}" &> /dev/null; then
        echo -e "";
        echo -e "💥Add to /etc/hosts: 'sudo vi /etc/hosts'💥";
        echo -e "";
        echo -e "      {{bold}}127.0.0.1     {{APP_FQDN}}{{normal}}";
        echo -e "";
        exit 1;
    fi

@_ensure_npm_modules:
    if [ ! -f "{{tsc}}" ]; then npm i; fi

# vite builder commands
@_vite +args="":
    {{vite}} {{args}}
