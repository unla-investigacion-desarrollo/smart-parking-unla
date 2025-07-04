mkdir -p certs && cd certs

# Generate CA private key
openssl genrsa -out ca.key 4096

# Generate CA self-signed certificate
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 \
  -out ca.crt -subj "/CN=MyPostgresCA"