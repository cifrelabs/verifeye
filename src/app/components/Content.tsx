"use client"

import React, { useRef, useEffect, useState } from 'react';
import ActionBar from './ActionBar';
import { useAutoplay } from '../contexts/AutoplayContext';

interface ContentProps {
    soundUsed?: string;
    displayName: string;
    captions: string;
    likes: number;
    comments: number;
    favorites: number;
    shares: number;
    media: string;
    pfp: string;
}

const Content: React.FC<ContentProps> = ({ 
    displayName, 
    captions,
    soundUsed, 
    likes, 
    comments, 
    favorites, 
    shares, 
    media,
    pfp
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { globalAutoplay, setGlobalAutoplay } = useAutoplay();

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

    const handleTap = () => {
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

    return (
        <div 
            className="h-screen flex items-center justify-center relative"
            onClick={handleTap}
        >
            <video 
                ref={videoRef}
                src={media} 
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
            <div className="absolute bottom-12 pb-3 left-4 text-white">
                <h2 className="text-lg font-bold">{displayName}</h2>
                <p className="text-sm mt-1">{captions}</p>
                <p className="text-xs mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    {soundUsed} - {displayName}
                </p>
            </div>
            <ActionBar 
                pfp={pfp}
                likes={likes}
                comments={comments}
                favorites={favorites}
                shares={shares}
            />
        </div>
    );
};

export default Content;