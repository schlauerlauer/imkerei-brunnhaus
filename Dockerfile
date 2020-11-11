FROM docker.io/library/alpine:latest

COPY key /root

RUN apk update && apk --no-cache add openssh-client git
RUN chmod 400 /root/key
RUN eval $(ssh-agent -s); ssh-add /root/key
RUN mkdir -p ~/.ssh && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
RUN git config --global user.email "cicd@schlauerlauer.de" && git config --global user.name "cicd"
RUN apk add hugo