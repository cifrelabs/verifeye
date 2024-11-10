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

    constructor(container: d3.Selection<HTMLDivElement, unknown, null, undefined>) {
        // Setup base SVG
        this.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 350 300')
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Calculate dimensions
        this.width = 350 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;

        // Create scales
        this.x = d3.scaleTime().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);
        this.y2 = d3.scaleLinear().range([this.height, 0]);

        // Create container group
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
        // Update scales
        this.x.domain(d3.extent(dates) as [Date, Date]);
        this.y.domain([0, d3.max(views) || 0]);
        this.y2.domain([0, d3.max(counts) || 0]);

        // Update axes with transitions
        this.g.select('.axis--x')
            .transition()
            .duration(750)
            .call(d3.axisBottom(this.x).tickFormat(d3.timeFormat('%b %Y') as any) as any)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('stroke', 'black');

        this.g.select('.axis--y')
            .transition()
            .duration(750)
            .call(d3.axisLeft(this.y).tickFormat(d3.format(".2s")) as any)
            .selectAll('path, line, text')
            .style('stroke', 'black');

        this.g.select('.axis--y2')
            .transition()
            .duration(750)
            .call(d3.axisRight(this.y2) as any)
            .selectAll('path, line, text')
            .style('stroke', 'black');

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
    
    const totalViews = views.reduce((a, b) => a + b, 0);
    infoDiv.innerHTML = `${username ? username + ' has' : 'You have'} ${abbreviateNumber(totalViews)} total views`;
};

const plotData = (data: Post[], average: number, username?: string) => {
    const { dates, views, counts } = processData(data);
    // Clear and initialize container
    const container = d3.select('#plot')
        .html('') // Clear previous content
        .append('div')
        .style('width', '350px')
        .style('height', '300px') as unknown as d3.Selection<HTMLDivElement, unknown, null, undefined>;
    
    const graph = new Graph(container);
    graph.update(dates, views, counts);
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
    }, [data, username, averageViewers]);

    return (
        <div className='relative w-[350px]'>
            <div className="info text-black text-sm" id="infoviewsovertime"></div>
            <div className='flex flex-row justify-center items-center mb-3'>
                <span className='text-tiktok-blue mr-3'>● Viewer count per month</span>
                <span className='text-tiktok-red'>● Videos posted per month</span>
            </div>
            <div id="plot" className="relative"></div>
        </div>
    );
};

export default ViewsOverTime;
