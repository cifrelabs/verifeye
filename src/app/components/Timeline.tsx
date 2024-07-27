import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Video {
  id: string;
  desc: string;
  createTime: number;
}

interface UserData {
  result: {
    posts: Video[];
  };
}

interface TimelineProps {
  username: string | null;
}

const Timeline: React.FC<TimelineProps> = ({ username }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [firstVideo, setFirstVideo] = useState<Video | null>(null);
  const [lastVideo, setLastVideo] = useState<Video | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const currentVideos: { [key: string]: Video } = {
    'therealboyabunda': { id: 'vid123', desc: 'Current Video for User1', createTime: 1688554800 },
    'benjaminmadronasondong87': { id: 'vid456', desc: 'Current Video for User2', createTime: 1649853385 },
    'bbm.ph.json': { id: 'vid456', desc: 'Current Video for User2', createTime: 1644006308 },
    'senrisahontiveros_': { id: 'vid456', desc: 'Current Video for User2', createTime: 1661952000 }
  };

  useEffect(() => {
    if (username && currentVideos[username]) {
      setCurrentVideo(currentVideos[username]);
    }

    async function fetchData() {
      try {
        const response = await fetch('analysisdata/' + username + '.json');
        const jsonData: UserData = await response.json();

        if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
          const sortedVideos = jsonData.result.posts.sort((a, b) => a.createTime - b.createTime);
          setFirstVideo(sortedVideos[0]);
          setLastVideo(sortedVideos[sortedVideos.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [username]);

  useEffect(() => {
    if (!firstVideo || !lastVideo || !currentVideo) return;

    const svg = d3.select(svgRef.current);
    const width = parseInt(svg.style("width"), 10) || 800;
    const height = parseInt(svg.style("height"), 10) || 200;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const timelineData = [
      { date: new Date(firstVideo.createTime * 1000), label: 'First Video', yOffset: 25, textAnchor: 'end' },
      { date: new Date(currentVideo.createTime * 1000), label: 'Current Video', yOffset: -30, textAnchor: 'middle' },
      { date: new Date(lastVideo.createTime * 1000), label: 'Last Video', yOffset: 25, textAnchor: 'start' },
    ];

    const xScale = d3.scaleTime()
      .domain(d3.extent(timelineData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yPosition = innerHeight / 2;

    svg.selectAll("*").remove(); // Clear previous contents

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yPosition)
      .attr("y2", yPosition)
      .attr("stroke", "black");

    g.selectAll("circle")
      .data(timelineData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", yPosition)
      .attr("r", 5)
      .attr("fill", "#72CEF1");

    // Append date text
    g.selectAll("text.date")
      .data(timelineData)
      .enter()
      .append("text")
      .attr("class", "date")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yPosition + (d.yOffset < 0 ? d.yOffset - 15 : d.yOffset + 15)) 
      .attr("text-anchor", d => d.textAnchor)
      .text(d => d.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))
      .attr("font-size", "12px");

    // Append label text
    g.selectAll("text.label")
      .data(timelineData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yPosition + (d.yOffset < 0 ? d.yOffset - 5 : d.yOffset + 35)) 
      .attr("text-anchor", d => d.textAnchor)
      .text(d => d.label)
      .attr("font-size", "12px");

  }, [firstVideo, lastVideo, currentVideo]);

  const calculateDaysAgo = (timestamp: number) => {
    const now = new Date();
    const postDate = new Date(timestamp * 1000);
    const differenceInTime = now.getTime() - postDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const lastPostedDaysAgo = lastVideo ? calculateDaysAgo(lastVideo.createTime) : null;
  const firstVidDate = firstVideo ? new Date(firstVideo.createTime * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;
  const currentVidDate = currentVideo ? new Date(currentVideo.createTime * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

  return (
    <div className='flex flex-col justify-center items-center p-4 w-full'>
      <div className="info text-black mb-3" id="infotimeline">
        <p>
            User posted their first video on {firstVidDate}, their current video on {currentVidDate}, and their last video <span className='text-tiktok-red font-bold'>{lastPostedDaysAgo} days ago.</span> 
        </p>
      </div>
      <div id="plottimeline" className='w-full flex justify-center'>
        <div className='w-full' style={{ maxWidth: '80%' }}>
          <svg ref={svgRef} className='w-full h-auto' style={{ overflow: 'visible', height: '300px' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
