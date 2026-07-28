# phonopaper-web

Minimal Rust/Wasm sound-image experiment.

## Build

```sh
cargo install wasm-pack
./build.sh
python3 -m http.server 8000 --directory web
```

Open:

- `http://localhost:8000/encoder.html`
- `http://localhost:8000/decoder.html`

The decoder milestone is started. The encoder binding is intentionally next.
