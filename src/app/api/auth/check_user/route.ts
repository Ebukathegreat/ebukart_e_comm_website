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
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message });
  }
}
