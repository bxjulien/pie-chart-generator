import { TwitterPicker } from 'react-color';
import styles from './Color.module.scss';

const Color = ({ label, color, onFocusPicker, onSelectColor, isPickerActive }) => {

  const test = (e) => {
    console.log("test")
    e.stopPropagation();
  }

  return (
    <div className={styles.color}>
      {label && <span>{label}</span>}
      <div
        className={styles.square}
        style={{ backgroundColor: color }}
        onClick={onFocusPicker}>

        <div
          onClick={(e) => test(e)}
          className={styles.pickerContainer}
          style={{ display: isPickerActive ? 'block' : 'none' }}
        >
          <div className={styles.picker}>
            <TwitterPicker
              triangle='hide'
              color={color}
              onChangeComplete={(color) => onSelectColor(color)}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Color;