export const runtime = 'edge';

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { prompt, quality = 'fast' } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt required' }, { status: 400 });
    }

    // Presets
    const presets =
      quality === 'cinematic'
        ? { num_frames: 121, fps: 24, guidance_scale: 5.5 }
        : { num_frames: 48, fps: 12, guidance_scale: 5 };

    const prediction = await replicate.predictions.create({
      version:
        '1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460', // Mochi-1 locked
      input: {
        prompt,
        ...presets,
      },
    });

    return Response.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || 'Failed to create prediction' },
      { status: 500 }
    );
  }
}















