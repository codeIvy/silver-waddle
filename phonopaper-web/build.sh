#!/usr/bin/env sh
set -eu
wasm-pack build --target web --release
cp -R pkg web/pkg
echo "Built web/pkg"
