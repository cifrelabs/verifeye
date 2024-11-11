"use client"

import React, { useEffect, useState } from 'react';
import ViewsOverTime, { abbreviateNumber } from './ViewsOverTime';
import HashtagCirclePack, { HashtagData } from './HashtagCirclePack';
import Timeline, { Video } from './Timeline';
import WhyAmISeeingThis from './WhyAmISeeingThis';
import MiniProfile from './MiniProfile';
import Lookalike from './Lookalike';
import { LookalikeData } from './Content';

export interface IData {
    timelineData: Video[];
    hashtagData: HashtagData | null;
    viewsData: any;
}

interface VerifeyeProps {
    setIsVerifeyeOpen: any;
    data: IData | null;
    accordionData: IAccordionData | null;
    username?: string;
    miniProfiles: Array<{ image: string; displayName: string; username: string; interaction: string; site: string; }>;
    lookalike: LookalikeData;
}

const Verifeye: React.FC<VerifeyeProps> = ({ setIsVerifeyeOpen, data, accordionData, username, miniProfiles, lookalike }) => {
    const [isWhyPageOpen, setIsWhyPageOpen] = useState(false);

    const h2Css = "font-bold text-xl text-black mb-4"
    let tempDate = "July 10, 2024"

    console.log('outside data: ', data); // logs undefined
    console.log('cash me ousside data: ', accordionData)
    useEffect(() => {
        console.log('useEffect data: ', {data}); // logs undefined
    }, [data])

    useEffect(() => {
        console.log('accordion data, ', {accordionData});
    }, [accordionData])

    return (
        <div className='fixed -translate-x-1/2 left-1/2 top-0 z-20 bg-white w-screen min-h-min' onClick={(e: React.MouseEvent<HTMLElement>) => {e.stopPropagation()}}>
            {/* HEADER */}
            <div className="py-7 grid grid-cols-7">
                <div className='flex content-center col-start-1 col-end-2'>
                    <button className="bg-white text-black font-bold px-4">
                        <img src="/icons/back.png" alt="Back" height={15} width={15} onClick={() => {setIsVerifeyeOpen(false)}} />
                    </button>
                </div>
                <div className='flex place-content-center col-start-2 col-end-7'>
                    <p className="text-black font-semibold text-sm leading-none">Verifiability Details</p>
                </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col h-screen items-center overflow-scroll px-10 pb-12">
                <div className='gap-10 mb-10'>
                    <h2 className="font-bold text-3xl text-black text-center text-pretty mb-3">Review account details</h2>
                    <p className="text-sm text-black text-center text-pretty">
                        To help keep our community informed, we provide detailed information about accounts on TikTok.&nbsp;
                        <span className='font-bold' onClick={() => {setIsWhyPageOpen(true)}}>
                            Why am I seeing this?
                        </span>
                    </p>
                </div>

                <div className="space-y-10">
                    {/* A likely lookalike */}
                    <div>
                        <h2 className={`${h2Css}`}>A likely lookalike</h2>
                        <LookalikeAccount lookalike={lookalike}/>
                    </div>

                    {/* Social media and articles */}
                    <div>
                        <h2 className={`${h2Css}`}>What we found on the Internet</h2>
                        <SocialMedia miniProfiles={miniProfiles} />
                    </div>

                    {/* Account Analysis */}
                    <div className="flex flex-col pb-96">
                        <h2 className={`${h2Css}`}>Account Analysis</h2>
                        <div className="flex flex-col flex-grow gap-10">
                            <Accordion
                                header={"Timeline"}
                                body="User posted their first video on"
                                component={<Timeline data={data?.timelineData} username={username} />}
                                emphasis={accordionData?.createDate.toString()}
                            />
                            <Accordion
                                header={"Hashtags used"}
                                body="The user's most used hashtag is"
                                component={<HashtagCirclePack data={data?.hashtagData ?? null} topHashtag={accordionData?.topHashtag ?? ''} />}
                                emphasis={accordionData?.topHashtag}
                            />
                            <Accordion
                                header={"Viewership and account activity"}
                                body={"This account averages"}
                                component={<ViewsOverTime data={data?.viewsData} username={username} />}
                                emphasis={abbreviateNumber(accordionData?.averageViewers ?? 0) + " viewers"}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isWhyPageOpen && (
                <WhyAmISeeingThis setState={setIsWhyPageOpen}></WhyAmISeeingThis>
            )}
        </div>
    );
}

