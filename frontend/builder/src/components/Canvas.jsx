import { onCleanup, onMount } from 'solid-js';
import styles from './Canvas.module.css';
import grapesjs from 'grapesjs';

//selected device classes
const deviceClasses = {
    "Desktop": styles.container_desktop,
    "Tablet": styles.container_tablet,
    "Mobile": styles.container_mobile
}

//globale editor instance
let editor;

//function to make the editor instance available gobally
export function getEditor() {
    return editor;
}

export function Canvas(props) {
    let canvasRef;

    onMount(() => {
        editor = grapesjs.init({
            container: canvasRef,
            fromElement: true,
            height: '100%',
            width: '100%',

            //prevents auto save
            storageManager: false,

            //do not create default panels
            panels: { defaults: [] },

            //grapes js handles different devices
            deviceManager: {
                devices: [
                    {
                        id: 'Desktop',
                        name: 'Desktop',
                        width: '', // default size
                    },
                    {
                        id: 'Tablet',
                        name: 'Tablet',
                        width: '768px',
                        widthMedia: '992px',
                    },
                    {
                        id: 'Mobile',
                        name: 'Mobile',
                        width: '375px',
                        widthMedia: '576px',
                    },
                ],
            },

            //we will not attach mamnagers to default UI
            // rather provide our own custom UI
            layerManager: { appendTo: '' },
            selectorManager: { appendTo: '' },
            styleManager: { appendTo: '' },
            traitManager: { appendTo: '' },
            blockManager: { appendTo: '' },
        });

        //registering my custom blocks
        editor.BlockManager.add('paragraph', {
            label: 'Paragraph',
            content: '<p>Insert your text here</p>',
            catagory: 'Basic',
        });

        editor.BlockManager.add('heading', {
            label: 'Heading',
            content: '<h2>Heading</h2>',
            category: 'Basic',
        });

        editor.BlockManager.add('list', {
            label: 'List',
            content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
            category: 'Basic',
        });

        editor.BlockManager.add('table', {
            label: 'Table',
            content: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>',
            category: 'Basic',
        });

        editor.BlockManager.add('image', {
            label: 'Image',
            content: '<img src="https://via.placeholder.com/350x150" alt="placeholder"/>',
            category: 'Media',
        });

        editor.BlockManager.add('video', {
            label: 'Video',
            content: '<video controls><source src="" type="video/mp4"></video>',
            category: 'Media',
        });

        editor.BlockManager.add('audio', {
            label: 'Audio',
            content: '<audio controls><source src="" type="audio/mpeg"></audio>',
            category: 'Media',
        });

        //clearing the default components and styles
        // editor.on('load', () => {
        //     const bm = editor.BlockManager;
        //     bm.getAll().reset();
        // });
    });

    onCleanup(() => {
        if (editor) editor.destroy();
    });

    return (
        <div ref={canvasRef} class={deviceClasses[props.selectedDevice]}>

        </div>
    )
}