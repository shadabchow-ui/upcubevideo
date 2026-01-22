export const runtime = "edge";

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
        model: "genmoai/mochi-1",
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
      return new Response(
        JSON.stringify({ error: text }),
        { status: 500 }
      );
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



