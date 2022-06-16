import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.scss'
import drawChart from '../utils/drawChart';
import getRandomColor from "../utils/getRandomColor";
import Color from "../components/color/Color";

const graphTypes = ['Donut', 'Pie'];
const sliceContentTypes = ['Text', 'Value', 'Text Value', 'None'];
const legendPositionTypes = ['Bottom', 'Left', 'Right'];
const titlePositionTypes = ['Top', 'Bottom'];

export default function Home() {
  const graphRef = useRef(null);

  const [title, setTitle] = useState('My cool chart');

  const [graphState, setGraphState] = useState({
    data: [
      { name: "My", value: 40, color: 'blue', isPickerActive: false },
      { name: "cool", value: 12, color: 'orange', isPickerActive: false },
      { name: "chart", value: 8, color: 'yellow', isPickerActive: false },
    ],
    donut: true,
    ratio: false,
    displayNames: true,
    graphType: 'Donut',
    sliceContentType: 'Text',
    titlePositionType: 'Top',
    legendPositionType: 'Bottom',
    slicesRatio: false,
    background: { color: 'black', isPickerActive: false }
  });

  useEffect(() => {
    if (graphRef.current) {
      drawChart(graphRef.current, graphState);
    }
  }, [graphRef]);

  const handleChangeData = (key, e, index) => {
    const newData = [...graphState.data];
    if (newData[index]) newData[index][key] = e.target.value;
    setGraphState({ ...graphState, data: newData });
  }

  const addField = () => {
    const newData = [...graphState.data];
    newData.push({ name: '', value: '', color: getRandomColor() })
    setGraphState({ ...graphState, data: newData });
  }

  const removeField = (index) => {
    const newData = [...graphState.data];
    newData.splice(index, 1);
    setGraphState({ ...graphState, data: newData });
  }

  const handleChangeFieldColor = (color, index) => {
    const newData = [...graphState.data];
    newData[index].color = color.hex;
    newData[index].isPickerActive = false;
    setGraphState({ ...graphState, data: newData });
  }

  const handleShowFieldPicker = (index) => {
    const newData = [...graphState.data];
    newData[index].isPickerActive = !newData[index].isPickerActive;
    setGraphState({ ...graphState, data: newData });
  }

  const selectGraphType = (e) => {
    const type = graphTypes.find(type => type === e.target.value)
    if (type) setGraphState({ ...graphState, graphType: type });
  }

  const selectSliceContent = (e) => {
    const type = sliceContentTypes.find(type => type === e.target.value)
    if (type) setGraphState({ ...graphState, sliceContentType: type });
  }

  const selectTitlePosition = (e) => {
    const type = titlePositionTypes.find(type => type === e.target.value)
    if (type) setGraphState({ ...graphState, titlePositionType: type });
  }

  const selectLegendPosition = (e) => {
    const type = legendPositionTypes.find(type => type === e.target.value)
    if (type) setGraphState({ ...graphState, legendPositionType: type });
  }

  const refresh = () => {
    if (graphRef.current) {
      drawChart(graphRef.current, graphState);
    }
  }

  return (
    <main className={styles.layout}>

      <Navbar />

      <div className={styles.content}>
        <div className={styles.config}>

          <div className={styles.title}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={styles.fields}>
            {graphState.data.map((field, index) => {
              return (
                <div className={styles.field} key={index}>
                  <input
                    value={field.name}
                    type={'text'}
                    onChange={(e) => handleChangeData('name', e, index)}
                  />
                  <input
                    value={field.value}
                    type={'number'}
                    onChange={(e) => handleChangeData('value', e, index)}
                  />

















                  <Color
                    color={field.color}
                    onFocusPicker={() => handleShowFieldPicker(index)}
                    onSelectColor={(color) => handleChangeFieldColor(color, index)}
                    isPickerActive={field.isPickerActive}
                  />









                  <img className={styles.delete} onClick={() => removeField(index)} src={'/cross.svg'} alt="delete" />
                </div>
              )
            })}
            <div className={styles.addField}>
              <button onClick={addField}>add field</button>
            </div>
          </div>

          <div className={styles.settings}>
            <div>
              <label htmlFor='graphType'>Graph type</label>
              <select name='graphType' onChange={selectGraphType}>
                {graphTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor='sliceContent'>Slice content</label>
              <select name='sliceContent' onChange={selectSliceContent}>
                {sliceContentTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor='titlePosition'>Title position</label>
              <select name='titlePosition' onChange={selectTitlePosition}>
                {titlePositionTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor='legendPosition'>Legend position</label>
              <select name='legendPosition' onChange={selectLegendPosition}>
                {legendPositionTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label>
                Slices ratio
                <input
                  type="checkbox"
                  checked={graphState.slicesRatio}
                  onChange={() => setGraphState({ ...graphState, slicesRatio: !graphState.slicesRatio })}
                />
              </label>
            </div>
          </div>

          <div className={styles.colors}>
            <Color
              label={'Background color'}
              color={graphState.background.color}
              onFocusPicker={() => {
                setGraphState({ ...graphState, background: { ...graphState.background, isPickerActive: !graphState.background.isPickerActive } })
              }}
              onSelectColor={(color) => {
                setGraphState({ ...graphState, background: { ...graphState.background, color: color.hex, isPickerActive: false } })
              }}
              isPickerActive={graphState.background.isPickerActive}
            />
          </div>
        </div>

        <Visual graphRef={graphRef} refresh={refresh} bgColor={graphState.background.color} />

      </div>
    </main>
  )
}

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <h1>PIE CHART GENERATOR</h1>
    </div>
  )
}

const Visual = ({ graphRef, refresh, bgColor }) => {
  return (
    <div className={styles.visual}>
      <div className={styles.graph} style={{ background: bgColor }} ref={graphRef} />
      <div className={styles.actions}>
        <button onClick={refresh}>refresh</button>
        <button>export</button>
      </div>
    </div>
  )
}

