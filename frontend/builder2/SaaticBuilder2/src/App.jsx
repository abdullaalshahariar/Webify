import { initEditor } from "./editor/config";
import { onMount, onCleanup, createSignal } from "solid-js";
import "./AnotherApp.css";

const App = () => {
  let editorRef;
  let editorInstance;

  //signal to track active blocks
  const [activeTab, setActiveTab] = createSignal('blocks');
  //signal to track side bar visibility
  const [isLeftOpen, setLeftOpen] = createSignal(true);
  const [isRightOpen, setRightOpen] = createSignal(true);
  //signal to tracj active device
  const [activeDevice, setActiveDevice] = createSignal('Desktop');
  //signal for theme
  const [isDark, setIsDark] = createSignal(false);
  //signal for previes
  const [isPreview, setIsPreview] = createSignal(false);


  //signal for code modal, html and css
  const [showCodeModal, setShowCodeModal] = createSignal(false);
  const [codeHtml, setCodeHtml] = createSignal("");
  const [codeCss, setCodeCss] = createSignal("");

  onMount(() => {
    if (editorRef) {
      editorInstance = initEditor(editorRef);


      //listening to device changes, so that UI can change accordingly, this is optional
      editorInstance.on('device:select', (device) => {
        // device.getName() might return 'Desktop', 'Tablet', etc.
        setActiveDevice(device.getName() || 'Desktop');
      });

      //lisenting for preview mode toggle
      // Listen for preview mode toggle
      editorInstance.on('run:core:preview:before', () => setIsPreview(true));
      editorInstance.on('stop:core:preview:before', () => setIsPreview(false));
    }
  });



  onCleanup(() => {
    if (editorInstance) {
      editorInstance.destroy();
    }
  });


  //helper function to swith devices
  const handleDeviceChange = (deviceMode) => {
    if (!editorInstance) return;

    setActiveDevice(deviceMode);

    // Direct API call - much more reliable than runCommand
    editorInstance.setDevice(deviceMode);
    setActiveDevice(deviceMode);

  };

  //function to toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark());
  }

  const triggerCommand = (command) => {
    if (editorInstance) editorInstance.runCommand(command);
  };

  const togglePreview = () => {
    if (!editorInstance) return;
    if (isPreview()) {
      editorInstance.stopCommand('core:preview');
    } else {
      editorInstance.runCommand('core:preview');
    }
  };

  const handleExport = () => {
    if (!editorInstance) return;
    const html = editorInstance.getHtml();
    const css = editorInstance.getCss();
    const fullCode = `<html><style>${css}</style><body>${html}</body></html>`;

    // Create a download link
    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.html';
    a.click();
  };

  //code editor logic
  const openCodeEditor = () => {
    // if (!editorInstance) return;
    // setCodeHtml(editorInstance.getHtml());
    // setCodeCss(editorInstance.getCss());
    // setShowCodeModal(true);

    if (!editorInstance) return;
    // This opens the default GrapesJS code viewer modal
    editorInstance.runCommand('export-template');
  };

  const saveCode = () => {
    if (!editorInstance) return;

    // 1. Update HTML: Replace components
    // If we are editing the root, we set the whole canvas
    editorInstance.setComponents(codeHtml());

    // 2. Update CSS
    editorInstance.setStyle(codeCss());

    setShowCodeModal(false);
  };




  //trying to make it look like canva
  // three column layout, left , center, right
  // update: 4 column layout with icon bar

  return (
    <div class="app-container" data-theme={isDark() ? 'dark' : 'light'}>
      {/* Exit Preview Overlay (Visible only when in preview) */}
      <Show when={isPreview()}>
        <button class="exit-preview-btn" onClick={togglePreview}>Exit Preview</button>
      </Show>


      <div class="editor-shell">

        {/* Column 0: the icon bar (The slim side) */}
        <nav class="icon-bar">
          <button onClick={() => { setActiveTab('blocks'); setLeftOpen(true); }}
            class={activeTab() === 'blocks' && isLeftOpen() ? 'active' : ''}
            title="Elements"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            <span>Blocks</span>
          </button>


          <button onClick={() => { setActiveTab('layers'); setLeftOpen(true); }}
            class={activeTab() === 'layers' && isLeftOpen() ? 'active' : ''}
            title="Layers"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>
            <span>Layers</span>
          </button>

          <button onClick={() => triggerCommand('open-assets')} title="Images">
            <span class="icon">🖼</span>
            <span>Assets</span>
          </button>

          <button onClick={toggleTheme} style="margin-top: auto;">
            {isDark() ? '☀' : '☾'}
            <span>Theme</span>
          </button>
        </nav>




        {/* Column 1: Left (blocks and layers) */}
        <aside class={`sidebar-left ${isLeftOpen() ? '' : 'sidebar-collapsed'}`}>
          <div class="panel-header">
            <span>{activeTab()}</span>
            <button class="btn-toggle" onClick={() => setLeftOpen(false)}>x</button>
          </div>


          {/* We use 'display: none' via CSS instead of if-blocks 
            so GrapesJS can still find the IDs on mount */}
          <div id="blocks-container" style={{ display: activeTab() === 'blocks' ? 'block' : 'none' }}></div>
          <div id="layers-container" style={{ display: activeTab() === 'layers' ? 'block' : 'none' }}></div>
        </aside>




        {/* Column 2: Center (the stage, it will contain the canvas and topbar) */}
        <main class="editor-main">

          {/* The top bar */}
          <header class="editor-topbar">

            <div class="topbar-left">
              {!isLeftOpen() && (
                <button class="btn-toggle" style="margin-right:10px" onClick={() => setLeftOpen(true)}>Elements &rarr;</button>
              )}
            </div>

            <div class="topbar-right">
              <div class="device-toggles">
                <button onClick={() => handleDeviceChange('Desktop')}
                  class={activeDevice() === 'Desktop' ? 'active' : ''}
                >
                  Desktop
                </button>

                <button onClick={() => handleDeviceChange('Tablet')}
                  class={activeDevice() === 'Tablet' ? 'active' : ''}
                >
                  Tablet
                </button>

                <button onClick={() => handleDeviceChange('Mobile')}
                  class={activeDevice() === 'Mobile' ? 'active' : ''}
                >
                  Mobile
                </button>
              </div>


              <div class="divider-vertical"></div>

              <button class={`btn-icon ${isPreview() ? 'active' : ''}`} onClick={() => triggerCommand('core:preview')} title="Preview">
                👁
              </button>

              <button class="btn-icon" onClick={openCodeEditor} title="Edit Code">
                {/* Code Icon */}
                &lt;/&gt;
              </button>

              <button class="btn-primary" onClick={() => console.log(editorInstance.getHtml())}>Export</button>

              {!isRightOpen() && (
                <button class="btn-ghost" onClick={() => setRightOpen(true)}>← Styles</button>
              )}
            </div>
          </header>

          {/* The canvas */}
          <div class="canvas-wrapper">
            <div ref={editorRef} > </div>
          </div>
        </main>


        {/* Column 3: Right (styles and settings) */}
        <aside class={`sidebar-right ${isRightOpen() ? '' : 'sidebar-collapsed'}`}>
          <div class="panel-header">
            <span>Styles</span>
            <button class="btn-toggle" onClick={() => setRightOpen(false)}> x </button>
          </div>

          <div id="styles-container"> </div>

          {/* <div class="panel-header" style="margin-top: auto; border-top: 1px solid var(--gjs-border)">
            <span>Settings</span>
          </div> */}

          <div id="traits-container"></div>
        </aside>


        {/* The code editor modal */}
        <Show when={showCodeModal()}>
          <div class="code-modal-container">
            <div class="code-modal-overlay">
              {/* top part */}
              <div class="code-modal-header">
                <span>Code</span>
                <button onClick={() => { setShowCodeModal(false) }}>X</button>
              </div>

              {/* middle part */}
              <div class="code-modal-body">
                <textarea value={codeHtml()} onInput={(e) => setCodeHtml(e.target.value)} placeholder="HTML"></textarea>
                <textarea value={codeCss()} onInput={(e) => setCodeCss(e.target.value)} placeholder="CSS"></textarea>
              </div>

              {/* bottom part */}
              <div class="code-modal-footer">
                <button>Export ZIP</button>
              </div>
            </div>
          </div>

        </Show>

      </div>
    </div>
  );
};

export default App;
