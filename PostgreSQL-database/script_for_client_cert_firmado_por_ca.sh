# Client private key
openssl genrsa -out client1.key 4096

# Client certificate signing request
openssl req -new -key client1.key -out client1.csr -subj "/CN=client1"

# Sign client CSR with CA
openssl x509 -req -in client1.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out client1.crt -days 965 -sha256

# Optional: create client PEM combining key and cert
cat client1.key client1.crt > client1.pem

chmod 600 client1.key client1.pem