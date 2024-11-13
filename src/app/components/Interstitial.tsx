"use client"

import React, { useEffect } from 'react';
import { IAccordionData } from './Verifeye';
import { LookalikeData } from './Lookalike';

interface InterstitialProps {
    username: string;
    displayName: string;
    pfp: string;
    lookalike: LookalikeData | null;
    miniProfiles: Array<{ image: string; displayName: string; username: string; interaction: string; site: string; }>;
    setIsVerifeyeOpen: (bool: boolean) => void;
    setHasInvestigated: (bool: boolean) => void;
}

const Interstitial: React.FC<InterstitialProps> = ({
    username, 
    displayName, 
    pfp,
    lookalike,
    miniProfiles,
    setIsVerifeyeOpen,
    setHasInvestigated
}) => {
    const handleSeeMore = () => {
        setIsVerifeyeOpen(true);
    }

    const handleSkip = () => {
        setHasInvestigated(true);
        setIsVerifeyeOpen(false)
    }

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
                    <p className="leading-5 pl-10 pr-10 mb-8 text-pretty">Another account with a similar profile exists</p>
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
                            <p className="text-kinda-sm tracking-wide">Dismiss</p>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    else if(miniProfiles.length > 0) {
        let profile = miniProfiles[0];
        let src;

        switch(profile.site) {
            case "LinkedIn": src = "images/linkedin.png"; break;
            case "Facebook": src = "/svgs/facebook.svg"; break;
            case "Instagram": src = "/images/instagram-alt.png"; break;
            case "Twitter": src = "images/twitter.png"; break;
        }
        return (
            <div className="h-screen flex items-center justify-center relative">
                <div className="flex flex-col items-center text-center z-10 px-5">
                    <img 
                        src={ pfp } 
                        alt={`${ displayName }'s profile picture`}
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <h2 className="text-xl font-bold">{ displayName }</h2>
                    <p className="text-sm mb-2">@{ username }</p>
                    <p id='text' className="leading-5 pl-10 pr-10 mb-2 text-pretty">We found a {profile.site} account possily belonging to this user</p>
                    <div className='flex flex-row items-end bg-white rounded-md gap-x-3 mb-8 p-4'>
                        <div className='relative'>
                            <img
                                src={profile.image}
                                alt={`Profile image of this TikTok user's ${profile.site} account`}
                                className='size-20 rounded-full'
                            />
                            <img
                                src={src}
                                alt={`Image of ${profile.site}'s logo, indicating that the account came from ${profile.site}`}
                                className='absolute bottom-0 right-0 size-6'
                            />
                        </div>
                        <div className='flex flex-col content-end text-sm text-left text-black leading-4'>
                            <p className='font-semibold w-40'>{ profile.displayName }</p>
                            <p>@{ profile.username }</p>
                            <p>{ profile.interaction }</p>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-2'>
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
                            <p className="text-kinda-sm tracking-wide">Dismiss</p>
                        </button>
                    </div>
                </div>
            </div>
        )
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
                <p className="text-sm mb-2">@{ username }</p>
                <p className="leading-5 pl-10 pr-10 mb-8 text-pretty">
                    We did not find any possible matching accounts from other social media
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
                        <p className="text-kinda-sm tracking-wide">Dismiss</p>
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
            {type ? (
                <div className='bg-white rounded-md mb-2 px-3 py-0.5'>
                    <p className='text-black text-xs font-semibold'>JUST WATCHED</p>
                </div>
            ) : (
                <div className='bg-tiktok-red rounded-md mb-2 px-3 py-0.5'>
                    <p className='text-white text-xs font-semibold'>SIMILAR ACCOUNT</p>
                </div>
            )}
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