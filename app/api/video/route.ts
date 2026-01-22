export const runtime = 'edge';

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/**
 * POST /api/video
 * Creates a video generation job (async)
 */
export async function POST(req: Request) {
  try {
    const { prompt, quality = 'fast' } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Presets
    const settings =
      quality === 'cinematic'
        ? { num_frames: 121, fps: 24, guidance_scale: 5.5 }
        : { num_frames: 48, fps: 12, guidance_scale: 5 };

    const prediction = await replicate.predictions.create({
      version:
        '1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460', // Mochi-1 pinned
      input: {
        prompt,
        ...settings,
      },
    });

    return Response.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message || 'Failed to create video' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/video?id=xxx
 * Polls job status
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json(
      { error: 'Missing prediction id' },
      { status: 400 }
    );
  }

  try {
    const prediction = await replicate.predictions.get(id);

    const outputUrl =
      Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output ?? null;

    return Response.json({
      status: prediction.status,
      video: outputUrl,
      error: prediction.error ?? null,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message || 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
















