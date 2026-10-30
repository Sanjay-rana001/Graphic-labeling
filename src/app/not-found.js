import Link from "next/link";
import Image from "next/image";
import SweepButton from "@/components/SweepButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Subtle Ambient Industrial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Riveted Anodized Metal Nameplate 404 Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#161b24] via-[#0e1218] to-[#090b10] border-2 border-amber-500/45 shadow-[0_24px_60px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.15)] p-6 sm:p-8 text-center overflow-hidden">
        {/* Brushed Metal Hairline Texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#ffffff_1px,#ffffff_2px)]"
          aria-hidden="true"
        />

        {/* 4 Corner Stainless-Steel Hex Rivets */}
        {[
          "top-3 left-3",
          "top-3 right-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((pos, idx) => (
          <span
            key={idx}
            className={`absolute ${pos} w-3 h-3 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-black/80 shadow-inner flex items-center justify-center`}
          >
            <span className="w-1.5 h-[1px] bg-zinc-900 rotate-45" />
          </span>
        ))}

        {/* Brand Logo */}
        <div className="relative h-20 w-36 mx-auto mb-3">
          <Image
            src="/Media/Logo.png"
            alt="Sourav Graphic & Metal Label"
            fill
            sizes="160px"
            className="object-contain scale-[1.15]"
            priority
          />
        </div>

        {/* Stamped Brass Error Code Strip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-mono font-black text-xs uppercase tracking-[0.18em] shadow-md mb-3">
          <span>PLATE CODE: ERR-404</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
          Page or Specimen Not Found
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
          The requested URL does not match any active product plate in our B2B
          catalog. Return to the main catalog or upload your custom artwork.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <SweepButton
            href="/"
            label="Back to Product Catalog"
            type="back"
            size="md"
          />
          <Link
            href="/customize"
            className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all"
          >
            Upload Design Photo →
          </Link>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Sourav Graphic &amp; Metal Label • B2B Industrial Manufacturer
        </div>
      </div>
    </div>
  );
}

