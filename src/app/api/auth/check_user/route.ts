import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ exists: false, error: error.message });
    }

    const userExists = data.users.some((u) => u.email === email);
    return NextResponse.json({ exists: userExists });
  } catch (err) {
    // 1. Initialize a generic error message
    let errorMessage = "An unknown error occurred on the server.";

    // 2. Check if the error is an instance of the standard JavaScript Error class
    if (err instanceof Error) {
      // If it is an Error, safely access its message
      errorMessage = err.message;
    } else if (
      // Optional: Handle other common cases like an object that has a 'message' property
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    ) {
      errorMessage = (err as { message: string }).message;
    }

    // 3. Return the response using the safely derived error message
    return NextResponse.json({ exists: false, error: errorMessage });
  }
}
