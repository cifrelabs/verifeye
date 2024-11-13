"use client"

import React, { useEffect } from 'react';
import { IAccordionData } from './Verifeye';
import { LookalikeData } from './Lookalike';

interface InterstitialProps {
    username: string;
    displayName: string;
    // id: string;
    pfp: string;
    data: IAccordionData | null;
    lookalike: LookalikeData | null;
    miniProfiles: Array<{ image: string; displayName: string; username: string; interaction: string; site: string; }>;
    setIsVerifeyeOpen: (bool: boolean) => void;
    setHasInvestigated: (bool: boolean) => void;
    // onNext: () => void;
}

const Interstitial: React.FC<InterstitialProps> = ({
    username, 
    displayName, 
    // id,
    pfp,
    data,
    lookalike,
    miniProfiles,
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
    if(lookalike) {
        return (
            <div className="h-screen flex items-center justify-center relative">
                <div className="flex flex-col items-center text-center z-10">
                    <div className='w-full px-10 flex flex-row justify-between mb-4'>
                        <MiniProfile
                            pfp={lookalike.current_image}
                            displayName={lookalike.current_displayName}
                            username={lookalike.current_username}
                            followers={lookalike.current_followerCount}
                            video_count={lookalike.current_videoCount}
                            type={true}
                        />

                        <MiniProfile
                            pfp={lookalike.image}
                            displayName={lookalike.displayName}
                            username={lookalike.username}
                            followers={lookalike.followerCount}
                            video_count={lookalike.videoCount}
                            type={false}
                        />
                    </div>
                    <p id='text' className="leading-5 pl-10 pr-10 mb-8 text-pretty">Another account with a similar profile exists</p>
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
        )
    }
    // else if(miniProfiles) {

    // }
    else if(data?.topHashtag !== null) {
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
                    src={ pfp } 
                    alt={`${ displayName }'s profile picture`}
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold">{ displayName }</h2>
                <p className="text-sm text-gray-600 mb-2">@{ username }</p>
                <p id='text' className="leading-5 pl-10 pr-10 mb-8 text-pretty">
                    { text }
                    <span className='font-bold text-tiktok-red'>
                        { highlight }
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

interface MiniProfileProps {
    pfp?: string;
    displayName: string;
    username: string;
    followers: string;
    video_count: string;
    type: boolean;
}

const MiniProfile: React.FC<MiniProfileProps> = ({
    pfp,
    displayName,
    username,
    followers,
    video_count,
    type
}) => {
    return (
        <div className='flex flex-col items-center'>
            <div className='bg-white rounded-md mb-2 px-3 py-0.5'>
                <p className='text-black text-xs font-semibold'>{type ? "JUST WATCHED" : "SIMILAR ACCOUNT"}</p>
            </div>
            <img 
                src={ pfp } 
                alt={`${ displayName }'s profile picture`}
                className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-base font-semibold leading-5">{ displayName }</h2>
            <p className="text-sm leading-5">@{ username }</p>
            <p className='text-xxs leading-4'>{followers} followers • { video_count } videos</p>
        </div>
    )
}

export default Interstitial;