import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

const DailyChart = ({series}) => {
    const [chartData, setChartData] = useState([]);

    const [options] = useState({
        chart: {
            id: 'area',
            fontFamily: 'Poppins, sans-serif',
            zoom: {
                autoScaleYaxis: true
            }
        },
        colors: ['#4DABF7', '#228BE6'],
        dataLabels: {
            enabled: true
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            //min: new Date('01 Mar 2012').getTime(),
            tickAmount: 6,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
    });

    useEffect(() => {
        setChartData([{data: series}])
    },[series]);

    return (
        <div>
            <Chart
                options={options}
                series={chartData}
                width="100%"
                height={300}
                type="area"
            />
        </div>
    )
}

export default DailyChart;