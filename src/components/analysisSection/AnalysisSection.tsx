import { useEffect, useState } from "react";
import type { DashboardRegionCollection } from "../../types/DashboardRegionCollection";
import { AnalysisForm } from "../analysisForm/AnalysisForm";
import { Chatbot } from "../chatbot/Chatbot";
import { WorldMap } from "../worldMap/WorldMap";
import './analysis-section.scss';
import { Charts } from "../charts/Charts";
import type { ChatbotFilters } from "../../types/ChatbotFilters";

type AnalysisFormProps = {
    regionCollection: Map<string, DashboardRegionCollection>,
}

export function AnalysisSection({ regionCollection }: AnalysisFormProps) {
    const [regions, setRegions] = useState<Array<string>>([]);
    const [years, setYears] = useState<Array<string>>([]);
    const [variable, setVariable] = useState("");
    const [item, setItem] = useState("");
    const [visual, setVisual] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    const regionValues: Array<string> = [];
    const yearValues:Set<string> = new Set();
    const variablesSet:Set<string> = new Set();
    const itemsSet:Set<string> = new Set();
    const visualEntries = ["bar", "timeseries"];
    const chatbotFilters: ChatbotFilters = {
        regions,
        years,
        variable,
        item,
        visual
    }

    useEffect(() => {
        if (regionCollection.size > 0) {
            setRegions([...regions, "wld"]);
            setSelectedRegion("wld");
        }
    }, [regionCollection]);

    useEffect(() => {
        if (regions.length > 0 && years.length > 0 && variable.length > 0
            && item.length > 0 && visual.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [regions, years, variable, item, visual])

    if (regionCollection.size > 0) {

        const selectedRegion = Array.from(regionCollection.keys())[0];

        Array.from(regionCollection.keys()).forEach((entry) => {
            regionValues.push(entry);
        });

        regionCollection.get(selectedRegion)?.years.forEach((entry) => {
            yearValues.add(entry);
        });

        regionCollection.get(selectedRegion)?.variables.forEach((entry) => {
            variablesSet.add(entry);
        })

        regionCollection.get(selectedRegion)?.items.forEach((entry) => {
            itemsSet.add(entry);
        });
    }

    function handleRegionChange(e) {
        const selectedRegion = e.target.value;
        const isRegionPresent = regions.indexOf(selectedRegion);
        const newRegions = [...regions];

        if (isRegionPresent >= 0) {
            newRegions.splice(isRegionPresent, 1);
        } else {
            newRegions.push(selectedRegion);
        }
        setRegions(newRegions);
        isRegionPresent === -1 && setSelectedRegion(selectedRegion);
        handleFormChange()
    }

    function handleYearsChange(e) {
        const selectedYear = e.target.value;
        const isYearPresent = years.indexOf(selectedYear);
        const newYears = [...years];

        if (isYearPresent >= 0) {
            newYears.splice(isYearPresent, 1);
        } else {
            newYears.push(selectedYear);
        }

        setYears(newYears);
        handleFormChange()
    }

    function handleFormSubmit() {
        setFormSubmitted(true);
    }

    function handleVariableChange(e) {
        setVariable(e.target.value)
        handleFormChange()
    }
    function handleItemsChange(e) {
        setItem(e.target.value)
        handleFormChange()
    }

    function handleVisualChange(e) {
        setVisual(e.target.value);
        handleFormChange()
    }

    function handleFormChange() {
        setFormSubmitted(false);
    }

    function handleResetForm() {
        setFormSubmitted(false);
        setItem("");
        setVariable("");
        setRegions(["wld"]);
        setYears([]);
        setSelectedRegion("wld");
        setVisual("");
    }

    return (
        <main className="main-panel">
            <AnalysisForm regions={regions} handleRegionChange={handleRegionChange}
                variable={variable} variablesSet={variablesSet}
                handleVariableChange={handleVariableChange} item={item}
                itemsSet={itemsSet} handleItemsChange={handleItemsChange}
                years={years} handleYearsChange={handleYearsChange}
                handleFormSubmit={handleFormSubmit} visual={visual}
                visualEntries={visualEntries} handleVisualChange={handleVisualChange}
                handleResetForm={handleResetForm} regionValues={regionValues}
                yearValues={yearValues} buttonDisabled={buttonDisabled}>
                <Chatbot regionCollection={regionCollection} yearValues={yearValues}
                    chatbotFilters={chatbotFilters}></Chatbot>
            </AnalysisForm>
            <WorldMap region={selectedRegion}></WorldMap>
            <Charts regionCollection={regionCollection} item={item}
                variable={variable} regions={regions}
                years={years} formSubmitted={formSubmitted}
                visual={visual} selectedRegion={selectedRegion}></Charts>
        </main>
    )
}