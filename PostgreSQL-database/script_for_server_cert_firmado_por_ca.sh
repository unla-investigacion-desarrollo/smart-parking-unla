# Server private key
openssl genrsa -out server.key 4096

# Server certificate signing request
openssl req -new -key server.key -out server.csr -subj "/CN=postgres"

# Sign server CSR with CA
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out server.crt -days 965 -sha256

chmod 600 server.key