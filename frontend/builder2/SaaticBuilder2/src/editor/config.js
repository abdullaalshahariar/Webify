import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsExport from 'grapesjs-plugin-export';
import gjsForms from 'grapesjs-plugin-forms';

// Import GrapesJS core styles
//We will override some of them
import 'grapesjs/dist/css/grapes.min.css';

export const initEditor = (container) => {
    const editor = grapesjs.init({
        container: container,
        height: '100%',
        width: '100%',
        // fromElement: false, //allows to modify existing HTML

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
        selectorManager: {
            appendTo: '#selector-container', // This puts it in the same box as your styles
            states: [
                { name: 'hover', label: 'Hover' },
                { name: 'active', label: 'Click' },
            ],
        },

        // aetting up devices for the toggles to work
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' }, // empty means width = 100%
                { name: 'Tablet', width: '768px', widthMedia: '992px' },
                { name: 'Mobile', width: '320px', widthMedia: '480px' },
            ]
        },
        storageManager: {
            id: 'webify-builder',
            type: 'local',
            autosave: true,
            autoload: true,
            stepsBeforeSave: 1,

            options: {
                local: {
                    key: 'gjs-project-data',
                }
            },

            // storeComponents: true,
            // storeStyles: true,
            // storeHtml:true,
            // storeCss: true,
        },

        selectorManager: {
            states: [
                { name: 'hover', label: 'Hover' },
                { name: 'active', label: 'Click' },
                { name: 'nth-of-type(2n)', label: 'Even/Odd' }
            ],
        },

        //load the preset webpage plugin
        plugins: [gjsBlocksBasic, gjsExport, gjsForms,],
        pluginsOpts: {
            [gjsBlocksBasic]: {
                flexGrid: true,
            },
        }
    });

    return editor;
}