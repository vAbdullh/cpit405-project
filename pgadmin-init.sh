#!/bin/sh

# Generate servers.json
cat <<EOF > /pgadmin4/servers.json
{
  "Servers": {
    "1": {
      "Name": "PostgresDB",
      "Group": "Servers",
      "Host": "${POSTGRES_HOST}",
      "Port": ${POSTGRES_PORT},
      "MaintenanceDB": "${POSTGRES_DB}",
      "Username": "${POSTGRES_USER}",
      "SSLMode": "prefer"
    }
  }
}
EOF

# Generate pgpass file
echo "${POSTGRES_HOST}:${POSTGRES_PORT}:*:${POSTGRES_USER}:${POSTGRES_PASSWORD}" > /pgpassfile
chmod 600 /pgpassfile

# Execute the original entrypoint
exec /entrypoint.sh
