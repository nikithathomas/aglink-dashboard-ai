import { useMemo, useState } from "react";
import geminiAI from "../../utilities/gemini-connection";
import type { DashboardRegionCollection } from "../../types/DashboardRegionCollection";
import { LandUsage, Measures, Regions, Units } from "../../utilities/constants";
import type { ChatbotFilters } from "../../types/ChatbotFilters";
import "./chatbot.scss"

type ChatBotParams = {
    regionCollection: Map<string, DashboardRegionCollection>,
    yearValues: Set<string>
    chatbotFilters: ChatbotFilters
}
export function Chatbot({ chatbotFilters, regionCollection, yearValues }: ChatBotParams) {
    const [chatResponse, setChatResponse] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const modifiedCsvData = useMemo(() => {
        if (regionCollection.size > 0) {
            const totalledData: Array<string> = []
            // added the csv header
            totalledData.push("region,variable,item,unit,total");

            Array.from(regionCollection.entries()).forEach(([region, regionData]) => {
                let previousData = {
                    region: "",
                    variable: "",
                    item: "",
                    unit: "",
                    sum: 0,
                }

                regionData?.variables.forEach((entry, index) => {
                    const selectedItem = regionData?.items[index];
                    const selectedValue = regionData?.values[index];
                    const selectedVariable = regionData?.variables[index];
                    const selectedUnit = regionData?.units[index];

                    if (previousData.item.length > 0 && previousData.item !== selectedItem) {
                        totalledData.push(`${previousData.region},${previousData.variable},${previousData.item},${previousData.unit},${previousData.sum}`);
                        previousData.sum = 0;
                    }
                    previousData = {
                        region: region,
                        variable: selectedVariable,
                        item: selectedItem,
                        unit: selectedUnit,
                        sum: previousData.sum + selectedValue
                    }
                });
            });
            return totalledData.join("\n");
        }
    }, [regionCollection]);

    const chatbotFilterRows = useMemo(() => {
        if (chatInput.length > 0) {
            const filteredRows = [];
            filteredRows.push("region,variable,item,unit,year,value,visual");

            const { regions, years, variable, item, visual } = chatbotFilters

            regions?.forEach((entry) => {
                const selectedRegion = regionCollection.get(entry);

                selectedRegion?.years.forEach((year, index) => {
                    const isYearPresent = years.indexOf(year);
                    const currentVariable = selectedRegion?.variables[index];
                    const currentItem = selectedRegion.items[index];
                    const currentUnit = selectedRegion.units[index];
                    const currentValue = selectedRegion.values[index];

                    if (isYearPresent > -1
                        && currentVariable === variable
                        && currentItem === item) {
                        filteredRows.push(`${entry},${currentVariable},${currentItem},${currentUnit},${year},${currentValue},${visual}`);
                    }
                });
            });
            if (filteredRows.length > 0) {
                return filteredRows.join("\n");
            }
            return "";
        }
    }, [chatInput, chatbotFilters])

    async function handleQuery() {
        setIsButtonDisabled(true);
        try {
            const response = await geminiAI.models.generateContent({
                model: import.meta.env.VITE_DASHBOARD_GEMINI_MODEL,
                contents: chatInput,
                config: {
                    systemInstruction: [
                        'You are a senior analyst for IIASA.',
                        'These are the details of the data for context:',
                        '1. The full forms of all the abbreviations are given below',
                        `2. The full forms of the region abbreviations are provided ${Object.entries(Regions).map(([key, value]) => `${key},${value}`).join('\n')}`,
                        `3. The full forms of the variable abbreviations are provided ${Object.entries(Measures).map(([key, value]) => `${key},${value}`).join('\n')}`,
                        `4. The full forms of the item abbreviations are provided ${Object.entries(LandUsage).map(([key, value]) => `${key},${value}`).join('\n')}`,
                        `5. The full forms of the unit abbreviations are provided ${Object.entries(Units).map(([key, value]) => `${key},${value}`).join('\n')}`,
                        `6. If the data asks about the current selection on the dashboard, current view of the dashboard or the selection or the visuals on the dashboard
                     or words similar to that`,
                        `7. The value column is the best point of comparison`,
                        `8. Please use the data provided below which has all the filters currently on the dashboard`,
                        `${chatbotFilterRows}`,
                        `8. If the above data is not available just use the data below`,
                        `${modifiedCsvData}`,
                        `9. Where the total in the below data is a value calculated as a sum for each item across the years ${Array.from(yearValues.values()).join('\n')}`,
                        'Here are some guidelines:',
                        '1. Please use a polite and professional tone',
                        '2. Please answer queries from the user accurately, only using the dataset provided.',
                        '3. The total column for each row is the best point of comparison',
                        '4. Reason and analyse with the data provided to answer queries.',
                        '5. Please limit the answers to around 3 to 4 lines',
                        '6. If you are unable to answer the query because it is out of scope, please answer that you do not have the data to answer the query',
                        '7. Please deliver the data as points with necessary formatting with each point in a new line',
                        `8. If a certain item in the data is mentioned, please do not list out facts and figures without any reasoning, 
                    just summarise`],
                },
            });
            setChatResponse(response.text);
            setIsButtonDisabled(() => false);
        } catch(error){
            if(error.message.indexOf("429") !== -1){
                setChatResponse("Quota exhausted. Please wait a moment.")
            }
            setChatResponse("An unexpected error occurred");
            setIsButtonDisabled(() => false);
        }

    }


    return (<div className="chatbot section">
        <h4 className="section__title">Chat with Analyst</h4>
        <input
            className="section__field"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your query..."
        />
        <button onClick={handleQuery} className="section__button chatbot__send" {...(isButtonDisabled ? { disabled: true } : '')}>Send</button>

        {chatResponse.length > 0 && <div className="chatbot__response">
            <ol>
                {chatResponse.split("*").map((entry, index) => {
                    return <li key={index}>{entry}</li>
                })}
            </ol>
        </div>}

    </div>)
}