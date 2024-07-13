"use client";

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Post {
    stats?: {
        playCount?: number;
    };
    createTime: number;
}

interface JsonData {
    result: {
        posts: Post[];
    };
}

const ViewsOverTime: React.FC = () => {
    const [allData, setAllData] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('samueluyyt.json');
                const jsonData: JsonData = await response.json();

                if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
                    const filteredData = jsonData.result.posts.map((post: Post) => ({
                        playCount: post.stats?.playCount || 0,
                        createTime: post.createTime
                    })).filter(d => {
                        return d.playCount > 0 && d.playCount < 100000000 && d.createTime > 0;
                    }).sort((a, b) => a.createTime - b.createTime);

                    console.log('Filtered Data:', filteredData); // Debug log
                    setAllData(filteredData);
                    plotData(filteredData);
                } else {
                    console.error('Invalid JSON structure or no posts array found.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const plotData = (data: Post[]) => {
        const { dates, views, counts } = processData(data);

        const svg = d3.select('#plot')
            .html('') // Clear any previous SVG
            .append('svg')
            .attr('width', 800)
            .attr('height', 500);

        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const y2 = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(dates) as [Date, Date]);
        y.domain([0, d3.max(views) || 0]);
        y2.domain([0, d3.max(counts) || 0]);

        const line = d3.line<[Date, number]>()
            .defined(d => d[0] !== undefined && d[1] !== undefined)
            .x(d => x(d[0]))
            .y(d => y(d[1]));

        const line2 = d3.line<[Date, number]>()
            .defined(d => d[0] !== undefined && d[1] !== undefined)
            .x(d => x(d[0]))
            .y(d => y2(d[1]));

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

        g.append('g')
            .attr('class', 'axis axis--y2')
            .attr('transform', `translate(${width},0)`)
            .call(d3.axisRight(y2));

        g.append('path')
            .datum(dates.map((d, i) => [d, views[i]] as [Date, number]))
            .attr('class', 'line')
            .attr('stroke', 'lightblue')
            .attr('fill', 'none')
            .attr('d', line);

        g.append('path')
            .datum(dates.map((d, i) => [d, counts[i]] as [Date, number]))
            .attr('class', 'line')
            .attr('stroke', 'red')
            .attr('fill', 'none') 
            .attr('d', line2);

        const maxViews = d3.max(views) ?? 0;
        const minViews = d3.min(views) ?? 0;
        const maxIndex = views.indexOf(maxViews);
        const minIndex = views.indexOf(minViews);

        const totalViewers = data.reduce((sum, post) => sum + (post.playCount || 0), 0);
        const average = Math.trunc(totalViewers / data.length);
        

        const infoDiv = document.getElementById('info');
        if (infoDiv) {
            const maxMonth = dates[maxIndex] ?? undefined;
            const minMonth = dates[minIndex] ?? undefined;
            const decreasePercent = ((maxViews - minViews) / maxViews) * 100;
            console.log("Average: ", average);
            infoDiv.innerHTML = `
                <span>This account averages ${abbreviateNumber(average)} viewers per video.</span>
                <span>They peaked at ${abbreviateNumber(maxViews)} views on ${formatMonthYear(maxMonth)} but reached an all-time low on ${formatMonthYear(minMonth)} with ${abbreviateNumber(minViews)} viewers.</span>
                <span>Viewer count has decreased by ${decreasePercent.toFixed(2)}% since last peak.</span>
            `;
        }
    };

    const processData = (data: Post[]) => {
        const monthData: Record<string, { views: number; count: number }> = {};

        data.forEach(d => {
            const date = new Date(d.createTime * 1000);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthData[yearMonth]) {
                monthData[yearMonth] = { views: 0, count: 0 };
            }

            monthData[yearMonth].views += d.playCount || 0;
            monthData[yearMonth].count += 1;
        });

        const dates = Object.keys(monthData).sort().map(d => new Date(d));
        const views = dates.map(date => monthData[`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`].views);
        const counts = dates.map(date => monthData[`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`].count);

        return { dates, views, counts };
    };

    const abbreviateNumber = (value: number) => {
        if (value < 1000) {
            return value.toString();
        }
    
        const suffixes = ["", "K", "M", "B", "T"];
        const suffixNum = Math.floor(Math.log10(value) / 3);
        const shortValue = (value / Math.pow(1000, suffixNum)).toFixed(1);
    
        return shortValue + suffixes[suffixNum];
    };

    const formatMonthYear = (date: Date | undefined) => {
        if (!date) {
            return 'Unknown';
        }
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: '10px' }}>
                <span style={{ color: 'lightblue', marginRight: '10px' }}>● Viewer count per month</span>
                <span style={{ color: 'red' }}>● Videos posted per month</span>
            </div>
            <h1>Views Over Time</h1>
            <div className="info" id="info"></div>
            <div id="plot"></div>
        </div>
    );
};

export default ViewsOverTime;

