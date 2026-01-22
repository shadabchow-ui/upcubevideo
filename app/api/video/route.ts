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
      'sunfjun/stable-video-diffusion:d68b6e09eedbac7a49e3d8644999d93579c386a083768235cabca88796d70d82',
      {
        input: {
          prompt,
        },
      }
    );

    return new Response(
      JSON.stringify({ video: output }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err?.message || 'Video generation failed',
      }),
      { status: 500 }
    );
  }
}









