#!/bin/bash
source .env
docker-compose up -d && cd ../app/ && npm run dev