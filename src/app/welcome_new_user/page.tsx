import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function WelcomeNewUser() {
  return (
    <main className="min-h-screen  md:flex md:items-center md:justify-center p-6 md:min-h-[90vh]">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎉 Welcome Aboard!
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Your account has been successfully created and confirmed. We're
          excited to have you with us!
        </p>

        <Link href="/dashboard">
          <Button variant={"green"} className="text-xl py-6 cursor-pointer">
            Go to Your Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
