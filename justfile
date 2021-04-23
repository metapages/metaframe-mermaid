# just docs: https://github.com/casey/just

set shell := ["bash", "-c"]

# E.g. 'my.app.com'. Some services e.g. auth need know the external endpoint for example OAuth
# The root domain for this app, serving index.html
export APP_FQDN                    := env_var_or_default("APP_FQDN", "metaframe1.dev")
export APP_PORT                    := env_var_or_default("APP_PORT", "443")
# browser hot-module-replacement (live reloading)
export PORT_HMR                    := env_var_or_default("PORT_HMR", "3456")
# see https://github.com/parcel-bundler/parcel/issues/2031
PARCEL_WORKERS                     := env_var_or_default("PARCEL_WORKERS", `if [ -f /.dockerenv ]; then echo "1" ; fi`)
parcel                             := "PARCEL_WORKERS=" + PARCEL_WORKERS +  " node_modules/parcel-bundler/bin/cli.js"
tsc                                := "./node_modules/typescript/bin/tsc"

# minimal formatting, bold is very useful
bold     := '\033[1m'
normal   := '\033[0m'

_help:
    @just --list --unsorted --list-heading $'🚪 Commands:\n\n'

# Build the client static files
build +args="": _ensure_npm_modules (_tsc "--build --verbose")
    rm -rf dist/*
    {{parcel}} build {{args}} public/index.html --no-autoinstall --detailed-report 50

# Run the browser dev server (optionally pointing to any remote app)
dev: _ensure_npm_modules _mkcert (_tsc "--build --verbose")
    #!/usr/bin/env bash
    # Running inside docker requires modified startup configuration, HMR and HTTPS are disabled
    if [ -f /.dockerenv ]; then
        echo "💥 Missing feature: parcel (builds browser assets) cannot be run in development mode in a docker container"
        {{parcel}} serve \
                        --port ${APP_PORT} \
                        --host 0.0.0.0 \
                        --no-hmr \
                        public/index.html
    else
        APP_ORIGIN=https://${APP_FQDN}:${APP_PORT}
        echo "Browser development pointing to: ${APP_ORIGIN}"
        {{parcel}} serve \
                        --cert .certs/${APP_FQDN}.pem \
                        --key  .certs/${APP_FQDN}-key.pem \
                        --port ${APP_PORT} \
                        --host ${APP_FQDN} \
                        --hmr-port ${PORT_HMR} \
                        public/index.html --open
    fi

# compile typescript src, may or may not emit artifacts
_tsc +args="":
    {{tsc}} {{args}}

# rebuild the client on changes, but do not serve
watch:
    @# ts-node-dev does not work with typescript project references https://github.com/TypeStrong/ts-node/issues/897
    watchexec --restart --watch ./src --watch ./justfile --watch ./package.json --watch ./tsconfig.json -- bash -c '{{tsc}} --build --verbose && {{parcel}} watch --public-url ./ public/index.html'

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
