"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HashtagData {
  name: string;
  children?: HashtagData[];
  value?: number;
}

const colors = ['#F17D8E', '#B397CD', '#3EB1C5', '#52B77E', '#AEA942', '#F28C5D'];

const HashtagCirclePack: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<HashtagData | null>(null);
  const [chosenHashtag, setChosenHashtag] = useState<string>('');
  const [topHashtag, setTopHashtag] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/samueluyyt.json');
        const jsonData = await response.json();
        if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
          const processedData = processData(jsonData.result.posts);
          setData(processedData);
          if (processedData.children && processedData.children.length > 0) {
            setTopHashtag(processedData.children[0].name);
          }
        } else {
          console.error('Invalid JSON structure or no posts array found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current ? svgRef.current.clientWidth : 0;
    const height = svgRef.current ? svgRef.current.clientHeight : 0;
    const radius = Math.min(width, height) / 2;

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const pack = d3.pack<HashtagData>().size([radius * 2, radius * 2]).padding(3);
    const nodes = pack(root).descendants();

    svg.selectAll("*").remove(); // Clear previous contents

    const g = svg
      .attr("viewBox", `0 0 ${radius * 2} ${radius * 2}`)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${radius},${radius + 50})`);  // Adjusted vertical padding

    const node = g.selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('transform', (d) => `translate(${d.x - radius},${d.y - radius})`)
      .on('mouseover', function (event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', d.r * 1.1);

        d3.select(this).select('text')
          .transition().duration(200)
          .style('font-size', `${Math.min(d.r * 0.6, 12)}px`);

        setChosenHashtag(d.data.name); // Update the chosen hashtag
      })
      .on('mouseout', function (event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', d.r);

        d3.select(this).select('text')
          .transition().duration(200)
          .style('font-size', `${Math.min(d.r * 0.4, 10)}px`);

        setChosenHashtag(''); // Clear the chosen hashtag on mouse out
      });

    node.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d, i) => d.depth === 0 ? '#FFFFFF' : colors[i % colors.length])
      .attr('stroke', '#000')
      .attr('stroke-width', '1px');

    node.append('text')
      .style('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', (d) => `${Math.min(d.r * 0.4, 10)}px`)
      .text((d) => d.children ? '' : d.data.name)
      .each(function (d) {
        let text = d3.select(this);
        let words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        let lineHeight = 1.1; // ems
        let y = text.attr("y");
        let dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node() && tspan.node()!.getComputedTextLength() > d.r * 2) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });

    // Make SVG responsive
    const resize = () => {
      if (svg.node() && svg.node()!.parentNode) {
        const parentNode = svg.node()!.parentNode as HTMLElement;
        const width = parentNode.clientWidth;
        const height = parentNode.clientHeight;
        const radius = Math.min(width, height) / 2;

        svg
          .attr('viewBox', `0 0 ${radius * 2} ${radius * 2}`)
          .attr('width', width)
          .attr('height', height);

        pack.size([radius * 2, radius * 2]);
        const nodes = pack(root).descendants();

        node.data(nodes)
          .attr('transform', (d) => `translate(${d.x - radius},${d.y - radius})`);

        node.select('circle')
          .attr('r', (d) => d.r);

        node.select('text')
          .style('font-size', (d) => `${Math.min(d.r * 0.4, 10)}px`);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [data]);

  return (
    <div className='flex flex-col justify-center items-center'>
      <span className="info text-black" id="info">
        The user's most used hashtag is {topHashtag}
      </span>
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '5vh' }}></div> 
        <h1 className="text-black" style={{ textAlign: 'center', height: '5vh', lineHeight: '5vh' }}>{chosenHashtag}</h1>
        <svg ref={svgRef} style={{ width: '100%', height: '85vh' }}></svg>
      </div>
    </div>
  );
};

export default HashtagCirclePack;

function processData(posts: any[]): HashtagData {
  const hashtagCounts: { [key: string]: number } = {};

  posts.forEach((post: any) => {
    post.desc.match(/#\w+/g)?.forEach((hashtag: string) => {
      const tag = hashtag.toLowerCase();
      if (hashtagCounts[tag]) {
        hashtagCounts[tag]++;
      } else {
        hashtagCounts[tag] = 1;
      }
    });
  });

  let children = Object.keys(hashtagCounts).map((hashtag) => ({
    name: hashtag,
    value: hashtagCounts[hashtag]
  }));

  children = children.sort((a, b) => b.value - a.value).slice(0, 20);

  return { name:'', children };
}
