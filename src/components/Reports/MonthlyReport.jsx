import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

const MonthlyReport = ({categories, data}) => {
    const [labels, setLabels] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        setLabels(categories);
        setChartData(data);
    },[categories, data]);

    return (
        <div>
            <Chart
                options={{
                    chart: {
                        id: 'bar',
                        toolbar: {
                            show: true
                        }
                    },
                    xaxis: {
                        categories: labels
                    },
                    colors: ['#E64980'],
                    // dataLabels: {
                    //     enabled: true,
                    //     textAnchor: "end",
                    //     style: {
                    //         colors: ['#fff']
                    //     },
                    //     formatter: function (_, opt){
                    //         const name = opt.w.globals.labels[opt.dataPointIndex];
                    //         const val = chartData[opt.dataPointIndex];
                    //         return val ? `${name} (${val})` : '';
                    //     }
                    // }
                }}
                series={[
                    {
                        name: 'series',
                        data: chartData
                    },
                ]}
                type="bar"
                height={300}
                width="100%"
            />
        </div>
    )
}

export default MonthlyReport;