import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import legendTextData from './data/legend_master.json'
import allCountry from './data/allCountry.json'

const arraysHaveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

const getLegendTexts = (countries) => {
    const matchedCountries = legendTextData.filter(item => arraysHaveSameElements(countries, item.countries));
    if (matchedCountries.length === 0) {
        // Construct legend
        const lastCountry = countries[countries.length-1]
        if (countries.length === 1) { // only one country
            return [{
                selected_text: lastCountry,
                others_text: "countries in europe that is not " + lastCountry,
                fact_md: "",
            }]
        }
        const selectedLegendText = countries.slice(0, -1).join(', ') + " and " + lastCountry
        return [{
            selected_text: selectedLegendText,
            others_text: "countries in europe that is not " + selectedLegendText,
            fact_md: "",
        }]
    }
    return matchedCountries;
}

const EuropeMap = () => {
    const [mapData, setMapData] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [optionCountries, setOptionCountries] = useState([])
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [legendColor, setLegendColor] = useState('blue')
    const [isOcean, setIsOcean] = useState(false)

    const [legendData, setLegendData] = useState([
        { color: 'blue', label: 'Selected' },
        { color: '#9d9d9dff', label: 'Not Selected' }
    ])
    const svgRef = useRef();
    const mapRef = useRef();

    const n = 2; // Maximum number of selectable countries
    const legendColors = [
        'red', 'green', 'blue'
    ]

    useEffect(() => {
        d3.json('/europe.topojson').then(data => {
        const europe = feature(data, data.objects.europe);
        setMapData(europe);
        });
    }, []);

    // Zoom Effect Hook
    useEffect(() => {
        if (!mapData || !svgRef.current || !mapRef.current) return;

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[0, 0], [800, 600]])
            .on('zoom', (event) => {
            d3.select(mapRef.current).attr('transform', event.transform);
            });

        d3.select(svgRef.current).call(zoom);
    }, [mapData]);

    const handleCountryClick = (countryName) => {
        setIsOcean(false)
        if (selectedCountries.length >= allCountry.length) { // transition from ocean
            setSelectedCountries([countryName]);
            return;
        }
        if (selectedCountries.includes(countryName)) {
            // Unselect country
            const newSelectedCountries = selectedCountries.filter(name => name !== countryName);
            setSelectedCountries(newSelectedCountries);
        } else {
            if (selectedCountries.length < n) {
                setSelectedCountries([...selectedCountries, countryName]);
                console.log(`Select ${countryName}`)
            } else {
                alert(`You can only select a maximum of ${n} countries.`);
                return;
            }
        }
    };

    const handleUpdateOption = (countryName) => {
        var countries = selectedCountries
        if (countries.length >= allCountry.length) { // transition from ocean
            countries = [countryName]
        }
        else if (selectedCountries.includes(countryName)) {
            // Unselect country
            countries = selectedCountries.filter(name => name !== countryName);
        }
        else {
            if (selectedCountries.length < n) {
                countries = [...selectedCountries, countryName]
            }
            else {
                return
            }
        }
        countries = countries.filter(obj => Boolean)
        // Update select options
        const possibleLegend = legendTextData.filter(
            item => {
                return countries.every(country => item.countries.includes(country));
            }
        )
        // Flatten country name & Update
        const countriesOption = [...possibleLegend.map(item => item.countries)].flat();
        setOptionCountries(countriesOption);
    }

    const handleColorClick = (color) => {
        var newLegendData = legendData
        newLegendData[0].color = color
        setLegendColor(color)
        setLegendData(newLegendData)
    }

    const updateLegendText = (countryName) => {
        var countries = selectedCountries
        if (countries.length >= allCountry.length) { // transition from ocean
            countries = [countryName]
        }
        else if (selectedCountries.includes(countryName)) {
            // Unselect country
            countries = selectedCountries.filter(name => name !== countryName);
        }
        else {
            if (selectedCountries.length < n) {
                countries = [...selectedCountries, countryName]
            }
            else {
                return
            }
        }
        countries = countries.filter(obj => Boolean)
        if (countries.length === 0) {
            setLegendData([
                { color: legendColor, label: 'Selected' },
                { color: '#9d9d9dff', label: 'Not Selected' }
            ])
            return
        }
        // Get legend data of the selected countries
        const legendDataArray = getLegendTexts(countries)
        // Randomly pick one legend
        const randomIndex = Math.floor(Math.random() * legendDataArray.length);
        const legendData = legendDataArray[randomIndex];
        setLegendData([
            { color: legendColor, label: legendData.selected_text },
            { color: '#9d9d9dff', label: legendData.others_text }
        ])

    }

    if (!mapData) {
        return <div>Loading...</div>;
    }

        const projection = d3.geoMercator().scale(400).translate([300, 750]);
        const pathGenerator = d3.geoPath().projection(projection);
        
        const legendX = 20;
        const legendY = 520;
        const getLegend = (legendData) => {
            return (
            <g className="legend" transform={`translate(${legendX}, ${legendY})`}>
                {legendData.map((item, index) => (
                    <g key={index} transform={`translate(0, ${index * 25})`}>
                    <rect width="20" height="20" fill={item.color} stroke="black" stroke-width="1" />
                    <text className="legend-text" x="30" y="15" style={{
                        fontSize: '20px',
                    }}>
                        {item.label}
                    </text>
                    </g>
                ))}
            </g>
            )
        }

    return (
        <div>
        {tooltipContent && (
            <div
            style={{
                position: 'absolute',
                left: tooltipPosition.x - 350,
                top: tooltipPosition.y + 10,
                background: 'white',
                padding: '5px',
                border: '1px solid black',
            }}
            >
            {tooltipContent}
            </div>
        )}
        <svg ref={svgRef} width={800} height={580} style={{ 
            border: '1px solid #ccc', 
            backgroundColor: (isOcean) ? '#017b92':'white'
        }} 
        onClick={() => {
            if (selectedCountries.length <= 0 & legendColor==='green') {
                setIsOcean(true)
                setLegendData([
                    { color: legendColor, label: 'land' },
                    { color: '#017b92', label: 'ocean' }
                ])
                setSelectedCountries(allCountry)
            }
        }}
        >
            <g ref={mapRef}>
            {mapData.features.map((country, i) => (
                <path
                key={i}
                d={pathGenerator(country)}
                className="country"
                onClick={(event) => {
                    event.stopPropagation(); // Stop the event from reaching the SVG background
                    handleCountryClick(country.properties.NAME)
                    handleUpdateOption(country.properties.NAME)
                    updateLegendText(country.properties.NAME)
                }}
                onMouseEnter={(e) => {
                    setTooltipContent(country.properties.NAME);
                    setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                    setTooltipContent('');
                }}
                style={{
                    // fill: selectedCountries.includes(country.properties.NAME) ? legendColor:baseGrayColor,
                    fill: (() => {
                        if (selectedCountries.includes(country.properties.NAME)) return legendColor;
                        if (optionCountries.length === 0 & selectedCountries.length === 0) return '#9d9d9dff';
                        if (optionCountries.includes(country.properties.NAME)) return '#9d9d9dff';
                        return '#9f9f9fff';
                    })(),
                    stroke: (() => {
                        if (selectedCountries.includes(country.properties.NAME)) return 'gray';
                        if (optionCountries.length === 0 & selectedCountries.length === 0) return '#747474ff';
                        if (optionCountries.includes(country.properties.NAME)) return '#747474ff';
                        return 'gray';
                    })(),
                    strokeWidth: (() => {
                        if (selectedCountries.includes(country.properties.NAME)) return 0.2;
                        if (optionCountries.length === 0 & selectedCountries.length === 0) return 1.2;
                        if (optionCountries.includes(country.properties.NAME)) return 1.2;
                        return 0.2;
                    })(),
                }}
                />
            ))}
            </g>
            {/* SVG Legend */}
            {getLegend(legendData)}
        </svg>
            
        <div>
            <div class="flex-container-auto-margin" style={{
                width: '780px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <div>
                    {
                        legendColors.map(
                            (color) => (
                                <button
                                class='square-button'
                                style={{
                                    backgroundColor: color
                                }}
                                onClick={() => {
                                    handleColorClick(color)
                                }}
                                ></button>
                            )
                        )
                    }
                </div>
                <div
                class="push-right"
                onClick={() => {
                    setSelectedCountries([])
                    setOptionCountries([])
                    setIsOcean(false)
                    setLegendData([
                        { color: legendColor, label: 'Selected' },
                        { color: '#9d9d9dff', label: 'Not Selected' }
                    ])
                }}
                >
                    <button className="retro-button">clear</button>
                </div>
            </div>
        </div>

        </div>
    );
    };

export default EuropeMap;