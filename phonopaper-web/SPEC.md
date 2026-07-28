# Implementation spec

## Goal
A small browser app with two pages:

- `encoder.html`: record up to 10 seconds and generate a grayscale sound image.
- `decoder.html`: user points the Android camera at that image and hears sound while moving the camera left or right.

Compatibility with the original PhonoPaper app is not required.

## Architecture
- Rust compiled to WebAssembly:
  - audio analysis;
  - image rendering;
  - stateful additive synthesis.
- Plain JavaScript:
  - microphone and camera access;
  - canvas pixel extraction;
  - Web Audio playback.

## Internal format
- 384 logarithmic frequency bins.
- Top = high frequency; bottom = low frequency.
- White = silence; black = loud.
- 125 image columns per second.
- 353 PCM samples per decoded column at 44.1 kHz.
- Simple black marker bands above and below the data.

## Encoder
Input: mono `Float32Array` PCM and sample rate.

Output:
- grayscale pixel array;
- image width and height.

Steps:
1. resample to 44.1 kHz;
2. STFT;
3. map FFT energy to 384 logarithmic bins;
4. normalize per recording;
5. render markers and data to a PNG canvas.

## Decoder
Input per camera frame:
- grayscale scan column sampled between detected marker bands.

Output:
- 353 mono PCM samples.

Steps:
1. JavaScript finds top and bottom marker bands;
2. JavaScript samples 384 grayscale values at the center of the camera frame;
3. Wasm converts darkness to amplitudes;
4. stateful Rust synthesizer generates one PCM block;
5. JavaScript queues blocks for playback.

## First milestone
- Wasm wrapper builds.
- `synthesize_column(Uint8Array[384]) -> Float32Array[353]`.
- Encoder accepts PCM and returns a rendered image buffer.
- Desktop image test before live Android camera tuning.