interface LookalikeAccountProps {
    lookalike: LookalikeData;
}

const LookalikeAccount: React.FC<LookalikeAccountProps> = ({ lookalike }) => {
    const deflookalike: LookalikeData = {
        current_image: 'default',
        current_displayName: 'default',
        current_username: 'default',
        current_followerCount: '0',
        current_videoCount: '0',
        image: 'default',
        displayName: 'default',
        username: 'default',
        followerCount: '0',
        videoCount: '0',
    }
    if (lookalike != deflookalike){
        return (
            <Lookalike 
            currentPfp={lookalike.current_image} 
            currentDisplayName={lookalike.current_displayName} 
            currentUsername={lookalike.current_username}
            currentFollowers={lookalike.current_followerCount}
            currentVideos={lookalike.current_videoCount}
            lookalikePfp={lookalike.image}
            lookalikeDisplayName={lookalike.displayName}
            lookalikeUsername={lookalike.username}
            lookalikeFollowers={lookalike.followerCount}
            lookalikeVideos={lookalike.videoCount}/>
        )
    }
    else{
        return (
            <p>No Lookalike Account Found</p>
        )
    }
}

interface SocialMediaProps {
    miniProfiles: Array<{ image: string; displayName: string; username: string; interaction: string; site: string;}>;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ miniProfiles }) => {
    // Get the unique sites from miniProfiles
    const uniqueSites = Array.from(new Set(miniProfiles.map(profile => profile.site)));

    // Function to format the sites with Oxford comma
    const formatSites = (sites: string[]) => {
        if (sites.length === 0) return '';
        if (sites.length === 1) return sites[0];
        if (sites.length === 2) return sites.join(' and ');
        return `${sites.slice(0, -1).join(', ')}, and ${sites[sites.length - 1]}`;
    };

    return (
        <div className="flex flex-col gap-4 text-sm text-black">
            <div>
                <p>
                    We found <span className='font-bold text-tiktok-red'>{miniProfiles.length}</span> possible matching accounts from {formatSites(uniqueSites)}
                </p>
            </div>
            <div className='flex flex-row flex-wrap w-full justify-evenly'>
                {miniProfiles.map((profile, index) => (
                    <MiniProfile 
                        key={index}
                        image={profile.image}
                        displayName={profile.displayName}
                        username={profile.username}
                        interaction={profile.interaction}
                        site={profile.site}
                    />
                ))}
            </div>
            <div>
                <p>
                    We also found a Wikipedia article mentioning the user
                </p>
            </div>
        </div>
    )
}

export interface IAccordionData {
    createDate: number;
    topHashtag: string;
    averageViewers: number;
}

interface AccordionProps {
    header: string;
    body: string;
    component: object;
    emphasis?: string;
    data?: IAccordionData;
}

const Accordion: React.FC<AccordionProps> = ({ header, body, component, emphasis }) => {
    const [expand, setExpand] = useState(false);

    return (
        <div className='flex flex-col'>
            <h3 className='text-black font-semibold'>{header}</h3>
            {!expand ?
                <div onClick={() => setExpand(true)}>
                    <p className='text-black text-sm'>
                        {body}
                        <span className='font-bold text-tiktok-red'>{emphasis && " " + emphasis}</span>...&nbsp;
                        <span className='text-black font-semibold'>See more</span>
                    </p>
                </div>
                :
                <div onClick={() => setExpand(false)}>
                    <>{component}</>
                </div>
            }
        </div>
    )
}

export default Verifeye;
