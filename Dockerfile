FROM docker.io/library/alpine:latest

RUN apk update && apk --no-cache add openssh-client git
RUN mkdir -p ~/.ssh
RUN git config --global user.email "cicd@schlauerlauer.de" && git config --global user.name "cicd"
RUN apk add hugo