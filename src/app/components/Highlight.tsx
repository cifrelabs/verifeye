"use client"

import { getHighlight } from '@/utils/supabase';
import React, { useState } from 'react';
import Details from './Verifeye';

interface HighlightProps {
    username: string;
    displayName: string;
    id: string;
    pfp: string;
    setOpenDetails(bool: boolean): any;
    onNext: () => void;
}

const Content: React.FC<HighlightProps> = async ({
    username, 
    displayName, 
    id,
    pfp,
    setOpenDetails,
    onNext
}) => {
    const [hasInteracted, setHasInteracted] = useState(false);

    // const getMessage = (type: number, socmed?: string) => {
    //     switch(type) {
    //         case 1: "Another account on TikTok with a similar profile exists"; break;
    //         case 2: "We found this Wikipedia article about the user"; break;
    //         case 3: `We found an ${socmed} account possibly belonging to this user`; break;
    //         default: "No possible matching accounts nor mentions were found";
    //     }
    // }

    const handleSeeMore = () => {
        setHasInteracted(true);
    }

    const handleSkip = () => {
        setHasInteracted(true);
        onNext();
    }

    // if (id) {
    //     const highlight: { 
    //         type?: number 
    //         details?: object
    //     } = await getHighlight(id);
                
    //     // Lookalike
    //     if (highlight.type === 1) return (
    //         <div className="h-screen flex items-center justify-center relative">
                
    //         </div>
    //     );

    //     // Social Media
    //     if (highlight.type === 2) return (
    //         <div className="h-screen flex items-center justify-center relative">
                
    //         </div>
    //     );

    //     // Article
    //     if (highlight.type === 3) return (
    //         <div className="h-screen flex items-center justify-center relative">
                
    //         </div>
    //     );
    // }

    // const [openDetails, setOpenDetails] = useState(false);
    // const toggleDetails = () => {
    //     setOpenDetails(true);
    // }

    // if (openDetails){
    //     <Details
    //     openDetails={openDetails}
    //     />
    // }

    // No Social Media
    return (
        <div className="h-screen flex items-center justify-center relative">
            <div className="flex flex-col items-center text-center z-10">
                <img 
                    src={pfp} 
                    alt={`${displayName}'s profile picture`}
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-sm text-gray-600 mb-6">@{username}</p>
                <p className="text-lg pl-10 pr-10 mb-6">
                    No possible matching accounts nor mentions were found
                </p>
                <div className='flex flex-col w-full gap-2 px-5'>
                    <button 
                        className='w-full bg-tiktok-red rounded-md py-2 px-3'
                        onClick={()=>{
                            handleSeeMore;
                            setOpenDetails(true);
                        }}
                    >
                        <p className="text-kinda-sm tracking-wide">See what else we found about this user</p>
                    </button>
                    <button 
                        className='w-full bg-tiktok-gray rounded-md py-2 px-3'
                        onClick={handleSkip}
                    >
                        <p className="text-kinda-sm tracking-wide">Skip to next video</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Content;