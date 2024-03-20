FROM mcr.microsoft.com/vscode/devcontainers/base:debian

ENV DENO_INSTALL=/deno
RUN <<EOL
set -e
mkdir -p ${DENO_INSTALL}
curl -fsSL https://deno.land/x/install/install.sh | sh
chown -R vscode ${DENO_INSTALL}
EOL

ENV SLACK_INSTALL=/slack
RUN <<EOL
set -e
mkdir -p ${SLACK_INSTALL}
curl -fsSL https://downloads.slack-edge.com/slack-cli/slack_cli_2.19.0_linux_64-bit.tar.gz | tar -xvzf - -C ${SLACK_INSTALL}
chown -R vscode ${SLACK_INSTALL}
EOL

ENV PATH=${SLACK_INSTALL}/bin:${DENO_INSTALL}/bin:${PATH} \
  DENO_DIR=${DENO_INSTALL}/.cache/deno \
  SLACK_DIR=${SLACK_INSTALL}/.cache/slack

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install --no-install-recommends <your-package-list-here>
