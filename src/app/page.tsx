import { getContents } from "../utils/supabase.js";
import Feed from "./components/Feed";

export default async function Home() {
  // Get contents from Supabase
  const contents = await getContents();

  return (
    <main className="flex justify-center items-center h-screen">
      <Feed contents={contents} />
    </main>
  );
}
