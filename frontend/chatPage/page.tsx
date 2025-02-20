"use client";
import { Header } from "@/components/Header";

function Home() {
  return (
    <div className="App font-fruktur">
      {/* {IS_DEV && <TopBanner />} */}
      <Header />

      <div className="flex  items-center justify-center flex-col ">
        <span className="text-5xl"> lol Me: The Treasury Trials</span>
      </div>
    </div>
  );
}

export default Home;
