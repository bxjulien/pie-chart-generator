import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.scss'
import drawChart from '../utils/drawChart';
import getRandomColor from "../utils/getRandomColor";
import Color from "../components/color/Color";

const chartTypes = ['Donut', 'Pie'];
const sliceContentTypes = ['Text', 'Value', 'Text Value', 'None'];
const maxData = 10;

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
    slicesRatio: false,
    background: { color: '#00D084', isPickerActive: false },
    title: { text: 'My cool chart', color: 'white', isPickerActive: false },
    legend: { color: 'white', isPickerActive: false },
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
    if (newData.length < maxData) {
      newData.push({ name: '', value: '', color: getRandomColor() })
      setChartState({ ...chartState, data: newData, mustRefresh: false });
    }
  }

  const removeField = (index) => {
    const newData = [...chartState.data];
    newData.splice(index, 1);
    setChartState({ ...chartState, data: newData, mustRefresh: true });
  }

  const handleChangeFieldColor = (color, index) => {
    const newData = [...chartState.data];
    newData[index].color = color.hex;
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
  const refresh = () => {
    if (chartRef.current) {
      setChartState({ ...chartState, mustRefresh: true });
    }
  }

  return (
    <main className={styles.app}>
      <div className={styles.grid}>

        <Navbar />

        <div className={styles.content}>
          <div className={styles.config}>
            <div className={styles.panel}>

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
                {chartState.data.length < maxData &&
                  <img className={styles.add} src="/cross.svg" onClick={addField} />
                }
              </div>

              <div className={styles.controls}>
                <div className={styles.colors}>
                  <Color
                    label={'Background'}
                    color={chartState.background.color}
                    onFocusPicker={() => {
                      setChartState({ ...chartState, background: { ...chartState.background, isPickerActive: !chartState.background.isPickerActive }, mustRefresh: false })
                    }}
                    onSelectColor={(color) => {
                      setChartState({ ...chartState, background: { ...chartState.background, color: color.hex }, mustRefresh: false })
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
                      setChartState({ ...chartState, title: { ...chartState.title, color: color.hex }, mustRefresh: false })
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
                      setChartState({ ...chartState, legend: { ...chartState.legend, color: color.hex }, mustRefresh: false })
                    }}
                    isPickerActive={chartState.legend.isPickerActive}
                  />
                </div>

                <div className={styles.settings}>
                  <div>
                    <label htmlFor='chartType'>Chart type</label>
                    <select name='chartType' onChange={selectchartType}>
                      {chartTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor='sliceContent'>Slices content</label>
                    <select name='sliceContent' onChange={selectSliceContent}>
                      {sliceContentTypes.map((type, key) => <option key={key} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>
                      Slices ratio
                    </label>
                    <input
                      type="checkbox"
                      checked={chartState.slicesRatio}
                      onChange={() => setChartState({ ...chartState, slicesRatio: !chartState.slicesRatio, mustRefresh: true })}
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

          <Visual
            chartRef={chartRef}
            data={chartState.data}
            refresh={refresh}
            title={chartState.title}
            bgColor={chartState.background.color}
            legendColor={chartState.legend.color}
          />
        </div>


        <div className={styles.footer}>
          <button onClick={refresh}>
            Refresh
            <img src='/refresh.svg' />
          </button>

          <button>
            Export
            <img src='/download.svg' />
          </button>
        </div>
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

const Visual = ({ chartRef, data, title, bgColor, legendColor }) => {
  return (
    <div className={styles.visual} style={{ background: bgColor }}>

      <span className={styles.title} style={{ color: title.color }}>{title.text}</span>

      <div className={styles.chart} ref={chartRef}>
      </div>

      <div className={styles.legends}>
        {data.map((d, index) => {
          return (
            d.name &&
            <div className={styles.legend} key={index}>
              <div className={styles.circle} style={{ background: d.color }}></div>
              <span className={styles.label} style={{ color: legendColor }}>{d.name}</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}