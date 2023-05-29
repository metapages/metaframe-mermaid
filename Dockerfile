# deno not node because long-term deno will be used for all non-trivial scripting
FROM denoland/deno:alpine-1.25.2

RUN apk --no-cache --update add \
    bash \
    curl \
    git \
    jq \
    npm \
    openssh \
    ripgrep

# Needs edge repo
RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
    sd

###############################################################################
# justfile for running commands, you will mostly interact with just
# https://github.com/casey/just
###############################################################################
RUN VERSION=1.0.0 ; \
    SHA256SUM=342f8582d929b9212ffcbe9f7749e12908053cf215eb8d4a965c47ea2f24b0a4 ; \
    curl -L -O https://github.com/casey/just/releases/download/$VERSION/just-$VERSION-x86_64-unknown-linux-musl.tar.gz && \
    (echo "$SHA256SUM  just-$VERSION-x86_64-unknown-linux-musl.tar.gz" | sha256sum -c -) && \
    mkdir -p /usr/local/bin && \
    tar -xzf just-$VERSION-x86_64-unknown-linux-musl.tar.gz -C /usr/local/bin just && \
    rm -rf just-$VERSION-x86_64-unknown-linux-musl.tar.gz
# Unify the just binary location on host and container platforms because otherwise the shebang doesn't work properly due to no string token parsing (it gets one giant string)
ENV PATH $PATH:/usr/local/bin
# alias "j" to just, it's just right there index finger
RUN echo -e '#!/bin/bash\njust "$@"' > /usr/bin/j && \
    chmod +x /usr/bin/j
ENV JUST_SUPPRESS_DOTENV_LOAD_WARNING=1

###############################################################################
# watchexec for live reloading in development
# https://github.com/watchexec/watchexec
###############################################################################
RUN VERSION=1.14.1 ; \
    SHA256SUM=34126cfe93c9c723fbba413ca68b3fd6189bd16bfda48ebaa9cab56e5529d825 ; \
    curl -L -O https://github.com/watchexec/watchexec/releases/download/$VERSION/watchexec-$VERSION-i686-unknown-linux-musl.tar.xz && \
    (echo "$SHA256SUM  watchexec-${VERSION}-i686-unknown-linux-musl.tar.xz" | sha256sum -c) && \
    tar xvf watchexec-$VERSION-i686-unknown-linux-musl.tar.xz watchexec-$VERSION-i686-unknown-linux-musl/watchexec -C /usr/bin/ --strip-components=1 && \
    rm -rf watchexec-*

# git on unconfigured systems requires these set for some operations
RUN git config --global user.email "ci@rob.ot"
RUN git config --global user.name "robot"

# Newer version of npm
RUN /usr/bin/npm i -g npm@8.17.0

# /repo is also hard-coded in the justfile
WORKDIR /repo

# https://github.com/actions/runner/issues/2033
RUN git config --global --add safe.directory /github/workspace
RUN git config --global --add safe.directory /repo

# Add user aliases to the shell if available
RUN echo "if [ -f /repo/.tmp/.aliases ]; then source /repo/.tmp/.aliases; fi" >> /root/.bashrc
