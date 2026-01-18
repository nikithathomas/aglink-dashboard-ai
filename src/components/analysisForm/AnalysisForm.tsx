import type { ReactElement } from "react";
import { LandUsage, Measures, Regions, Visuals } from "../../utilities/constants";
import './analysis-form.scss';

type AnalysisFormParams = {
    regions: Array<string>;
    handleRegionChange: Function;
    variable: string,
    variablesSet: Set<string>,
    handleVariableChange: Function
    item: string,
    itemsSet: Set<string>,
    handleItemsChange: Function
    years: Array<string>,
    handleYearsChange: Function,
    handleFormSubmit: Function,
    visual: string,
    visualEntries: Array<string>,
    handleVisualChange: Function,
    buttonDisabled: boolean,
    handleResetForm: Function,
    regionValues: Array<string>,
    yearValues: Set<string>,
    children: ReactElement
}

export function AnalysisForm({ regions, handleRegionChange, variable,
    variablesSet, handleVariableChange, item, itemsSet, handleItemsChange,
    years, handleYearsChange, handleFormSubmit, visual,
    visualEntries, handleVisualChange, buttonDisabled,
    handleResetForm, children, regionValues, yearValues }: AnalysisFormParams) {

    return (
        <section className="section left-panel">
            <h4 className="section__title">Filters</h4>
            <fieldset className="left-panel__filters">

                <form action="">
                    <p className="left-panel__section">
                        <label htmlFor="region" className="left-panel__label">
                            <span className="left-panel__text">Regions</span>
                            <select name="region" id="region" value={regions}
                                onChange={(e) => handleRegionChange(e)} multiple={true} className="left-panel__field section__field">
                                {
                                    regionValues.map((entry) => {
                                        return <option key={entry} value={entry}>{Regions[entry]}</option>
                                    })
                                }
                            </select>
                        </label>
                        <label htmlFor="variable" className="left-panel__label">
                            <span className="left-panel__text">Metric</span>
                            <select name="variable" id="variable" value={variable}
                                onChange={handleVariableChange} className="left-panel__field section__field">
                                <option value="">Select</option>
                                {
                                    Array.from(variablesSet.values()).map((entry) => {
                                        return <option key={entry} value={entry}>{Measures[entry]}</option>
                                    })
                                }
                            </select>
                        </label>
                    </p>
                    <p className="left-panel__section">
                        <label htmlFor="item" className="left-panel__label">
                            <span className="left-panel__text">Land Usage</span>
                            <select name="item" id="item" value={item}
                                onChange={handleItemsChange} className="left-panel__field section__field">
                                <option value="">Select</option>
                                {
                                    Array.from(itemsSet.values()).map((entry) => {
                                        return <option key={entry} value={entry}>{LandUsage[entry]}</option>
                                    })
                                }
                            </select>
                        </label>
                        <label htmlFor="visual" className="left-panel__label">
                            <span className="left-panel__text">Visual</span>
                            <select name="visual" id="visual" value={visual} onChange={handleVisualChange}
                                className="left-panel__field section__field">
                                <option value="">Select</option>
                                {visualEntries.map((entry) => {
                                    return <option key={entry} value={entry}>{Visuals[entry]}</option>
                                })}
                            </select>
                        </label>
                        <label htmlFor="year" className="left-panel__label">
                            <span className="left-panel__text">Years</span>
                            <select name="year" id="year" value={years}
                                onChange={(e) => handleYearsChange(e)} multiple={true} className="left-panel__field section__field">
                                {
                                    Array.from(yearValues.values()).map((entry) => {
                                        return <option key={entry} value={entry}>{entry}</option>
                                    })
                                }
                            </select>
                        </label>
                    </p>

                    <button type="button" onClick={handleFormSubmit}
                        {...(buttonDisabled ? { disabled: true } : {})} className="section__button">Submit</button>
                    <button type="button" onClick={handleResetForm} 
                    className="section__button left-panel__reset">Reset</button>
                </form>
            </fieldset>
            {children}
        </section>)
}