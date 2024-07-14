"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Content from './Content';
import Highlight from './Highlight';
import { AutoplayProvider } from '../contexts/AutoplayContext';

interface FeedProps {
    contents: Array<{
        id: string;
        username: string;
        display_name: string;
        pfp: string;
        media: string;
        captions: string;
        sound_used: string;
        likes: number;
        comments: number;
        favorites: number;
        shares: number;
        political: boolean;
        highlight_id: string;
    }>;
}

const Feed: React.FC<FeedProps> = ({ contents }) => {
    const [seenHighlights, setSeenHighlights] = useState<Set<string>>(new Set());
    const toBeDeletedRef = useRef<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const highlightRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleHighlightSeen = useCallback((highlightId: string) => {
        toBeDeletedRef.current = highlightId;
    }, []);

    useEffect(() => {
        const options = {
            root: containerRef.current,
            rootMargin: '0px',
            threshold: [0.1, 0.9],
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const highlightId = entry.target.getAttribute('data-highlight-id');
                if (!highlightId) return;

                if (entry.intersectionRatio > 0.9) {
                    handleHighlightSeen(highlightId);
                } else if (entry.intersectionRatio < 0.1 && toBeDeletedRef.current === highlightId) {
                    setSeenHighlights(prev => new Set(prev).add(highlightId));
                    toBeDeletedRef.current = null;
                }
            });
        }, options);

        Object.values(highlightRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [handleHighlightSeen]);

    const reels = contents.flatMap((content) => [
        <div key={`content-${content.id}`} className="snap-start h-screen">
            <Content
                soundUsed={content.sound_used}
                displayName={content.display_name}
                captions={content.captions}
                likes={content.likes}
                comments={content.comments}
                favorites={content.favorites}
                shares={content.shares}
                media={content.media}
                pfp={content.pfp}
            />
        </div>,
        content.political && !seenHighlights.has(content.highlight_id) && (
            <div 
                key={`highlight-${content.id}`} 
                className="snap-start h-screen"
                data-highlight-id={content.highlight_id}
                ref={(el: HTMLDivElement | null) => {
                    highlightRefs.current[content.highlight_id] = el;
                }}
            >
                <Highlight
                    username={content.username}
                    displayName={content.display_name}
                    id={content.highlight_id}
                    pfp={content.pfp}
                    onNext={()=>{}}
                />
            </div>
        )
    ].filter(Boolean));

    return (
        <AutoplayProvider>
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory"
            >
                {reels}
            </div>
        </AutoplayProvider>
    );
}

export default Feed;