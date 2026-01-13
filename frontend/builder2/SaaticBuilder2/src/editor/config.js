import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';

// Import GrapesJS core styles
//We will override some of them
import 'grapesjs/dist/css/grapes.min.css';

export const initEditor = (container) => {
    const editor = grapesjs.init({
        container: container,
        fromElement: true, //allows to modify existing HTML

        height: '100vh',
        width: 'auto',

        //diable local database for now
        storageManager: false,

        //load the preset webpage plugin
        plugins: [gjsBlocksBasic],
        pluginsOpts: {
            [gjsBlocksBasic]: {
                flexGrid: true,
            },
        }
    });

    return editor;
}