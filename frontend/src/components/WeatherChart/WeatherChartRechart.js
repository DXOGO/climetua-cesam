import React, { useEffect, useState } from 'react';
import './WeatherChart.css';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WeatherChartRechart = () => {
    const city = useSelector((state) => state.selectedCity);
    const isExpanded = useSelector((state) => state.isExpanded);
    const selectedToggles = useSelector((state) => state.toggles);

    const [clientHeight, setClientHeight] = useState(window.innerHeight);
    const [chartContainerClass, setChartContainerClass] = useState('');

    const handleResize = () => {
        setClientHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array ensures this runs once on mount and unmount

    useEffect(() => {
        if (clientHeight > 900) {
            setChartContainerClass('large-screen'); 
        } else {
            setChartContainerClass('');
        }
    }, [clientHeight]);

    const generateContinuousLineData = () => {
        const continuousLineData = [];
        selectedToggles.forEach(toggle => {
            Object.keys(city.weatherWeekly).forEach(date => {
                const hourlyData = city.weatherWeekly[date];
                Object.keys(hourlyData).forEach(hour => {
                    if (!continuousLineData.find(data => data.time === `${date} ${hour}h`)) {
                        continuousLineData.push({
                            time: `${date} ${hour}h`,
                        });
                    }
                    continuousLineData.find(data => data.time === `${date} ${hour}h`)[toggle] = hourlyData[hour][toggle];
                });
            });
        });

        // Sort the continuousLineData array by time
        continuousLineData.sort((a, b) => {
            return a.time.localeCompare(b.time);
        });

        return continuousLineData;
    };

    const chartData = generateContinuousLineData();

    const CustomTick = ({ x, y, payload }) => {
        const { value, index } = payload;
        const [day, hour] = value.split(' ');
        const isFirstHourOfDay = index % 24 === 0;
        return (
            <g transform={`translate(${x},${y})`}>
                {isFirstHourOfDay && (
                    <>
                        <text x={0} y={20} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                            {day}
                        </text>
                    </>
                )} : (
                <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                    {hour}
                </text>
                )
            </g>
        );
    };

    const renderLines = () => {
        return selectedToggles.map((toggle, index) => (
            <Line key={toggle} type="monotone" dataKey={toggle} stroke={getLineColor(index)} name={toggle} />
        ));
    };

    const getLineColor = (index) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Add more colors as needed
        return colors[index % colors.length];
    };

    const getYAxisLabel = () => {
        return selectedToggles.join(', ');
    };

    return (
        <div className={`chart-container-${isExpanded ? "expanded" : "collapsed"} ${chartContainerClass}`}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    fontSize={12}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        height={80}
                        scale="band"
                        tick={<CustomTick />}
                        interval={5}
                    />
                    <YAxis
                        label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
                        domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip />
                    <Legend />
                    {renderLines()}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeatherChartRechart;
