import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';

// Import GrapesJS core styles
//We will override some of them
import 'grapesjs/dist/css/grapes.min.css';

export const initEditor = (container) => {
    const editor = grapesjs.init({
        container: container,
        height: '100%',
        width: '100%',
        fromElement: true, //allows to modify existing HTML

        //prevent loading default panels
        panels: {
            defaults: [],
        },

        blockManager: {
            appendTo: '#blocks-container',
        },
        layerManager: {
            appendTo: '#layers-container'
        },
        styleManager: {
            appendTo: '#styles-container',
        },
        traitManager: {
            appendTo: '#traits-container',
        },

        // aetting up devices for the toggles to work
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' }, // empty means width = 100%
                { name: 'Tablet', width: '768px', widthMedia: '992px' },
                { name: 'Mobile', width: '320px', widthMedia: '480px' },
            ]
        },

        // Define commands for the buttons in SolidJS
        // editor.Commands.add('set-device-desktop', {
        //     run: (editor) => editor.setDevice('Desktop')
        // }),
        // editor.Commands.add('set-device-tablet', {
        //     run: (editor) => editor.setDevice('Tablet')
        // }),
        // editor.Commands.add('set-device-mobile', {
        //     run: (editor) => editor.setDevice('Mobile')
        // }),

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