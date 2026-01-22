export const runtime = "edge";

const SVD_VERSION =
  "d68b6e09eedbac7a49e3d8644999d93579c386a083768235cabca88796d70d82";

const DEFAULT_IMAGE =
  "https://replicate.delivery/pbxt/KcAKZ1wW2WJmjM0Xov9I0VCvjNwCmau64PkNnJUVVWk67Q6d/2261702010499_.pic.jpg";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt ?? "";

    const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: SVD_VERSION,
          input: {
            input_image: DEFAULT_IMAGE,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Replicate error:", data);
      return new Response(JSON.stringify(data), {
        status: response.status || 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("API route error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        detail: error?.message,
      }),
      { status: 500 }
    );
  }
}








