import React from 'react';
import Image from 'next/image';
// TODO: Props

const Details: React.FC = () => {
    return (
        <>
            <div className="min-h-screen min-w-full bg-white flex flex-col px-16 items-center mt-8">
                <p className="font-bold text-2xl text-black mt-10 text-center">Review Account</p>
                <p className="font-bold text-2xl text-black mt-4 text-center">Details</p>
                <p className="font-normal text-base text-black text-center mt-8">To help keep our community informed, we provide detailed information about accounts on TikTok.</p>
                <p className="font-semibold text-base text-black text-center">Read to gain deeper insight on the account through publicly available analytics.</p>
                <div className='flex flex-col items-start w-full'>
                    <p className="font-bold text-xl text-black mt-12 text-start">A Possible Lookalike</p>
                    <p className="font-normal text-base text-black mt-4">A different TikTok account with a similar name yet higher interaction count exists</p>
                    {/* <div>
                        TODO: Lookalike account
                    </div> */}
                </div>
                <div className="flex flex-col items-start w-full">
                    <p className="font-bold text-xl text-black mt-12">What we found on the Internet</p>
                    <p className="font-normal text-base text-black mt-4">We found 2 possible matching accounts from Twitter and Facebook</p>
                    {/* <div>
                        TODO: Account search
                    </div> */}
                    <p className="font-normal text-base text-black mt-4">We also found a Wikipedia article mentioning the user</p>
                </div>
                <div className='flex flex-col items-start w-full'>
                    <p className='font-bold text-xl text-black mt-12'>Account Analysis</p>
                    <div className='flex flex-col items-start w-full mt-8'>
                        <p className="font-semibold text-base text-black">Timeline</p>
                        <p className='font-normal text-base text-black mt-4'>User posted their first video on DATE</p>
                        <p className='font-bold text-sm text-black mt-2'>See More</p>
                        {/* TODO: Component/Backend for posting dates */}
                    </div>
                    <div className='flex flex-col items-start w-full mt-8'>
                        <p className="font-semibold text-base text-black">Hashtags used</p>
                        <p className='font-normal text-base text-black mt-4'>The user's most used hashtag is HASHTAG</p>
                        <p className='font-bold text-sm text-black mt-2'>See More</p>
                        {/* TODO: Component/Backend for hashtag usage */}
                    </div>
                    <div className='flex flex-col items-start w-full mt-8'>
                        <p className="font-semibold text-base text-black">Viewership and account activity</p>
                        <p className='font-normal text-base text-black mt-4'>This account averages 0 viewers per video</p>
                        <p className='font-bold text-sm text-black mt-2'>See More</p>
                        {/* TODO: Component/Backend for viewership and activity */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Details;