"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface HashtagData {
  name: string;
  children?: HashtagData[];
  value?: number;
}

interface HashtagCirclePackProps {
  data: HashtagData | null;
  topHashtag: string;
}

const colors = ['#F17D8E', '#B397CD', '#3EB1C5', '#52B77E', '#AEA942', '#F28C5D'];

const HashtagCirclePack: React.FC<HashtagCirclePackProps> = ({ data, topHashtag }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chosenHashtag, setChosenHashtag] = useState<string>('');

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
      .attr("transform", `translate(${radius},${radius})`);  // Adjusted vertical padding

    const handleInteraction = (event: React.MouseEvent<HTMLElement>, d: any) => {
      event.stopPropagation(); // Stop the event from propagating to parent elements
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', d.r * 1.1);

      d3.select(event.currentTarget).select('text')
        .transition().duration(200)
        .style('font-size', `${Math.min(d.r * 0.6, 12)}px`);

      setChosenHashtag(d.data.name); // Update the chosen hashtag
    };

    const handleMouseOut = (event: React.MouseEvent<HTMLElement>, d: any) => {
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', d.r);

      d3.select(event.currentTarget).select('text')
        .transition().duration(200)
        .style('font-size', `${Math.min(d.r * 0.4, 10)}px`);

      setChosenHashtag(''); // Clear the chosen hashtag on mouse out
    };

    const node = g.selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('transform', (d) => `translate(${d.x - radius},${d.y - radius})`)
      .on('click', handleInteraction)
      .on('touchstart', handleInteraction)
      .on('mouseout', handleMouseOut);

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
        let words = d.data.name.split(/(?=#)|(?=\s)/g).filter(word => word.trim()).reverse();
        let tspan = text.text(null).append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", 0);

        const maxWidth = d.r * 1.8;

        if (words.length > 0) {
          let fullText = words.reverse().join("");
          tspan.text(fullText);
          
          if (tspan.node() && tspan.node()!.getComputedTextLength() > maxWidth) {
            let textLength = fullText.length;
            while (textLength > 0 && tspan.node()!.getComputedTextLength() > maxWidth) {
              textLength--;
              tspan.text(fullText.substring(0, textLength) + "...");
            }
          }
        }

        text.selectAll('tspan')
          .attr('dy', '0.3em');
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
      <p className="info w-full text-black text-sm" id="infohashtag">
        The user's most used hashtag is <span className='text-tiktok-red font-bold'>{topHashtag}</span>
      </p>
      <div style={{ width: '100%', height: '100%' }} className='relative'>
        {/* MODAL */}
        {chosenHashtag !== '' && (
          <div className='fixed inset-x-0 bottom-[4.39rem] z-10 px-3 w-screen h-fit bg-slate-400 rounded-t-lg' onClick={(e: React.MouseEvent<HTMLElement>) => {e.stopPropagation()}}>
              <p className='text-white py-5'>{chosenHashtag}</p>
          </div>
        )}
        {/* CIRCLE PACKING */}
        <svg ref={svgRef} className='w-full h-[55vh]'></svg>
      </div>
    </div>
  );
};

export default HashtagCirclePack;

export function processData(posts: any[]): HashtagData {
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
