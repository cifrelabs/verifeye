"use client"

import React, { useRef, useEffect } from 'react';

interface ContentProps {
    username: string;
    displayName: string;
    captions: string;
    likes: number;
    comments: number;
    favorites: number;
    shares: number;
    media: string;
}

const Content: React.FC<ContentProps> = ({ 
    username, 
    displayName, 
    captions, 
    likes, 
    comments, 
    favorites, 
    shares, 
    media 
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle video playback when it comes into view
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Play the video when it comes into view
                    videoElement.play().catch(error => {
                        console.log("Error playing video:", error);
                    });
                } else {
                    // Pause the video when it goes out of view
                    videoElement.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5 // Adjust as needed, 0.5 means at least 50% of the video must be visible
        });

        observer.observe(videoElement);

        return () => {
            observer.unobserve(videoElement);
        };
    }, []);

    return (
        <div className="h-screen flex items-center justify-center">
            <video ref={videoRef} src={media} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        </div>
    );
};

export default Content;
