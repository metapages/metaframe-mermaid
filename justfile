set shell               := ["bash", "-c"]
set dotenv-load         := true
set export              := true
APP_FQDN                := env_var_or_default("APP_FQDN", "server1.localhost")
APP_PORT                := env_var_or_default("APP_PORT", "4430")
APP_PORT_BROWSER        := env_var_or_default("APP_PORT_BROWSER", "4440")
DENO_DEPLOY_TOKEN       := env_var_or_default("DENO_DEPLOY_TOKEN", "")
# minimal formatting, bold is very useful
bold                               := '\033[1m'
normal                             := '\033[0m'
green                              := "\\e[32m"
yellow                             := "\\e[33m"
blue                               := "\\e[34m"
magenta                            := "\\e[35m"
grey                               := "\\e[90m"

@_help:
    just --list --unsorted

# open
# Run the server in development mode
@dev +args="": _mkcert open
  docker-compose up {{args}}

@down +args="":
  docker-compose down {{args}}

# DEV: generate TLS certs for HTTPS over localhost https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/
@_mkcert:
  if [ ! -f .traefik/certs/local-key.pem ]; then \
      mkdir -p .traefik/certs ; \
      mkcert -cert-file .traefik/certs/local-cert.pem -key-file .traefik/certs/local-key.pem {{APP_FQDN}} localhost ; \
  fi

open:
  deno run --allow-all --unstable https://deno.land/x/metapages@v0.0.17/exec/open_url.ts 'https://metapages.github.io/load-page-when-available/?url=https://{{APP_FQDN}}:{{APP_PORT}}'

publish: _ensure_deployctl
  #!/usr/bin/env bash
  set -euo pipefail
  # build the client in client/dist
  just client/build
  rm -rf deploy
  mkdir -p deploy
  cp -r client/dist deploy/editor
  cp -r server/server.ts deploy/
  cp -r server/index.html deploy/
  cd deploy
  deployctl deploy --project=metaframe-mermaid --prod server.ts

# Delete all cached and generated files, and docker volumes
clean:
    # just ingress/clean
    just client/clean
    rm -rf .traefik/certs
    rm -rf deploy
    docker-compose down -v

@_ensure_deployctl:
    if ! command -v deployctl &> /dev/null; then echo '‼️ deployctl is being installed ‼️'; deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts; fi
