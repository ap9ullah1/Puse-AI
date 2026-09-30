import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-24">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Built with the YouCam API
        </p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight">Puse</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Get your skin&apos;s real pulse, then shop for it. Upload a selfie for an AI skin
          analysis, get matched skincare, and try on apparel before you buy — powered by YouCam
          Skin AI and Virtual Try-On.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/analyze"
          className="flex-1 rounded-2xl bg-black px-6 py-5 text-center text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <p className="text-lg font-medium">Analyze my skin</p>
          <p className="mt-1 text-sm opacity-70">YouCam Skin AI</p>
        </Link>
        <Link
          href="/catalog"
          className="flex-1 rounded-2xl border border-zinc-300 px-6 py-5 text-center transition hover:border-black dark:border-zinc-700 dark:hover:border-white"
        >
          <p className="text-lg font-medium">Try on apparel</p>
          <p className="mt-1 text-sm opacity-70">YouCam Virtual Try-On</p>
        </Link>
      </div>

      <Link href="/history" className="text-center text-sm text-zinc-500 hover:underline">
        View your history →
      </Link>
    </main>
  );
}
