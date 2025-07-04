FROM postgres:15

COPY ./certs/server.crt /var/lib/postgresql/server.crt
COPY ./certs/server.key /var/lib/postgresql/server.key
COPY ./certs/ca.crt /var/lib/postgresql/ca.crt
COPY ./postgresql.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf

RUN chown postgres:postgres /var/lib/postgresql/server.key /var/lib/postgresql/server.crt /var/lib/postgresql/ca.crt \
    && chmod 600 /var/lib/postgresql/server.key

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]