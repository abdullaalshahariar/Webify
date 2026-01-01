import { createSignal } from "solid-js";
import { BlockContent } from "./components/BlockContent";
import { Topbar } from "./components/Topbar";
import { DeviceSelector } from "./components/DeviceSelector";

const App = () => {
  const [showBlockContent, setShowBlockContent] = createSignal(false);
  const [showSelectedDevice, setShowSelectedDevice] = createSignal(false);

  return (
    <div>
      <Topbar onOpenSidebar={() => setShowBlockContent(true)} onOpenDeviceSelector={() => !showSelectedDevice() ? setShowSelectedDevice(true) : setShowSelectedDevice(false)} />

      {showBlockContent() && (
        <BlockContent onClose={() => setShowBlockContent(false)} />
      )}

      {showSelectedDevice() && <DeviceSelector />}
    </div>

  );
};

export default App;
