FROM postgres:15-alpine

CMD [ "postgres", "-c", "logging-collector=true", "-c", "log_destination=csvlog", "-c", "log_directory=/var/lib/postgresql/logs" ]