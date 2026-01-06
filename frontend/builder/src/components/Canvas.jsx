import styles from './Canvas.module.css';

//selected device classes
const deviceClasses = {
    "Desktop": styles.container_desktop,
    "Tablet": styles.container_tablet,
    "Mobile": styles.container_mobile
}


export function Canvas(props) {
    console.log(props.selectedDevice);

    return (

        <div class={deviceClasses[props.selectedDevice]}>

        </div>
    )
}