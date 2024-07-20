FROM node:22.4.0-bookworm as ui-builder

WORKDIR /src

ADD ./ui/package.json ./ui/package-lock.json ./

RUN npm i --frozen-lockfile

ADD ./ui ./

RUN npm run build && \
    mkdir ./resources && \
    cp ./dist/assets/index-*.js ./resources/extension-pod-files.js && \
    tar -czvf extension.tar.gz ./resources

FROM golang:1.22.5-bookworm as builder

WORKDIR /src

ADD go.* ./
RUN go mod download

ADD . ./

RUN go build -v

FROM debian:bookworm-slim

# update ca-certificates
RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

ARG user=argocd-extension-pod-files
ARG group=argocd-extension-pod-files
ARG uid=1000
ARG gid=1000

# If you bind mount a volume from the host or a data container,
# ensure you use the same uid
RUN groupadd -g ${gid} ${group} \
    && useradd -l -u ${uid} -g ${gid} -m -s /bin/bash ${user}

ENV HOME /home/argocd-extension-pod-files

RUN mkdir -p ${HOME} && mkdir -p ${HOME}/ui

COPY --from=builder /src/argocd-extension-pod-files ${HOME}/argocd-extension-pod-files
COPY --from=ui-builder /src/extension.tar.gz ${HOME}/ui/extension.tar.gz

RUN chown -R ${uid}:${gid} ${HOME}

USER ${user}

WORKDIR ${HOME}

EXPOSE 8080

ENV GIN_MODE=release

CMD ["./argocd-extension-pod-files"]
