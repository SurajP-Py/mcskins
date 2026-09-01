"use client";

import { useState } from "react";
import SkinViewer from "@/components/SkinViewer";

export default function Home() {
  const [ign, setIgn] = useState("");
  const [skinUrl, setSkinUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFetchSkin() {
    if (!ign.trim()) return;

    setLoading(true);
    setError(null);
    setSkinUrl(null);

    try {
      const res = await fetch(`http://localhost:8000/api/skin/${ign}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSkinUrl(data.skin_url);
      }
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-900 px-6 font-minecraft">
      <h1 className="text-2xl tracking-wide text-neutral-100">
        Skin Customizer
      </h1>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <label htmlFor="ign" className="text-sm text-neutral-400">
          Minecraft username
        </label>
        <input
          id="ign"
          type="text"
          value={ign}
          onChange={(e) => setIgn(e.target.value)}
          placeholder="Steve"
          maxLength={16}
          className="w-full rounded-sm border-2 border-neutral-600 bg-neutral-800 px-3.5 py-3 text-base text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-neutral-400"
        />
        <button
          onClick={handleFetchSkin}
          disabled={loading}
          className="mt-2 rounded-sm border-2 border-neutral-600 bg-neutral-700 px-3.5 py-2.5 text-sm text-neutral-100 hover:bg-neutral-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get skin"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {skinUrl && (
        <>
          <img
            src={skinUrl}
            alt={`${ign}'s Minecraft skin`}
            className="w-32 h-32 border-2 border-neutral-600"
            style={{ imageRendering: "pixelated" }}
          />
          <SkinViewer skinUrl={skinUrl} />
        </>
      )}
    </main>
  );
}