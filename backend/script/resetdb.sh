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

# Helper function to extract keys from the connection string in a cross-platform way
extract_val() {
    local key="$1"
    echo "$DB_CONN" | awk -F"${key}=" '{print $2}' | awk '{print $1}'
}

DB_NAME=$(extract_val "dbname")
DB_USER=$(extract_val "user")
DB_PASS=$(extract_val "password")
DB_HOST=$(extract_val "host")
DB_PORT=$(extract_val "port")

echo "Resetting database: $DB_NAME"

# Export password for psql
export PGPASSWORD=$DB_PASS

# Use the style requested by the user
printf "\\set AUTOCOMMIT on\ndrop database if exists $DB_NAME; create database $DB_NAME;" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres

echo "Database $DB_NAME has been reset."
