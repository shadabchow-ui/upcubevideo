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
          num_frames: 24,
          fps: 8,
        },
      }
    );

    // Replicate returns a URL or array depending on model
    const video =
      typeof output === 'string'
        ? output
        : Array.isArray(output)
        ? output[0]
        : output?.url;

    if (!video) {
      throw new Error('No video returned');
    }

    return new Response(JSON.stringify({ video }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Generation failed' }),
      { status: 500 }
    );
  }
}













