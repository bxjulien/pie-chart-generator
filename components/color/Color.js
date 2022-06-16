import { BlockPicker } from 'react-color';
import styles from './Color.module.scss';

const Color = ({ label, color, onFocusPicker, onSelectColor, isPickerActive }) => {
  return (
    <div className={styles.color}>
      {label && <span>{label}</span>}
      <div
        className={styles.square}
        style={{ backgroundColor: color }}
        onClick={onFocusPicker}
      >
        <div
          className={styles.pickerContainer}
          style={{ display: isPickerActive ? 'block' : 'none' }}
        >
          <div className={styles.picker}>
            <BlockPicker
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