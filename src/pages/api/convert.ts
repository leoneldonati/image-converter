import type { APIRoute } from "astro";
import sharp from "sharp";

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const toFormat = params?.toFormat;
    const files = await request.formData();

    console.log(files);
    return new Response("");
  } catch (e) {
    console.error(e);
    return new Response("");
  }
};
