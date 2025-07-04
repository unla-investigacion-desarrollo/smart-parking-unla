#!/bin/bash
set -e

chown postgres:postgres /var/lib/postgresql/server.key /var/lib/postgresql/server.crt /var/lib/postgresql/ca.crt
chmod 600 /var/lib/postgresql/server.key

exec docker-entrypoint.sh postgres -c config_file=/etc/postgresql/postgresql.conf
