import { useEffect, useState } from "react";
import { BarChart } from "../barChart/BarChart";
import { TimeSeriesChart } from "../timeSeriesChart/TimeSeriesChart";
import type { DashboardRegionCollection } from "../../types/DashboardRegionCollection";
import './charts.scss'
import { Insights } from "../insights/Insights";
import { LandUsage, Measures, Regions, Units, Visuals } from "../../utilities/constants";
import type { ChartTrace } from "../../types/ChartTrace";

type ChartsProps = {
    regionCollection: Map<string, DashboardRegionCollection>
    item: string,
    variable: string,
    regions: Array<string>,
    years: Array<string>,
    formSubmitted: boolean,
    visual: string,
    selectedRegion: string
}

export function Charts({ formSubmitted, visual, regions,
    years, item, variable, regionCollection, selectedRegion }: ChartsProps) {

    const [traces, setTraces] = useState<Array<ChartTrace>>([]);
    const [yAxisUnit, setYAxisUnit] = useState("");

    useEffect(() => {
        if (formSubmitted) {
            processTraces();
        } else {
            setTraces([]);
        }
    }, [regionCollection, formSubmitted]);

    function populateAdditionalConfig() {
        if (visual === "bar") {
            return {
                type: 'bar'
            }
        } else if (visual === "timeseries") {
            return {
                type: 'scatter',
                mode: 'lines+markers',
            }
        }
    }

    function processTraces() {
        const allTraces: Array<ChartTrace> = [];
        let selectedYAxisUnit = "";

        regions.forEach((entry) => {
            const selectedRegion = regionCollection.get(entry);
            const trace = {
                x: [],
                y: [],
                name: Regions[entry],
                ...populateAdditionalConfig()
            }

            selectedRegion?.years.forEach((year, index) => {
                const isYearPresent = years.indexOf(year);

                if (isYearPresent > -1
                    && selectedRegion?.variables[index] === variable
                    && selectedRegion.items[index] === item) {
                    selectedYAxisUnit = `${Measures[variable]} in ${selectedRegion.values[index] > 1 ?
                        `${Units[selectedRegion.units[index]]}s` :
                        Units[selectedRegion.units[index]]}`;
                    trace.x.push(year);
                    trace.y.push(selectedRegion.values[index])
                }
                if (index === selectedRegion?.years.length - 1) {
                    allTraces.push(trace);
                }
            })
        })

        setTraces(allTraces);
        setYAxisUnit(selectedYAxisUnit)
    }

    function createChartTitle() {
        let yearString = "";
        if (years.length > 1) {
            years.forEach((entry, index) => {
                if (index < years.length - 2) {
                    yearString += `${entry}, `;
                } else if (index < years.length - 1) {
                    yearString += entry;
                } else {
                    yearString += ` and ${entry}`
                }
            })
        } else {
            yearString += years[0];
        }

        return `${Visuals[visual]} for ${LandUsage[item]} over the ${years.length > 1 ? `years ${yearString}` : `year ${yearString}`}.`
    }

    return (
        <section className="section right-panel">
            <Insights regionCollection={regionCollection} selectedRegion={selectedRegion}></Insights>

            {regionCollection.size > 0 && traces.length > 0 ? <>
                <h4 className="section__title">{createChartTitle()}</h4>
                {(formSubmitted && visual === "bar") ?
                    (<BarChart traces={traces} axesData={{ x: 'Years', y: yAxisUnit }}>
                    </BarChart>) : ""}
                {(formSubmitted && visual === "timeseries") ?
                    <TimeSeriesChart traces={traces} axesData={{ x: 'Years', y: yAxisUnit }}>
                    </TimeSeriesChart> : ""}
            </> : ""}
        </section>
    )
}