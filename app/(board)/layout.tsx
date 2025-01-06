import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/board/Navbar";
import { headers } from "next/headers";
import { auth } from "@auth/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en">
      <body>
        <Navbar authenticated={Boolean(sessionData)} />
        <div style={{ marginTop: "56px" }}>{children}</div>
      </body>
    </html>
  );
}
