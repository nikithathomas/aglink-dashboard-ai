import type { DashboardRegionCollection } from "../types/DashboardRegionCollection";
import { AnalysisSection } from "./analysisSection/AnalysisSection";

type MainProps = {
    data: Map<string, DashboardRegionCollection>
    csvData: Array<Array<any>>
}

export function Main({ data }: MainProps) {
    return (<AnalysisSection regionCollection={data}></AnalysisSection>)
}