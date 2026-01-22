export const runtime = 'edge';

import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    // 🔒 Locked to best text→video model (no image required)
    const output = await replicate.run(
      'genmoai/mochi-1',
      {
        input: {
          prompt,
          num_frames: 121,
          fps: 24,
          guidance_scale: 5.5,
        },
      }
    );

    return new Response(
      JSON.stringify({ video: output }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);

    return new Response(
      JSON.stringify({
        error: err?.message || 'Video generation failed',
      }),
      { status: 500 }
    );
  }
}










