#!/bin/bash
# scripts/validate-env.sh

# Function to load env file
load_env() {
  if [ -f "$1" ]; then
    echo "Loading environment from $1"
    export $(grep -v '^#' "$1" | grep -v '^$' | xargs)
  fi
}

# Load environment files in Next.js priority order
load_env ".env.local"
if [ "$NODE_ENV" = "production" ]; then
  load_env ".env.production"
else
  load_env ".env.development"
fi
load_env ".env"

# Validate required variables
required_vars=(
  "NEXT_PUBLIC_API_BASE"
  "NEXT_PUBLIC_APP_NAME"
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

echo "All required environment variables are set"