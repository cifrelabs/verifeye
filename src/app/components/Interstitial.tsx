"use client"

import React, { useEffect } from 'react';
import { IAccordionData } from './Verifeye';

interface InterstitialProps {
    username: string;
    displayName: string;
    id: string;
    pfp: string;
    data: IAccordionData | null
    setIsVerifeyeOpen: (bool: boolean) => void
    setHasInvestigated: (bool: boolean) => void
    // onNext: () => void;
}

const Interstitial: React.FC<InterstitialProps> = ({
    username, 
    displayName, 
    id,
    pfp,
    data,
    setIsVerifeyeOpen,
    setHasInvestigated,
    // onNext
}) => {
    const handleSeeMore = () => {
        setIsVerifeyeOpen(true);
    }

    const handleSkip = () => {
        setHasInvestigated(true);
        setIsVerifeyeOpen(false)
        // onNext();
    }

    let text;
    let highlight;
    if(data?.topHashtag !== null) {
        text = "This user's most used hashtag is ";
        highlight = data?.topHashtag;
    }
    else {
        text = "The video you just watched was posted on ";
        highlight = new Date(data?.createDate * 1000)
        highlight = highlight.toISOString();
    }

    return (
        <div className="h-screen flex items-center justify-center relative">
            <div className="flex flex-col items-center text-center z-10">
                <img 
                    src={pfp} 
                    alt={`${displayName}'s profile picture`}
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-sm text-gray-600 mb-2">@{username}</p>
                <p id='text' className="text-md pl-10 pr-10 mb-8 text-pretty">
                    {text}
                    <span className='font-bold text-tiktok-red'>
                        {highlight}
                    </span>
                </p>
                <div className='flex flex-col w-full gap-2 px-5'>
                    <button 
                        className='w-full bg-tiktok-red rounded-md py-2 px-3'
                        onClick={handleSeeMore}
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

export default Interstitial;