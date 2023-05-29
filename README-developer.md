# [Metaframe](https://metapages.org/) template

Fast creation and deployment of advanced [metaframe](https://metapages.org/) websites.

Target audience: developers building [metaframes](https://metapages.org/) or any static website where having the core tools of development, building and publishing are packaged and require a small number of commands.

It has everything you need to get a connectable [metaframe](https://metapages.org/) website up and running and deployed.

## Fork and modify

1) Fork OR Create new repository
   - Fork
   - Create new repository
      1) Clone the new repository and go there in the terminal
      2) `git remote add upstream git@github.com:metapages/metaframe-template-react.git`
      3) `git fetch upstream`
      4) `git checkout -b upstream upstream/main`
      5) `git branch -d main`
      6) `git checkout -b main`
      7) `git push -u origin main`
2) Change in `package.json`:
   - `name` to your npm module name
     - This repo keeps the npm module name in `package.json` close to the github repo name:
       - npm: `@metapages/metaframe-...?`
       - git: `metapages/metaframe-...?`
   - `repository.url`
   - `homepage`
   - `version`: set this to e.g. `0.1.0` or whatever you need
3) Change in `index.html`: `<title> ... </title>`
4) Meet [host requirements](#host-requirements)
5) Maybe change `APP_FQDN` and `APP_PORT` in `.env` (create if needed) to avoid origin collisions
6) Type `just` and go from there

**Getting upstream improvements:**

1) `git checkout upstream`
2) `git pull`
3) `git checkout main`
4) `git merge upstream`

You'll have to manually fix the differences where they conflict (they will).

## Host requirements

  - [just](https://github.com/casey/just)
  - [docker](https://docs.docker.com/get-started/)
  - [deno](https://deno.land/manual/getting_started/installation)
  - [mkcert](https://github.com/FiloSottile/mkcert#installation)

That's it. Commands are self-documenting: just type `just`

## Features

   - automatic https certificate generation
   - single command development (`just dev`)
   - single command publishing to [npm](https://www.npmjs.com/)
   - single command publishing to [github pages](https://pages.github.com/)
   - `vite` for fast building
   - `react` for efficient, fast loading sites
   - `typescript` for type checking
   - `chakra-ui.com` for the UI framework
   - `just` for a single method to build/test/deploy/publish
   - `docker` because I don't want to touch/rely your host system except where needed
   - [Github Pages](https://pages.github.com/) publishing
     - automatic versioning:
       - `/`: latest
       - `/v1.5.2/`: that version tag (so all published versions are available forever)
   - [npm](https://www.npmjs.com/) module publishing
     - automatic versioning, linked with above
     - external package versioned with the publised website
   - Common UI elements
     - Help button showing the (rendered) local `./Readme.md` file
     - Options (configurable) stored encoded in the URL hash params
   - Metaframe outputs updated below, when connected.
   - `just`file powered, dockerized, automated with dual human/CI controls


## Assumptions:

 - `just` will be the command runner, not `npm` (directly) or `make` or any other underlying tech specific command runner. `just` is the main entry point to control all aspects of the software lifecycle.
   - Prefer contextual error messages with calls to action over documentation that is not as close as possible to the code or commands. Distance creates indirection and staleness and barriers to keep updated.
 - You are building to publish at github pages with the url: `https://<user_org>.github.io/<repo-name>/`
   - github pages 👆 comes with limited options for some config:
     - we build browser assets in `./docs` instead of `./dist` (typical default) so that publishing to github pages is less configuration
 - Operating this repository should be "easy" and enjoyable. It's a product of love and passion, I am hoping that you enjoy using at least just a little bit.

## Steps:

  1. Fork this repo
  2. Clone locally
  3. Modify `package.json` fields to match your own repository e.g. change the module name
  4. `just dev`
       - Modify code and publish:
       - `just publish`
