interface WhyAmISeeingThisProps {
    setState: (value: boolean) => void
}

const WhyAmISeeingThis: React.FC<WhyAmISeeingThisProps> = ({ setState }) => {
    return (
        <div className="absolute top-0 left-0 h-screen w-screen bg-white text-black z-50">
            {/* HEADER */}
            <div className="py-7 grid grid-cols-7">
                <div className='flex content-center col-start-1 col-end-2'>
                    <button className="px-4">
                        <img src="/icons/back.png" alt="Back" height={15} width={15} onClick={() => {setState(false)}} />
                    </button>
                </div>
                <div className='flex place-content-center col-start-2 col-end-7'>
                    <p className="font-semibold text-sm leading-none">Why am I seeing this?</p>
                </div>
            </div>

            {/* BODY */}
            <div className="overflow-scroll h-screen px-10 space-y-3 pb-96">
                <h1 className="font-bold text-3xl text-center">TikTok's "Review Account Details"</h1>
                
                <div className="text-sm space-y-3">
                    <p>We know that you want to see factual and accurate content, which comes with the best TikTok experience we are dedicated to providing you for every video you swipe into. As such, you can now access information about the videos that you might find relevant. Viewing “Review account details”, you will be able to see the following information:</p>
                    <ul className="px-5 space-y-1">
                        <li><span className="font-bold">Timeline</span>: The date when the account's first video was posted. This section can be expanded, where you are able to see the date of posting of the video you just watched, as well the date of posting of the account's latest video</li>
                        <li><span className="font-bold">Hashtags used</span>: The account's most-used hashtag. This can also be expanded to see a visual representation of the account's most used hashtags, illustrated as colourful circles!</li>
                        <li><span className="font-bold">Viewership and account activity</span>: For the nerds out there. We display statistics about the interactions the account receives overtime as well as how active they are when it comes to posting videos.</li>
                    </ul>
                    <p>If available, these information can also be viewed:</p>
                    <ul className="px-5 space-y-1">
                        <li><span className="font-bold">A likely lookalike</span>: Displays an account with a similar profile photo, display name, and/or username with a higher interaction count (e.g., followers and likes).</li>
                        <li><span className="font-bold">What we found on the Internet</span>: Other accounts that the user owns outside of TikTok.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default WhyAmISeeingThis;