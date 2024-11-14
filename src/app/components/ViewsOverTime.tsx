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

class Graph {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private g: d3.Selection<SVGGElement, unknown, null, undefined>;
    private width: number;
    private height: number;
    private margin = { top: 20, right: 30, bottom: 50, left: 60 };
    private x: d3.ScaleTime<number, number>;
    private y: d3.ScaleLinear<number, number>;
    private y2: d3.ScaleLinear<number, number>;

    constructor(container: d3.Selection<Element | d3.BaseType, unknown, null, undefined>) {
        // Setup base SVG
        this.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 350 300')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Calculate dimensions
        this.width = 350 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;

        // Create scales
        this.x = d3.scaleTime().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);
        this.y2 = d3.scaleLinear().range([this.height, 0]);

        // Create container group with adjusted transform
        this.g = this.svg
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Initialize axes
        this.initializeAxes();
    }

    private initializeAxes(): void {
        // X Axis
        this.g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${this.height})`);

        // Y Axis (Views)
        this.g.append('g')
            .attr('class', 'axis axis--y');

        // Y2 Axis (Counts)
        this.g.append('g')
            .attr('class', 'axis axis--y2')
            .attr('transform', `translate(${this.width},0)`);
    }

    public update(dates: Date[], views: number[], counts: number[]): void {
        const oldestDate = d3.min(dates) as Date;
        const latestDate = d3.max(dates) as Date;
        
        const domainStart = new Date(oldestDate);
        domainStart.setDate(domainStart.getDate() - 2);
        const domainEnd = new Date(latestDate);
        domainEnd.setDate(domainEnd.getDate() + 2);
        
        // Update scales
        this.x.domain([domainStart, domainEnd]);
        this.y.domain([0, d3.max(views) || 0]);
        this.y2.domain([0, d3.max(counts) || 0]);

        // Calculate date range in days
        const daysDiff = Math.ceil((latestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Choose appropriate time format and tick count
        let timeFormat, tickCount;
        if (daysDiff <= 31) { // Less than a month
            timeFormat = d3.timeFormat('%b %d');
            tickCount = Math.min(7, daysDiff); // Show max 7 ticks for better readability
        } else if (daysDiff <= 365) { // Less than a year
            timeFormat = d3.timeFormat('%b %d');
            tickCount = Math.min(12, Math.floor(daysDiff / 7)); // About 1-2 ticks per month
        } else {
            timeFormat = d3.timeFormat('%b %Y');
            tickCount = 12; // One tick per month for year+ ranges
        }

        this.g.select('.axis--x')
            .transition()
            .duration(750)
            .call(d3.axisBottom(this.x)
                .ticks(tickCount)
                .tickFormat(timeFormat as any) as any)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('stroke', 'none')
            .style('fill', 'black');

        this.g.select('.axis--x path')
            .style('stroke', 'black')
            .style('stroke-width', '1px');
        this.g.select('.axis--x line')
            .style('stroke', 'black')
            .style('stroke-width', '1px');

        this.g.select('.axis--y')
            .transition()
            .duration(750)
            .call(d3.axisLeft(this.y).tickFormat(d3.format(".2s")) as any)
            .selectAll('text')
            .style('stroke', 'none')
            .style('fill', '#72CEF1');  // Match the blue line color

        this.g.select('.axis--y2')
            .transition()
            .duration(750)
            .call(d3.axisRight(this.y2)
                .ticks(Math.min(Math.max(...counts), 10))
                .tickFormat(d3.format('d')) as any)
            .selectAll('text')
            .style('stroke', 'none')
            .style('fill', '#FE2C55');  // Match the red line color

        this.g.select('.axis--y path')
            .style('stroke', '#72CEF1');
        this.g.select('.axis--y line')
            .style('stroke', '#72CEF1');
        
        this.g.select('.axis--y2 path')
            .style('stroke', '#FE2C55');
        this.g.select('.axis--y2 line')
            .style('stroke', '#FE2C55');

        this.g.selectAll('.axis path, .axis line')
            .style('stroke-width', '1px');

        // Create line generators
        const line = d3.line<[Date, number]>()
            .defined(d => d[0] !== undefined && d[1] !== undefined)
            .x(d => this.x(d[0]))
            .y(d => this.y(d[1]));

        const line2 = d3.line<[Date, number]>()
            .defined(d => d[0] !== undefined && d[1] !== undefined)
            .x(d => this.x(d[0]))
            .y(d => this.y2(d[1]));

        // Update views line
        this.updateLine(
            '.views-line',
            dates.map((d, i) => [d, views[i]] as [Date, number]),
            line,
            '#72CEF1'
        );

        // Update counts line
        this.updateLine(
            '.counts-line',
            dates.map((d, i) => [d, counts[i]] as [Date, number]),
            line2,
            '#FE2C55'
        );
    }

    private updateLine(
        className: string,
        data: [Date, number][],
        lineGenerator: d3.Line<[Date, number]>,
        color: string
    ): void {
        const line = this.g.selectAll(className).data([data]);

        // Enter
        line.enter()
            .append('path')
            .attr('class', className.substring(1))
            .merge(line as any)
            .attr('stroke', color)
            .attr('fill', 'none')
            .transition()
            .duration(750)
            .attr('d', lineGenerator);

        // Exit
        line.exit().remove();
    }
}

const updateInfoDiv = (dates: Date[], views: number[], average: number, username?: string) => {
    const infoDiv = document.getElementById('infoviewsovertime');
    if (!infoDiv) return;
    
    // Find max and min values and their indices
    const maxViews = Math.max(...views);
    const minViews = Math.min(...views);
    const maxIndex = views.indexOf(maxViews);
    const minIndex = views.indexOf(minViews);
    
    const maxMonth = dates[maxIndex] ?? undefined;
    const minMonth = dates[minIndex] ?? undefined;
    const decreasePercent = ((maxViews - minViews) / maxViews) * 100;

    infoDiv.innerHTML = `
        <div class="flex flex-col gap-2">
            <span>This account averages <span class="font-bold text-tiktok-red">${abbreviateNumber(average)}</span> viewers per video.</span>
            <span>They peaked at <span class="font-bold">${abbreviateNumber(maxViews)}</span> views on <span class="font-bold">${formatMonthYear(maxMonth)}</span> but reached an all-time low on <span class="font-bold">${formatMonthYear(minMonth)}</span> with <span class="font-bold">${abbreviateNumber(minViews)}</span> viewers.</span>
            <span>Viewer count has decreased by <span class="font-bold">${decreasePercent.toFixed(2)}%</span> since last peak.</span>
        </div>
    `;
};

const plotData = (data: Post[], average: number, username?: string) => {
    const { dates, views, counts } = processData(data);
    
    // Update info div with the new statistics
    updateInfoDiv(dates, views, average, username);
    
    // Clear and initialize container
    const container = d3.select('#plot')
        .html('')
        .append('div')
        .style('width', '100%')
        .style('height', '300px');
    
    const graph = new Graph(container as any);
    graph.update(dates, views, counts);
};

const processData = (data: Post[]) => {
    // Sort data by date first
    const sortedData = [...data].sort((a, b) => a.createTime - b.createTime);
    const firstDate = new Date(sortedData[0].createTime * 1000);
    const lastDate = new Date(sortedData[sortedData.length - 1].createTime * 1000);
    
    // Check if all posts are from the same month
    const sameMonth = firstDate.getMonth() === lastDate.getMonth() && 
                     firstDate.getFullYear() === lastDate.getFullYear();

    const timeData: Record<string, { views: number; count: number }> = {};

    sortedData.forEach(d => {
        const date = new Date(d.createTime * 1000);
        // Use daily format if same month, otherwise use monthly
        const timeKey = sameMonth 
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!timeData[timeKey]) {
            timeData[timeKey] = { views: 0, count: 0 };
        }

        timeData[timeKey].views += d.playCount || 0;
        timeData[timeKey].count += 1;
    });

    const dates = Object.keys(timeData).sort().map(d => new Date(d));
    const views = dates.map(date => {
        const key = sameMonth
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return timeData[key].views;
    });
    const counts = dates.map(date => {
        const key = sameMonth
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return timeData[key].count;
    });

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
    const [timeUnit, setTimeUnit] = useState<'month' | 'day'>('month');

    useEffect(() => {
        if(data) {
            // Determine if all posts are from the same month
            const dates = data.map((d: Post) => new Date(d.createTime * 1000));
            const firstDate = new Date(Math.min(...dates));
            const lastDate = new Date(Math.max(...dates));
            
            const sameMonth = firstDate.getMonth() === lastDate.getMonth() && 
                            firstDate.getFullYear() === lastDate.getFullYear();
            
            setTimeUnit(sameMonth ? 'day' : 'month');
            setAverageViewers(getAverageViewers(data));
            plotData(data, averageViewers ?? 0, username);
        }
    }, [data, username, averageViewers]);

    return (
        <div className='w-full max-w-[600px] mx-auto'>
            <div className="info text-black text-sm pl-4" id="infoviewsovertime"></div>
            <div id="plot" className="w-full"></div>
            <div className='flex flex-row justify-center items-center gap-4 mt-3 flex-wrap text-sm'>
                <span className='text-tiktok-blue'>● Viewer count per {timeUnit}</span>
                <span className='text-tiktok-red'>● Videos posted per {timeUnit}</span>
            </div>
        </div>
    );
};

export default ViewsOverTime;
