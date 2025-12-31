import styles from "./PatternContent.module.css";
import search_icon from '../assets/icons/search_icon.svg';

export function PatternContent() {
    return (
        <div class={styles.pattern_content_container}>
            <div class={styles.search_bar}>
                <img src={search_icon} alt="search" />
                <input type="text" placeholder="Search" />
            </div>

            <div class={styles.pattern_items}>
                <button>
                    <span>Navigation</span>
                </button>

                <button>
                    <span>Hero</span>
                </button>

                <button>
                    <span>Gallary</span>
                </button>

                <button>
                    <span>Contact</span>
                </button>

                <button>
                    <span>Footer</span>
                </button>
            </div>
        </div>
    )
}