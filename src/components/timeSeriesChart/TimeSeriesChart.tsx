import Plot from 'react-plotly.js';
import type { ChartAxesText } from '../../types/ChartAxesText';
import type { ChartTrace } from '../../types/ChartTrace';

type TimeSeriesProps = {
    traces: Array<ChartTrace>,
    axesData: ChartAxesText
}

export function TimeSeriesChart({ traces, axesData }: TimeSeriesProps) {

    return (
        <>
            {
                axesData.x.length > 0 && axesData.y.length > 0 && <Plot
                    style={{ width: "100%" }}
                    useResizeHandler={true}
                    data={traces}
                    layout={{
                        xaxis: { title: { text: axesData.x } }, yaxis: { title: { text: axesData.y } }
                    }}
                />
            }
        </>


    )
};
