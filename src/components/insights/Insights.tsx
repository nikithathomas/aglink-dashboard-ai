import { useEffect, useState } from "react";
import type { DashboardRegionCollection } from "../../types/DashboardRegionCollection";
import { Regions, Units } from "../../utilities/constants";
import './insights.scss';

type InsightsPropTypes = {
  selectedRegion: string;
  regionCollection: Map<string, DashboardRegionCollection>;
};
export function Insights({
  selectedRegion,
  regionCollection,
}: InsightsPropTypes) {
  const [totalLand, setTotalLand] = useState<string>("");
  const [totalProduction, setTotalProduction] = useState<string>("");
  const [totalYield, setTotalYield] = useState<string>("");

  useEffect(() => {
    if (regionCollection?.size > 0 && selectedRegion.length) {
      populateAreaTotal();
      populateProductionTotal();
      populateYieldTotal();
    }
  }, [selectedRegion]);

  function generateTotal(variable: string) {
    const region = regionCollection.get(selectedRegion);

    let totalSum: number = 0;
    let sumUnit = "";
    region?.variables.forEach((entry, index) => {
      if (entry === variable) {
        totalSum += region.values[index];
        sumUnit = Units[region?.units[index]];
      }
    });

    return { totalSum, sumUnit }
  }

  function populateAreaTotal() {
    const { totalSum, sumUnit } = generateTotal("area");
    setTotalLand(`${totalSum} ${totalSum > 1 ? `${sumUnit}s` : sumUnit}`);
  }

  function populateProductionTotal() {
    const { totalSum, sumUnit } = generateTotal("prod");
    setTotalProduction(`${totalSum} ${totalSum > 1 ? `${sumUnit}s` : sumUnit}`);
  }

  function populateYieldTotal() {
    const { totalSum, sumUnit } = generateTotal("yild");
    setTotalYield(`${totalSum} ${sumUnit}`);
  }
  
  return (
    <section className="section insights">
      <h4 className="section__title">Land insights of {Regions[selectedRegion]}</h4>
      <div className="insights__container">
        {totalLand.length > 0 && <p className="insights__entry">
          <span className="insights__entry-metric">Total Land Area:</span>
          <span className="insights__entry-value">{totalLand}</span>
        </p>}

        {totalProduction.length > 0 && <p className="insights__entry">
          <span className="insights__entry-metric">Total Land Production:</span>
          <span className="insights__entry-value">{totalProduction}</span>
        </p>}
        {totalYield.length > 0 && <p className="insights__entry">
          <span className="insights__entry-metric">Total Yield from Land:</span>
          <span className="insights__entry-value">{totalYield}</span>
        </p>}
      </div>
    </section>
  );
}
