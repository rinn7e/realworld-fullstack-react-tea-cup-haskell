#!/usr/bin/env bash

# Source .envrc to get DB_CONN if it's not already set
if [ -f .envrc ]; then
    # shellcheck disable=SC1091
    source .envrc
fi

if [ -z "$DB_CONN" ]; then
    echo "Error: DB_CONN is not set. Please make sure .envrc exists or DB_CONN is exported."
    exit 1
fi

# Extract components from connection string
# host=localhost dbname=realworld user=postgres password=postgres port=5432
DB_NAME=$(echo "$DB_CONN" | grep -oP 'dbname=\K[^ ]+')
DB_USER=$(echo "$DB_CONN" | grep -oP 'user=\K[^ ]+')
DB_PASS=$(echo "$DB_CONN" | grep -oP 'password=\K[^ ]+')
DB_HOST=$(echo "$DB_CONN" | grep -oP 'host=\K[^ ]+')
DB_PORT=$(echo "$DB_CONN" | grep -oP 'port=\K[^ ]+')

echo "Resetting database: $DB_NAME"

# Export password for psql
export PGPASSWORD=$DB_PASS

# Use the style requested by the user
printf "\\set AUTOCOMMIT on\ndrop database if exists $DB_NAME; create database $DB_NAME;" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres

echo "Database $DB_NAME has been reset."
