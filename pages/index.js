import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.scss'
import drawChart from '../utils/drawChart';
import getRandomColor from "../utils/getRandomColor";
import Color from "../components/color/Color";

const chartTypes = ['Donut', 'Pie'];
const sliceContentTypes = ['Text', 'Value', 'Text Value', 'None'];
const legendPositionTypes = ['Bottom', 'Left', 'Right'];
const titlePositionTypes = ['Top', 'Bottom'];

export default function Home() {
  const chartRef = useRef(null);

  const [chartState, setChartState] = useState({
    mustRefresh: true,
    data: [
      { name: "My", value: 40, color: 'blue', isPickerActive: false },
      { name: "cool", value: 12, color: 'orange', isPickerActive: false },
      { name: "chart", value: 8, color: 'yellow', isPickerActive: false },
    ],
    donut: true,
    ratio: false,
    displayNames: true,
    chartType: 'Donut',
    sliceContentType: 'Text',
    titlePositionType: 'Top',
    legendPositionType: 'Bottom',
    slicesRatio: false,
    background: { color: 'black', isPickerActive: false },
    title: { text: 'My cool chart', color: 'white', isPickerActive: false },
    legend: { color: 'black', isPickerActive: false },
  });

  useEffect(() => {
    const state = { ...chartState };
    if (state.mustRefresh && chartRef.current) {
      drawChart(chartRef.current, state);
    }
    state.mustRefresh = false;
  }, [chartState]);

  const handleChangeData = (key, e, index) => {
    const newData = [...chartState.data];
    if (newData[index]) newData[index][key] = e.target.value;
    setChartState({ ...chartState, data: newData, mustRefresh: false });
  }

  const addField = () => {
    const newData = [...chartState.data];
    newData.push({ name: '', value: '', color: getRandomColor() })
    setChartState({ ...chartState, data: newData, mustRefresh: false });
  }

  const removeField = (index) => {
    const newData = [...chartState.data];
    newData.splice(index, 1);
    setChartState({ ...chartState, data: newData, mustRefresh: true });
  }

  const handleChangeFieldColor = (color, index) => {
    const newData = [...chartState.data];
    newData[index].color = color.hex;
    newData[index].isPickerActive = false;
    setChartState({ ...chartState, data: newData, mustRefresh: true });
  }

  const handleShowFieldPicker = (index) => {
    const newData = [...chartState.data];
    newData[index].isPickerActive = !newData[index].isPickerActive;
    setChartState({ ...chartState, data: newData, mustRefresh: false });
  }

  const selectchartType = (e) => {
    const type = chartTypes.find(type => type === e.target.value)
    if (type) setChartState({ ...chartState, chartType: type, mustRefresh: true });
  }

  const selectSliceContent = (e) => {
    const type = sliceContentTypes.find(type => type === e.target.value)
    if (type) setChartState({ ...chartState, sliceContentType: type, mustRefresh: true });
  }

  const selectTitlePosition = (e) => {
    const type = titlePositionTypes.find(type => type === e.target.value)
    if (type) setChartState({ ...chartState, titlePositionType: type, mustRefresh: false });
  }

  const selectLegendPosition = (e) => {
    const type = legendPositionTypes.find(type => type === e.target.value)
    if (type) setChartState({ ...chartState, legendPositionType: type, mustRefresh: false });
  }

  const refresh = () => {
    if (chartRef.current) {
      setChartState({ ...chartState, mustRefresh: true });
    }
  }

  return (
    <main className={styles.layout}>

      <Navbar />

      <div className={styles.content}>
        <div className={styles.config}>

          <div className={styles.title}>
            <input value={chartState.title.text} onChange={(e) => setChartState({ ...chartState, title: { ...chartState.title, text: e.target.value }, mustRefresh: false })} />
          </div>

          <div className={styles.fields}>
            {chartState.data.map((field, index) => {
              return (
                <div className={styles.field} key={index}>
                  <input
                    value={field.name}
                    type={'text'}
                    onChange={(e) => handleChangeData('name', e, index)}
                    onBlur={() => refresh()}
                  />
                  <input
                    value={field.value}
                    type={'number'}
                    onChange={(e) => handleChangeData('value', e, index)}
                    onBlur={() => refresh()}
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
              <label htmlFor='chartType'>chart type</label>
              <select name='chartType' onChange={selectchartType}>
                {chartTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
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
                  checked={chartState.slicesRatio}
                  onChange={() => setChartState({ ...chartState, slicesRatio: !chartState.slicesRatio, mustRefresh: true })}
                />
              </label>
            </div>
          </div>

          <div className={styles.colors}>
            <Color
              label={'Background'}
              color={chartState.background.color}
              onFocusPicker={() => {
                setChartState({ ...chartState, background: { ...chartState.background, isPickerActive: !chartState.background.isPickerActive }, mustRefresh: false })
              }}
              onSelectColor={(color) => {
                setChartState({ ...chartState, background: { ...chartState.background, color: color.hex, isPickerActive: false }, mustRefresh: false })
              }}
              isPickerActive={chartState.background.isPickerActive}
            />
            <Color
              label={'Title'}
              color={chartState.title.color}
              onFocusPicker={() => {
                setChartState({ ...chartState, title: { ...chartState.title, isPickerActive: !chartState.title.isPickerActive }, mustRefresh: false })
              }}
              onSelectColor={(color) => {
                setChartState({ ...chartState, title: { ...chartState.title, color: color.hex, isPickerActive: false }, mustRefresh: false })
              }}
              isPickerActive={chartState.title.isPickerActive}
            />
            <Color
              label={'Legend'}
              color={chartState.legend.color}
              onFocusPicker={() => {
                setChartState({ ...chartState, legend: { ...chartState.legend, isPickerActive: !chartState.legend.isPickerActive }, mustRefresh: false })
              }}
              onSelectColor={(color) => {
                setChartState({ ...chartState, legend: { ...chartState.legend, color: color.hex, isPickerActive: false }, mustRefresh: false })
              }}
              isPickerActive={chartState.legend.isPickerActive}
            />
          </div>
        </div>

        <Visual chartRef={chartRef} refresh={refresh} title={chartState.title} bgColor={chartState.background.color} />

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

const Visual = ({ chartRef, refresh, title, bgColor }) => {
  return (
    <div className={styles.visual}>

      <div className={styles.chart} ref={chartRef} style={{ background: bgColor }}>
        <span className={styles.title} style={{color: title.color}}>{title.text}</span>
      </div>
      
      <div className={styles.actions}>
        <button onClick={refresh}>refresh</button>
        <button>export</button>
      </div>
    </div>
  )
}

