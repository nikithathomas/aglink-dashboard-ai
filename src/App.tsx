import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Header } from './components/header/Header';
import type { DashboardRegionCollection } from './types/DashboardRegionCollection';
import { AnalysisSection } from './components/analysisSection/AnalysisSection';


const App = () => {
  const [dashboardData, setDashboardData] = useState<Map<string, DashboardRegionCollection>>(new Map());
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      streamCsvData();
    }
  }, []);

  const streamCsvData = () => {
    const allRegions: Map<string, DashboardRegionCollection> = new Map();
    let index = 0;

    Papa.parse("https://s3.iiasa.ac.at/accelerator-prod/demo/Demo/sample.csv", {
      download: true,
      worker: false,
      skipEmptyLines: true,
      step: (results) => {
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
      }
    });
  };

  return (
    <>
      <Header></Header>
      <AnalysisSection regionCollection={dashboardData}></AnalysisSection>
    </>
  );
};

export default App
