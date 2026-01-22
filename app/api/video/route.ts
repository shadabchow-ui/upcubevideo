export const runtime = "edge";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt required" }),
        { status: 400 }
      );
    }

    const res = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "genmoai/mochi-1",
        input: {
          prompt,
          num_frames: 24,
          fps: 8,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Replicate error:", text);
      return new Response(
        JSON.stringify({ error: "Replicate request failed" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API crash:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}


