"use client"

import React, { useRef, useEffect, useState } from 'react';
import ActionBar, { IInteractions } from './ActionBar';
import { useAutoplay } from '../contexts/AutoplayContext';

interface ContentProps {
    data: IData;
}

export interface IData {
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
}

const Content: React.FC<ContentProps> = ({ data }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { globalAutoplay, setGlobalAutoplay } = useAutoplay();
    const [hasInvestigated, setHasInvestigated] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    let interactions: IInteractions = {
        likes: data.likes,
        comments: data.comments,
        favorites: data.favorites,
        shares: data.shares,
    }

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (videoRef.current) {
                        videoRef.current.currentTime = 0; // Reset video to start
                        if (globalAutoplay) {
                            playVideo();
                        }
                    }
                } else {
                    pauseVideo();
                }
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [globalAutoplay]);

    const playVideo = async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Autoplay failed:', error);
            }
        }
    };

    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleVideoPress = () => {
        if (!globalAutoplay) {
            setGlobalAutoplay(true);
        }
        
        if (isPlaying) {
            pauseVideo();
        } else {
            if (videoRef.current) {
                videoRef.current.currentTime = 0; // Reset video to start when manually playing
            }
            playVideo();
        }
    };

    const handleCaptionPress = (e: React.MouseEvent<HTMLElement>) => {
        setIsExpanded(!isExpanded);
        e.stopPropagation();
    };

    return (
        <div 
            className="h-screen flex items-center justify-center relative"
            onClick={handleVideoPress}
        >
            <video 
                ref={videoRef}
                src={data.media} 
                className="w-full h-full object-cover" 
                loop 
                playsInline 
            />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                        className="w-20 h-20 text-white opacity-50" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            )}
            <div className={`absolute bottom-12 left-0 ${isExpanded && 'bg-gradient-to-t from-black'}`}>
                <div className="pb-3 pl-4 text-white">
                    <h2 className="text-lg font-bold">{data.display_name}</h2>
                    { isExpanded ? 
                        (<p
                            className="text-sm mt-1 pr-11 mr-3"
                            onClick={(e) => handleCaptionPress(e)}>
                                {data.captions}
                        </p>) :
                        (<p
                            className="text-sm mt-1 pr-11 mr-3 line-clamp-2"
                            onClick={(e) => handleCaptionPress(e)}>
                                {data.captions}
                        </p>)
                    }
                    <p className="text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                        {data.sound_used} - {data.display_name}
                    </p>
                </div>
            </div>
            <ActionBar 
                pfp={data.pfp}
                interactions={interactions}
                hasInvestigated={hasInvestigated}
                setHasInvestigated={setHasInvestigated}
            />
        </div>
    );
};

export default Content;