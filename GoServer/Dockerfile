# ----------------------------------------------------
# Base (deps cached)
# ----------------------------------------------------
FROM golang:1.24-alpine AS base
WORKDIR /app
RUN apk add --no-cache git ca-certificates
ENV CGO_ENABLED=0
COPY go.mod go.sum ./
RUN go mod download

# ----------------------------------------------------
# Dev (hot reload)
# ----------------------------------------------------
FROM base AS dev
RUN go install github.com/air-verse/air@v1.52.3
ENV PATH=$PATH:/go/bin

COPY . .
EXPOSE 8090
CMD ["air", "-c", ".air.toml"]

# ----------------------------------------------------
# Builder (produces binary)
# ----------------------------------------------------
FROM base AS builder
COPY . .
RUN go build \
    -ldflags="-s -w" \
    -o smartparkin

# ----------------------------------------------------
# Runtime (optional, for prod container)
# ----------------------------------------------------
FROM alpine:3.20 AS prod
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/smartparkin .
EXPOSE 8090
ENTRYPOINT ["./smartparkin"]
