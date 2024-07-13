"use client"

import { getHighlight } from '@/utils/supabase';
import React from 'react';

interface HighlightProps {
    username: string;
    displayName: string;
    id: string;
    pfp: string;
}

const Content: React.FC<HighlightProps> = async ({
    username, 
    displayName, 
    id,
    pfp 
}) => {
    if (id) {
        const highlight: { 
            type?: number 
            details?: object
        } = await getHighlight(id);

        // Lookalike
        if (highlight.type === 1) return (
            <div className="h-screen flex items-center justify-center relative">
                
            </div>
        );

        // Social Media
        if (highlight.type === 2) return (
            <div className="h-screen flex items-center justify-center relative">
                
            </div>
        );

        // Article
        if (highlight.type === 3) return (
            <div className="h-screen flex items-center justify-center relative">
                
            </div>
        );
    }

    // No Social Media
    return (
        <div className="h-screen flex items-center justify-center relative">
            <div className="flex flex-col items-center text-center z-10">
                <img 
                    src={pfp} 
                    alt={`${displayName}'s profile picture`}
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold mb-1">{displayName}</h2>
                <p className="text-sm text-gray-600 mb-6">@{username}</p>
                <p className="text-lg pl-10 pr-10">
                    No possible matching accounts nor mentions were found
                </p>
            </div>
        </div>
    );
};

export default Content;