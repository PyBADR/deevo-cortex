import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070b] text-white">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold text-cyan-300">404</h1>
        <p className="mb-8 text-xl text-white/70">Page not found</p>
        <Link
          to="/"
          className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
