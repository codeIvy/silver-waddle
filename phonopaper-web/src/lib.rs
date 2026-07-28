use wasm_bindgen::prelude::*;
use phonopaper_rs::decode::{Synthesizer, SynthesisOptions};

const BINS: usize = 384;
const SAMPLES_PER_COLUMN: usize = 353;

#[wasm_bindgen]
pub struct WebSynth {
    inner: Synthesizer<SAMPLES_PER_COLUMN>,
    pcm: [f32; SAMPLES_PER_COLUMN],
    amplitudes: [f32; BINS],
}

#[wasm_bindgen]
impl WebSynth {
    #[wasm_bindgen(constructor)]
    pub fn new() -> WebSynth {
        WebSynth {
            inner: Synthesizer::new(SynthesisOptions::default()),
            pcm: [0.0; SAMPLES_PER_COLUMN],
            amplitudes: [0.0; BINS],
        }
    }

    /// Input is one grayscale image column:
    /// 255 = silence, 0 = maximum amplitude.
    pub fn synthesize_column(&mut self, grayscale: &[u8]) -> Result<Vec<f32>, JsValue> {
        if grayscale.len() != BINS {
            return Err(JsValue::from_str("expected exactly 384 grayscale values"));
        }

        for (dst, &pixel) in self.amplitudes.iter_mut().zip(grayscale.iter()) {
            let darkness = 1.0 - pixel as f32 / 255.0;
            *dst = if darkness < 0.08 {
                0.0
            } else {
                ((darkness - 0.08) / 0.92).clamp(0.0, 1.0)
            };
        }

        self.inner
            .synthesize_column(&self.amplitudes, &mut self.pcm);

        Ok(self.pcm.to_vec())
    }

    pub fn reset(&mut self) {
        self.inner.reset();
    }
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_owned()
}
