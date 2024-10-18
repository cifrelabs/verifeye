"use client";

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

export interface Post {
    playCount: number;
    stats?: {
        playCount?: number;
    };
    createTime: number;
}

export interface JsonViewsData {
    result: {
        posts: Post[];
    };
}

export const getAverageViewers = (data: Post[]) => {
    const totalViewers = data.reduce((sum, post) => sum + (post.playCount || 0), 0);
    const average = Math.trunc(totalViewers / data.length);
    return average;
}

const plotData = (data: Post[], average: number, username?: string) => {
    const { dates, views, counts } = processData(data);

    const svg = d3.select('#plot')
        .html('') // Clear any previous SVG
        .append('svg')
        .attr('width', 350)
        .attr('height', 300); // Be careful of clipping the months

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
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
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y') as unknown as (domainValue: Date | d3.NumberValue, index: number) => string))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('stroke', 'black')
        //.attr('fill', 'black');

    g.selectAll('.axis--x path')
        .attr('stroke', 'black');

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
        .selectAll('path, line, text')
        .attr('stroke', 'black')
        //.attr('fill', 'black');

    g.selectAll('.axis--y path')
        .attr('stroke', 'black');

    g.append('g')
        .attr('class', 'axis axis--y2')
        .attr('transform', `translate(${width},0)`)
        .call(d3.axisRight(y2))
        .selectAll('path, line, text')
        .attr('stroke', 'black')
        //.attr('fill', 'black');

    g.selectAll('.axis--y2 path')
        .attr('stroke', 'black');

    g.append('path')
        .datum(dates.map((d, i) => [d, views[i]] as [Date, number]))
        .attr('class', 'line')
        .attr('stroke', '#72CEF1')
        .attr('fill', 'none')
        .attr('d', line);

    g.append('path')
        .datum(dates.map((d, i) => [d, counts[i]] as [Date, number]))
        .attr('class', 'line')
        .attr('stroke', '#FE2C55')
        .attr('fill', 'none')
        .attr('d', line2);

    const maxViews = d3.max(views) ?? 0;
    const minViews = d3.min(views) ?? 0;
    const maxIndex = views.indexOf(maxViews);
    const minIndex = views.indexOf(minViews);

    const infoDiv = document.getElementById('infoviewsovertime');
    if (infoDiv) {
        const maxMonth = dates[maxIndex] ?? undefined;
        const minMonth = dates[minIndex] ?? undefined;
        const decreasePercent = ((maxViews - minViews) / maxViews) * 100;
        infoDiv.innerHTML =
            `<span style="color: black;">This account (${username}) averages ${abbreviateNumber(average)} viewers per video.</span>
            <span style="color: black;">They peaked at ${abbreviateNumber(maxViews)} views on ${formatMonthYear(maxMonth)} but reached an all-time low on ${formatMonthYear(minMonth)} with ${abbreviateNumber(minViews)} viewers.</span>
            <span style="color: black;">Viewer count has decreased by ${decreasePercent.toFixed(2)}% since last peak.</span>`;
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

export const abbreviateNumber = (value: number) => {
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

interface ViewsOverTimeProps {
    data: any;
    username?: string;
}

const ViewsOverTime: React.FC<ViewsOverTimeProps> = ({ data, username }) => {
    const [averageViewers, setAverageViewers] = useState<number>();

    useEffect(() => {
        if(data) {
            setAverageViewers(getAverageViewers(data));
            plotData(data, averageViewers ?? 0, username);
        }
    })

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="info text-black text-sm" id="infoviewsovertime"></div>
            <div className='flex flex-row justify-center items-center mb-3'>
                <span className='text-tiktok-blue mr-3'>● Viewer count per month</span>
                <span className='text-tiktok-red'>● Videos posted per month</span>
            </div>
            <div id="plot"></div>
        </div>
    );
};

export default ViewsOverTime;
