import styles from "./DeviceSelector.module.css";
import tick_icon from "../assets/icons/tick_icon.svg";
import { createSignal } from "solid-js";

const [selectedDevice, setSelectedDevice] = createSignal("Desktop");

export function DeviceSelector() {
    return (
        <div class={styles.container}>
            <button onClick={() => setSelectedDevice('Desktop')}>
                <span>Desktop</span>
                {selectedDevice() === 'Desktop' && <img src={tick_icon} alt="Selected" />}
            </button>
            <button onClick={() => setSelectedDevice('Tablet')}>
                <span>Tablet</span>
                {selectedDevice() === 'Tablet' && <img src={tick_icon} alt="Selected" />}
            </button>
            <button onClick={() => setSelectedDevice('Mobile')}>
                <span>Mobile</span>
                {selectedDevice() === 'Mobile' && <img src={tick_icon} alt="Selected" />}
            </button>
        </div>
    )
}