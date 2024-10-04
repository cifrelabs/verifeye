"use client"

import React, { useState } from 'react';
import ViewsOverTime from './ViewsOverTime';
import HashtagCirclePack from './HashtagCirclePack';
import Timeline from './Timeline';
import WhyAmISeeingThis from './WhyAmISeeingThis';
import MiniProfile from './MiniProfile';

interface DetailsProps {
    setOpenDetails: any;
    username: string | null;
}

const Details: React.FC<DetailsProps> = ({ setOpenDetails, username }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const h2Css = "font-bold text-xl text-black mb-4"
    let tempDate = "July 10, 2024"
    let tempHashtag = "#fypシ"

    return (
        <div className='fixed -translate-x-1/2 left-1/2 top-0 z-20 bg-white w-screen min-h-min' onClick={(e: React.MouseEvent<HTMLElement>) => {e.stopPropagation()}}>
            {/* HEADER */}
            <div className="py-7 grid grid-cols-7">
                <div className='flex content-center col-start-1 col-end-2'>
                    <button className="bg-white text-black font-bold px-4">
                        <img src="/icons/back.png" alt="Back" height={15} width={15} onClick={() => {setOpenDetails(false)}} />
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
                        <span className='font-bold' onClick={() => {setIsModalOpen(true)}}>
                            Why am I seeing this?
                        </span>
                    </p>
                </div>

                <div className="flex flex-col gap-10">
                    {/* A likely lookalike */}
                    <div className="flex flex-col">
                        <h2 className={`${h2Css}`}>A likely lookalike</h2>
                        <Lookalike/>
                    </div>

                    {/* Social media and articles */}
                    <div className="flex flex-col">
                        <h2 className={`${h2Css}`}>What we found on the Internet</h2>
                        <SocialMedia/>
                    </div>

                    {/* Account Analysis */}
                    <div className="flex flex-col pb-96">
                        <h2 className={`${h2Css}`}>Account Analysis</h2>
                        <div className="flex flex-col flex-grow gap-10">
                            <Accordion
                                header={"Timeline"}
                                body={`User posted their first video on ${tempDate}...`}
                                component={<Timeline username={username} />}
                            />
                            <Accordion
                                header={"Hashtags used"}
                                body={`The user's most used hashtag is ${tempHashtag}...`}
                                component={<HashtagCirclePack username={username} />}
                            />
                            <Accordion
                                header={"Viewership and account activity"}
                                body={"This account averages 174.1K viewers per video..."}
                                component={<ViewsOverTime username={username} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <WhyAmISeeingThis setState={setIsModalOpen}></WhyAmISeeingThis>
            )}
        </div>
    );
}

interface LookalikeProps {
}

const Lookalike: React.FC<LookalikeProps> = ({}) => {
    return (
        <div>
            <p className="text-sm text-black">
                A different TikTok account with a similar name yet higher interaction count exists
            </p>
        </div>
    )
}

interface SocialMediaProps {
}

const SocialMedia: React.FC<SocialMediaProps> = ({}) => {
    return (
        <div className="flex flex-col gap-4 text-sm text-black">
            <div>
                <p>
                    We found <span className='font-bold text-tiktok-red'>2</span> possible matching accounts from Twitter and Facebook
                </p>
            </div>
            <div className='flex flex-row flex-wrap w-full justify-evenly'>
                <MiniProfile image='/images/temp.jpg' displayName='Display Name' username='username' interaction='100k followers'/>
                <MiniProfile image='/images/temp.jpg' displayName='Display Name' username='username' interaction='100k followers'/>
                <MiniProfile image='/images/temp.jpg' displayName='Display Name' username='username' interaction='100k followers'/>
            </div>
            <div>
                <p>
                    We also found a Wikipedia article mentioning the user
                </p>
            </div>
        </div>
    )
}

interface AccordionProps {
    header: string;
    body: string;
    component: object;
}

const Accordion: React.FC<AccordionProps> = ({ header, body, component }) => {
    const [expand, setExpand] = useState(false);

    return (
        <div className='flex flex-col'>
            <h3 className='text-black font-semibold'>{header}</h3>
            {!expand ?
                <div onClick={() => setExpand(true)}>
                    <p className='text-black text-sm'>{body} <span className='text-black font-semibold'>See more</span></p>
                </div>
                :
                <div onClick={() => setExpand(false)}>
                    <>{component}</>
                </div>
            }
        </div>
    )
}

export default Details;
