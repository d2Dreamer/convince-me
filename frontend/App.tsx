import { Header } from "@/components/Header";
import { Counter } from "@/components/Counter";
import { TopBanner } from "@/components/TopBanner";

import { IS_DEV } from "./constants";

function App() {
  return (
    <div className="App font-fruktur">
      {/* {IS_DEV && <TopBanner />} */}
      <Header />

      <div className="flex  items-center justify-center flex-col ">
        <span className="text-5xl"> Convince Me: The Treasury Trials</span>
        <span className="text-md mb-10 mt-3">
          Outwit a cunning AI Treasury Agent with sharp words and clever
          strategies to claim its guarded fortune.
        </span>

        <div className="flex gap-5 mt-5 items-center justify-center flex-wrap ">
          <img
            src="./ai1.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
          <img
            src="./ai2.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
        </div>
        <div className="flex gap-5 mt-5 items-center justify-center flex-wrap ">
          <img
            src="./ai3.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
          <img
            src="./ai4.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
        </div>
        <div className="flex gap-5 mt-5 items-center justify-center flex-wrap ">
          <img
            src="./ai5.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
          <img
            src="./ai6.jpg"
            className="h-36 w-auto rounded-sm border-[2px] "
          />
        </div>
      </div>
    </div>
  );
}

export default App;
