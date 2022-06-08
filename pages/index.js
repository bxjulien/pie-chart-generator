import React, { useEffect, useRef } from "react";
import styles from '../styles/Home.module.scss'
import drawChart from '../utils/drawChart'

export default function Home() {
  const graphRef = useRef(null);

  const donut = false;
  const ratio = false;
  const displayName = true;

  useEffect(() => {
    if (graphRef.current) {
      drawChart(graphRef.current, data, donut, ratio, displayName);
    }
  }, [graphRef]);

  const data = [
    { name: "ideas", value: 40, color: 'orange' },
    { name: "time", value: 12, color: 'red' },
    { name: "money", value: 8, color: 'blue' },
  ];

  return (
    <div className={styles.container}>
      <h1>PIE CHART GENERATOR</h1>
      <div className={styles.graph} ref={graphRef} />
    </div>
  )
}

