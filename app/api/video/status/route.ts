export const runtime = 'edge';

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.get(id);

    return Response.json({
      status: prediction.status,
      output:
        Array.isArray(prediction.output)
          ? prediction.output[0]
          : prediction.output,
      error: prediction.error,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
