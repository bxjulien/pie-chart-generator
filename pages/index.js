import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.scss'
import drawChart from '../utils/drawChart';

const placeholderData = [
  { name: "ideas", value: 40, color: 'orange' },
  { name: "time", value: 12, color: 'red' },
  { name: "money", value: 8, color: 'blue' },
];

export default function Home() {
  const graphRef = useRef(null);

  const [title, setTitle] = useState('My cool pie chart');

  const [graphState, setGraphState] = useState({
    data: [
      { name: "ideas", value: 40, color: 'orange' },
      { name: "time", value: 12, color: 'red' },
      { name: "money", value: 8, color: 'blue' },
    ],
    donut: true,
    ratio: false,
    displayNames: true
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
    newData.push({ name: '', value: '', color: '' })
    setGraphState({ ...graphState, data: newData });
  }

  const removeField = (index) => {
    console.log(index)
    const newData = [...graphState.data];
    newData.splice(index, 1);
    setGraphState({ ...graphState, data: newData });
  }

  const refresh = () => {
    if (graphRef.current) {
      drawChart(graphRef.current, graphState);
    }
  }

  return (
    <main className={styles.layout}>

      <Navbar />

      <section className={styles.content}>
        <div className={styles.config}>

          <div className={styles.title}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={styles.fields}>
            {graphState.data.map((field, index) => {
              return (
                <div key={index}>
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
                  <button onClick={() => removeField(index)}>remove</button>
                </div>
              )
            })}
            <div className={styles.addField}>
              <button onClick={addField}>add field</button>
            </div>
          </div>
        </div>

        <Visual graphRef={graphRef} refresh={refresh} />

      </section>

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

const Visual = ({ graphRef, refresh }) => {
  return (
    <div className={styles.visual}>
      <div className={styles.graph} ref={graphRef} />
      <div className={styles.actions}>
        <button onClick={refresh}>refresh</button>
        <button>export</button>
      </div>
    </div>
  )
}