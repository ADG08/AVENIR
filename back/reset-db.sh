#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Resetting PostgreSQL database...${NC}"

# Docker container name
CONTAINER_NAME="avenir-postgres"
DB_USER="avenir_user"
DB_NAME="avenir_db"

# Check if container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}Container $CONTAINER_NAME is not running${NC}"
    echo -e "${YELLOW}Start it with: docker compose --profile postgres up -d${NC}"
    exit 1
fi

echo -e "${YELLOW}Dropping and recreating database...${NC}"

# Drop and recreate database using docker exec
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d postgres <<EOF
-- Terminate all connections to the database
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();

-- Drop and recreate database
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to reset database${NC}"
    exit 1
fi

echo -e "${GREEN}Database dropped and recreated${NC}"

echo -e "${YELLOW}Applying initial schema (init.sql)...${NC}"

# Apply init.sql using docker exec
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < infrastructure/database/postgres/init.sql

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to apply initial schema${NC}"
    exit 1
fi

echo -e "${GREEN}Initial schema applied${NC}"

echo -e "${YELLOW}Applying migrations...${NC}"

# Apply migrations in order
for migration in infrastructure/database/postgres/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo -e "${YELLOW}  Applying $(basename $migration)...${NC}"
        docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < "$migration"

        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to apply migration: $(basename $migration)${NC}"
            exit 1
        fi

        echo -e "${GREEN}  Applied $(basename $migration)${NC}"
    fi
done

echo -e "${GREEN}All migrations applied${NC}"

echo -e "${YELLOW}Loading fixtures (seed data)...${NC}"

# Apply fixtures in order
for fixture in infrastructure/database/postgres/fixtures/*.sql; do
    if [ -f "$fixture" ]; then
        echo -e "${YELLOW}  Loading $(basename $fixture)...${NC}"
        docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < "$fixture"

        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to load fixture: $(basename $fixture)${NC}"
            exit 1
        fi

        echo -e "${GREEN}  Loaded $(basename $fixture)${NC}"
    fi
done

echo -e "${GREEN}All fixtures loaded${NC}"

echo -e "${GREEN}Database reset complete!${NC}"
echo -e "${BLUE}Database is ready with schema + migrations + fixtures${NC}"
