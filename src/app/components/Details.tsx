import React from 'react';

const Details: React.FC = () => {
    return (
        <div>
            <div className="w-full flex flex-row items-center justify-center px-4 py-2 bg-white">
                <div className='flex-1 flex justify-start'>
                    <button className="bg-white text-black font-bold py-2 px-4">
                        <img src="/icons/back.png" alt="Back" className='w-5'/>
                    </button>
                </div>
                <div className='flex-1 flex justify-center'>
                    <p className="text-black font-semibold text-sm w-fit">Verifiability Details</p>
                </div>
                <div className='flex-1'></div>
            </div>
            <div className="h-screen flex flex-col items-center scrollbar-hide bg-white overflow-scroll px-12 pb-12">
                <p className="font-bold text-2xl text-black mt-10 text-center">Review Account</p>
                <p className="font-bold text-2xl text-black mt-4 text-center">Details</p>
                <p className="font-normal text-base text-black text-center mt-8">
                    To help keep our community informed, we provide detailed information about accounts on TikTok.
                </p>
                <p className="font-semibold text-base text-black text-center">
                    Read to gain deeper insight on the account through publicly available analytics.
                </p>
                <div className="flex flex-col items-start w-full">
                    <p className="font-bold text-xl text-black mt-12 text-start">A Possible Lookalike</p>
                    <p className="font-normal text-base text-black mt-4">
                        A different TikTok account with a similar name yet higher interaction count exists
                    </p>
                </div>
                <div className="flex flex-col items-start w-full">
                    <p className="font-bold text-xl text-black mt-12">What we found on the Internet</p>
                    <p className="font-normal text-base text-black mt-4">
                        We found 2 possible matching accounts from Twitter and Facebook
                    </p>
                    <p className="font-normal text-base text-black mt-4">
                        We also found a Wikipedia article mentioning the user
                    </p>
                </div>
                <div className="flex flex-col items-start w-full">
                    <p className="font-bold text-xl text-black mt-12">Account Analysis</p>
                    <div className="flex flex-col items-start w-full mt-8">
                        <p className="font-semibold text-base text-black">Timeline</p>
                        <p className="font-normal text-base text-black mt-4">
                            User posted their first video on DATE
                        </p>
                        <p className="font-bold text-sm text-black mt-2">See More</p>
                    </div>
                    <div className="flex flex-col items-start w-full mt-8">
                        <p className="font-semibold text-base text-black">Hashtags used</p>
                        <p className="font-normal text-base text-black mt-4">
                            The user's most used hashtag is HASHTAG
                        </p>
                        <p className="font-bold text-sm text-black mt-2">See More</p>
                    </div>
                    <div className="flex flex-col items-start w-full mt-8">
                        <p className="font-semibold text-base text-black">Viewership and account activity</p>
                        <p className="font-normal text-base text-black mt-4">
                            This account averages 0 viewers per video
                        </p>
                        <p className="font-bold text-sm text-black mt-2">See More</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
