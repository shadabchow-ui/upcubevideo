export const runtime = "edge";

import Replicate from "replicate";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return Response.json(
      { error: "Prompt required" },
      { status: 400 }
    );
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });

  const output = await replicate.run(
    "genmoai/mochi-1",
    {
      input: {
        prompt,
        num_frames: 24,
        fps: 8,
        guidance_scale: 7.5,
      },
    }
  );

  return Response.json({ video: output });
}

