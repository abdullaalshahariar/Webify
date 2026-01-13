import { initEditor } from "./editor/config";
import { onMount, onCleanup } from "solid-js";

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

  return (
    <div class="app-container">
      <div ref={editorRef}>

      </div>
    </div>

  );
};

export default App;
