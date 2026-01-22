import Replicate from 'replicate';

type ReplicateOutput =
  | string
  | string[]
  | { [key: string]: any };

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

    const output: ReplicateOutput = await replicate.run(
      'sunfjun/stable-video-diffusion:d68b6e09eedbac7a49e3d8644999d93579c386a083768235cabca88796d70d82',
      {
        input: {
          prompt,
          num_frames: 24,
          fps: 8,
        },
      }
    );

    // Normalize output to a single URL
    let video: string | null = null;

    if (typeof output === 'string') {
      video = output;
    } else if (Array.isArray(output)) {
      video = output[0];
    } else if (output && typeof output === 'object') {
      // Some Replicate models return { output: [...] }
      if (Array.isArray(output.output)) {
        video = output.output[0];
      }
    }

    if (!video) {
      throw new Error('No video returned from model');
    }

    return new Response(
      JSON.stringify({ video }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
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














