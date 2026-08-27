import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h2 className="text-2xl font-bold text-dark-text">404 - Page Not Found</h2>
      <p className="text-sm text-dark-muted mt-2 mb-6">
        The marine copilot view you are looking for does not exist.
      </p>
      <Link href="/login">
        <Button>Return to Sign In</Button>
      </Link>
    </div>
  );
}
