import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="shell narrow">
        <p className="eyebrow">404</p>
        <h1>This decision path does not exist.</h1>
        <p>Return to Madabase research or choose one of the focused publications from the homepage.</p>
        <Link className="button button-dark" href="/"><ArrowLeft size={16} aria-hidden="true" />Back to Madabase</Link>
      </div>
    </main>
  );
}
