mkdir -p pg_certs
cd pg_certs

# Generate server private key
openssl genrsa -out server.key 2048

# Generate server certificate signing request
openssl req -new -key server.key -out server.csr -subj "/CN=postgres"

# Self-sign the server certificate
openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365

# Secure the key permissions
chmod 600 server.key
cd ..