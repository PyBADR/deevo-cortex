import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-d-bg text-d-text">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold text-d-blue">404</h1>
        <p className="mb-8 text-xl text-d-sub">Page not found</p>
        <Link
          to="/"
          className="rounded-xl bg-d-blue px-8 py-3 font-semibold text-d-bg transition hover:bg-d-blue/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
