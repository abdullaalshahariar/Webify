import styles from "./DeviceSelector.module.css";
import tick_icon from "../assets/icons/tick_icon.svg";
import { createSignal } from "solid-js";

const [selectedDevice, setSelectedDevice] = createSignal("Desktop");

export function DeviceSelector(props) {
    return (
        <div class={styles.container}>
            <button onClick={() => props.select_a_Device('Desktop')}>
                <span>Desktop</span>
                {props.selectedDevice === 'Desktop' && <img src={tick_icon} alt="Selected" />}
            </button>
            <button onClick={() => props.select_a_Device('Tablet')}>
                <span>Tablet</span>
                {props.selectedDevice === 'Tablet' && <img src={tick_icon} alt="Selected" />}
            </button>
            <button onClick={() => props.select_a_Device('Mobile')}>
                <span>Mobile</span>
                {props.selectedDevice === 'Mobile' && <img src={tick_icon} alt="Selected" />}
            </button>
        </div>
    )
}