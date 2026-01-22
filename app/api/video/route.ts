export const runtime = "edge";

const MOCHI_VERSION =
  "3f0457a3f0b5f9a56dbbbcd9f8e3e0f65f6c6b92b9f6a7cdbfe7b6f4c90c5d3";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt required" }),
        { status: 400 }
      );
    }

    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MOCHI_VERSION,
        input: {
          prompt,
          num_frames: 24,
          fps: 8,
          guidance_scale: 7.5,
        },
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Replicate error:", text);
      return new Response(text, { status: 500 });
    }

    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API crash:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}




