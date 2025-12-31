import styles from './Sidebar.module.css';
import cross_icon from '../assets/icons/cross_icon.svg';
import paragraph_icon from '../assets/icons/paragraph_icon.svg';
import heading_icon from '../assets/icons/heading_icon.svg';
import list_icon from '../assets/icons/list_icon.svg';
import table_icon from '../assets/icons/table_icon.svg';
import image_icon from '../assets/icons/image_icon.svg';
import video_icon from '../assets/icons/video_icon.svg';
import audio_icon from '../assets/icons/audio_icon.svg';

export function Sidebar() {
    return (
        <div class={styles.sidebar_container}>
            <div class={styles.top_section}>
                <button>
                    <span>Block</span>
                </button>
                <button>
                    <span>Pattern</span>
                </button>
                <button class={styles.close_button}>
                    <img src={cross_icon} alt="close" />
                </button>
            </div>


            <span class={styles.label_span}>TEXT</span>
            <div class={styles.text_items}>
                <button>
                    <img src={paragraph_icon} alt="paragraph" />
                    <span>Paragraph</span>
                </button>

                <button>
                    <img src={heading_icon} alt="heading" />
                    <span>Heading</span>
                </button>

                <button>
                    <img src={list_icon} alt="list" />
                    <span>List </span>
                </button>

                <button>
                    <img src={table_icon} alt="table" />
                    <span>Table</span>
                </button>
            </div>


            <span class={styles.label_span}>MEDIA</span>
            <div class={styles.media_items}>
                <button>
                    <img src={image_icon} alt="image" />
                    <span>Image</span>
                </button>

                <button>
                    <img src={audio_icon} alt="audio" />
                    <span>Audio</span>
                </button>

                <button>
                    <img src={video_icon} alt="video" />
                    <span>Video</span>
                </button>
            </div>

        </div>
    )
}