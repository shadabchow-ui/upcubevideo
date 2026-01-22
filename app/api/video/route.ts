export const runtime = "edge";

const MOCHI_VERSION =
  "1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460";

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
          fps: 24,
          num_frames: 121,
          guidance_scale: 5.5,
          num_inference_steps: 30,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Replicate error:", data);
      return new Response(JSON.stringify(data), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}







