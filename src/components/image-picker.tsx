import { useState } from "react";

export default function ImagePicker({ origin }: { origin: string }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [format, setFormat] = useState("");
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setFiles(files);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    if (files) {
      files.forEach((file: any) => {
        form.append("assets", file);
      });
    }

    const notDraggableFiles = e.target.assets.files.length !== 0;

    if (notDraggableFiles && !files) {
      const assets = Array.from(e.target.assets.files);
      assets.forEach((asset: any) => {
        form.append("assets", asset);
      });
    }
    fetch(`${origin}/api/convert?toFormat=${format}`, {
      method: "POST",
      body: form,
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleFormat = (e) => {
    setFormat(e.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="format">
        <select name="format" id="format" onChange={handleFormat}>
          <option value="">Selecciona formato</option>
          <option value="avif">Avif</option>
          <option value="webp">Webp</option>
          <option value="png">PNG</option>
        </select>
      </label>

      <label
        htmlFor="assets"
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        className="p-2 border border-black flex rounded-md aspect-square max-w-[300px] w-full shadow-blue-700 hover:shadow-inner cursor-pointer"
      >
        <input type="file" name="assets" id="assets" multiple hidden />
        {dragging
          ? "Suelta los archivos aqui"
          : "Arrastra los archivos aqui o selecciona desde la galeria"}
      </label>

      <button type="submit">{loading ? "Convirtiendo" : "Convertir"}</button>
    </form>
  );
}
