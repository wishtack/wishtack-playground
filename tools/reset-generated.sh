#!/usr/bin/env sh

set -e

PROJECT_ROOT=$(dirname $(dirname $(realpath "$0")))
GENERATED_DIR=$PROJECT_ROOT/playwright/generated

rm -rf $GENERATED_DIR
mkdir -p $GENERATED_DIR
echo 'export {};' > $GENERATED_DIR/index.ts
