import styles from './Canvas.module.css';
import { createDroppable } from '@thisbeyond/solid-dnd';
import { For } from 'solid-js';
import { ElementRenderer } from './ElementRenderer';

//selected device classes
const deviceClasses = {
    "Desktop": styles.container_desktop,
    "Tablet": styles.container_tablet,
    "Mobile": styles.container_mobile
}


export function Canvas(props) {
    console.log(props.selectedDevice);

    // =========================================================================
    // STEP 4: MAKE THIS DROPPABLE
    const droppable = createDroppable("canvas-root");
    // =========================================================================

    return (

        <div ref={droppable} class={deviceClasses[props.selectedDevice]} style={{ "min-height": "100vh" }}>


            {/* STEP 5: RENDER THE ELEMENTS */}
            <For each={props.elements}>
                {(item) => <ElementRenderer element={item} />}
            </For>


        </div>
    )
}