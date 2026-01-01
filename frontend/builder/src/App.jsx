import { createSignal } from "solid-js";
import { BlockContent } from "./components/BlockContent";
import { PatternContent } from "./components/PatternContent";
import { Topbar } from "./components/Topbar";

const App = () => {
  const [showBlockContent, setShowBlockContent] = createSignal(true);

  return (
    <div>
      <Topbar onOpen={() => setShowBlockContent(true)} />

      {showBlockContent() && (
        <BlockContent onClose={() => setShowBlockContent(false)} />
      )}
    </div>

  );
};

export default App;
