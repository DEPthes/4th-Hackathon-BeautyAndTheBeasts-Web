import { Client } from "@gradio/client";

const response_0 = await fetch(
 "https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav"
);
const exampleAudio = await response_0.blob();

const client = await Client.connect("Steveeeeeeen/Zonos");
const result = await client.predict("/generate_audio", {
 model_choice: "Zyphra/Zonos-v0.1-transformer",
 text: "Hello!!",
 language: "af",
 speaker_audio: exampleAudio,
 prefix_audio: exampleAudio,
 e1: 0,
 e2: 0,
 e3: 0,
 e4: 0,
 e5: 0,
 e6: 0,
 e7: 0,
 e8: 0,
 vq_single: 0.5,
 fmax: 0,
 pitch_std: 0,
 speaking_rate: 5,
 dnsmos_ovrl: 1,
 speaker_noised: true,
 cfg_scale: 1,
 min_p: 0,
 seed: 3,
 randomize_seed: true,
 unconditional_keys: ["speaker"],
});

console.log(result.data);
