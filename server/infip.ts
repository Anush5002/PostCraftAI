import { HfInference } from "@huggingface/inference";

export async function generateImageFromText(prompt: string): Promise<string[]> {
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  
  try {
    const blob = await hf.textToImage({
      inputs: prompt,
      model: "black-forest-labs/FLUX.1-schnell",
    }) as any;
    
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${blob.type};base64,${base64}`;
    
    return [dataUrl];
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}

