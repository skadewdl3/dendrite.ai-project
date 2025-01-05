import { db, User } from "@db";
import Temp from "./Temp";

export default async function Home() {
  const res = await db.select().from(User);
  console.log(res);

  // const data = JSON.stringify(res);
  return (
    <div>
      <Temp />
    </div>
  );
}
