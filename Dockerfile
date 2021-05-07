FROM docker.io/library/golang:1.15.8 AS go
WORKDIR /go
RUN go get -d -v \
    github.com/thinkerou/favicon \
    github.com/gin-gonic/gin \
    github.com/gin-gonic/contrib/static
COPY main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

FROM docker.io/library/alpine:latest AS hugo
WORKDIR /hugo
COPY . /hugo
RUN apk update && apk add hugo
RUN hugo

FROM scratch
WORKDIR /server/
COPY --from=go /go/server .
COPY --from=hugo /hugo/public /server/public
EXPOSE 3000
CMD ["./server"]