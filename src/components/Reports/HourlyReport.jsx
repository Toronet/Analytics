import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

const HourlyReport = ({categories, data}) => {
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
                    colors: ['#40C057']
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

export default HourlyReport;