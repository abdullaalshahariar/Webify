import { initEditor } from "./editor/config";
import { onMount, onCleanup } from "solid-js";
import styles from "./AnotherApp.module.css";

const App = () => {
  let editorRef;
  let editorInstance;

  onMount(() => {
    if (editorRef) {
      editorInstance = initEditor(editorRef);
    }
  });

  onCleanup(() => {
    if (editorInstance) {
      editorInstance.destroy();
    }
  });

  //trying to make it look like canva
  // three column layout, left , center, right

  return (
    <div class="app-container">
      <div class="editor-shell">
        {/* Column 1: Left (blocks and layers) */}
        <aside class="sidebar-left">
          <div class="panel-header"> Elements </div>
          <div id="blocks-container"> </div>
        </aside>

        {/* Column 2: Center (the stage, it will contain the canvas and topbar) */}
        <main class="editor-main">

          {/* The top bar */}
          <header class="editor-topbar">
            <div class="device-toggles">
              <button id="set-desktop"> Desktop </button>
              <button id="set-tablet"> Tablet </button>
              <button id="set-mobile"> Mobile </button>
            </div>

            <button class="save-btn">Export</button>
          </header>

          {/* The canvas */}
          <div class="canvas-wrapper">
            <div ref={editorRef} > </div>
          </div>
        </main>


        {/* Column 3: Right (styles and settings) */}
        <aside class="sidebar-right">
          <div class="panel-header"> Styles </div>
          <div id="styles-container"> </div>
          <div id="traits-container"> </div>
        </aside>
      </div>
    </div>

  );
};

export default App;
