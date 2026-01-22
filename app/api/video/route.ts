export const runtime = 'edge';

import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt required' }),
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    const output = await replicate.run(
      "genmoai/mochi-1:1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460",
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
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}












