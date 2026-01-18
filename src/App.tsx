import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Header } from './components/header/Header';
import { Main } from './components/Main';
import type { DashboardRegionCollection } from './types/DashboardRegionCollection';


const App = () => {
  const [dashboardData, setDashboardData] = useState<Map<string, DashboardRegionCollection>>(new Map());
  const [csvData, setCsvData] = useState<Array<Array<any>>>([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      streamCsvData();
    }
  }, []);

  const streamCsvData = () => {
    const allRegions: Map<string, DashboardRegionCollection> = new Map();
    let currentCsvData: Array<Array<any>> = [];
    let index = 0;

    Papa.parse("https://s3.iiasa.ac.at/accelerator-prod/demo/Demo/sample.csv", {
      download: true,
      worker: false,
      skipEmptyLines: true,
      step: (results) => {
        currentCsvData.push(results.data);
        //to skip the header row
        if (index > 0) {
          const [model, scenario, region, variable, item, unit, year, value] = results.data;

          let regionData = allRegions.get(region);
          if (!regionData) {
            regionData = {
              region: '',
              variables: [],
              items: [],
              units: [],
              years: [],
              values: []
            }
            allRegions.set(region, regionData);
            regionData = allRegions.get(region)
          } else {
            regionData = allRegions.get(region);
          }
          regionData.region = region;
          regionData.variables.push(variable);
          regionData.items.push(item);
          regionData.years.push(year);
          
          if (unit === "1000 ha") {
            regionData.units.push("ha");
            regionData.values.push(parseFloat((parseFloat(value) * 1000).toFixed(2)));
          } else if (unit === "1000 t") {
            regionData.units.push("t");
            regionData.values.push(parseFloat((parseFloat(value) * 1000).toFixed(2)));
          } else {
            regionData.units.push(unit);
            regionData.values.push(parseFloat(parseFloat(value).toFixed(2)));
          }
        }

        index = index + 1;
      },
      complete: () => {
        setDashboardData(allRegions);

        setCsvData(currentCsvData);
      }
    });
  };

  return (
    <>
      <Header></Header>
      <Main data={dashboardData} csvData={csvData}></Main>
    </>
  );
};

export default App
