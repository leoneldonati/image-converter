import type { APIRoute } from "astro";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
async function convert(file: File, toFormat: string) {
  const path = `./CONVERTED_IMAGES/converted-file-${crypto.randomUUID()}-${`${new Date().getDay()}-${
    new Date().getMonth() + 1
  }-${new Date().getFullYear()}`}.${toFormat}`;
  const buffer = await sharp(await file.arrayBuffer())
    .toFormat(toFormat as keyof sharp.FormatEnum | sharp.AvailableFormatInfo)
    .toBuffer();

  await writeFile(path, buffer);
}
export const POST: APIRoute = async ({ request, url }) => {
  try {
    const toFormat = new URL(url).searchParams.get("toFormat") ?? "avif";
    const form = await request.formData();
    const files = form.getAll("assets") as File[];

    files.forEach((file) => convert(file, toFormat));

    return new Response(JSON.stringify({}));
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({}), { status: 500 });
  }
};
