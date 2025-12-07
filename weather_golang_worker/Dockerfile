FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY . .

RUN go mod init goworker && go mod tidy
RUN go build -o worker main.go

FROM alpine:3.19

WORKDIR /app
COPY --from=builder /app/worker .

CMD ["./worker"]
