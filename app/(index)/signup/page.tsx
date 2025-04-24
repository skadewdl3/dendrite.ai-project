import { auth } from "@auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Signup from "@/components/auth/Signup";

export default async function LoginPage() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (Boolean(sessionData)) {
    return redirect("/");
  }

  return <Signup />;
}
