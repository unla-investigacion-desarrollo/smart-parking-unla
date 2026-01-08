# ----------------------------------------------------
# Base: modules & caching
# ----------------------------------------------------
FROM golang:1.24-alpine AS base
WORKDIR /app
RUN apk add --no-cache git bash build-base
ENV GO111MODULE=on
ENV GOPROXY=https://proxy.golang.org,direct
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# ----------------------------------------------------
# Dev stage
# ----------------------------------------------------
FROM base AS dev
RUN go install github.com/air-verse/air@v1.52.3
ENV PATH=$PATH:/go/bin
COPY . .
RUN go mod tidy
RUN go mod download && go mod verify

EXPOSE 8090
CMD ["air", "-c", ".air.toml"]