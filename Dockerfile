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

ARG user=argocd-extensions-pod-files
ARG group=argocd-extensions-pod-files
ARG uid=1000
ARG gid=1000

# If you bind mount a volume from the host or a data container,
# ensure you use the same uid
RUN groupadd -g ${gid} ${group} \
    && useradd -l -u ${uid} -g ${gid} -m -s /bin/bash ${user}

ENV HOME /home/argocd-extensions-pod-files

RUN mkdir -p ${HOME} && mkdir -p ${HOME}/ui

COPY --from=builder /src/argocd-extensions-pod-files ${HOME}/argocd-extensions-pod-files

RUN chown -R ${uid}:${gid} ${HOME}

USER ${user}

WORKDIR ${HOME}

EXPOSE 8080

CMD ["./argocd-extensions-pod-files"]
