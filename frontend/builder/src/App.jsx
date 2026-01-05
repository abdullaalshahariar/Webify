import { createSignal, onMount } from "solid-js";
import { BlockContent } from "./components/BlockContent";
import { Topbar } from "./components/Topbar";
import { DeviceSelector } from "./components/DeviceSelector";
import { Canvas } from "./components/Canvas";

const App = () => {
  //signal for sidebar block content
  const [showBlockContent, setShowBlockContent] = createSignal(false);
  //signal for device selector
  const [showSelectedDevice, setShowSelectedDevice] = createSignal(false);
  const [selectedDevice, setSelectedDevice] = createSignal("Desktop");


  //removing the loading gif
  onMount(() => {
    const loadingGif = document.getElementById('loading_gif');
    if (loadingGif) {
      loadingGif.remove();
    }
  })

  return (
    <div>
      <Topbar onOpenSidebar={() => setShowBlockContent(true)} onOpenDeviceSelector={() => !showSelectedDevice() ? setShowSelectedDevice(true) : setShowSelectedDevice(false)}
        selectedDevice={selectedDevice()} />

      {showBlockContent() && (
        <BlockContent onClose={() => setShowBlockContent(false)} />
      )}

      {showSelectedDevice() && <DeviceSelector select_a_Device={(device) => setSelectedDevice(device)} selectedDevice={selectedDevice()} />}

      <Canvas />
    </div>

  );
};

export default App;
