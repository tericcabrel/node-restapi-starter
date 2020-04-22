#!/usr/bin/env bash

sonar-scanner \
  -Dsonar.projectKey=node-rest-api-starter \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$1 \
  -Dsonar.typescript.tsconfigPath=tsconfig.json \
  -Dsonar.inclusions="app/**/*" \
  -Dsonar.exclusions="app/tests/**/*, app/core/mailer/templates/**/*" \
  -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info

# Pass the token of the project as the first argument when executing this file
# Example:
# ./sonar.sh 3660a926a83a7c2f37496d11828e21ea73d34468
