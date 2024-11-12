import React from "react";

export interface LookalikeData {
    current_image: string;
    current_displayName: string;
    current_username: string;
    current_followerCount: string;
    current_videoCount: string;
    image: string;
    displayName: string;
    username: string;
    followerCount: string;
    videoCount: string;
}

interface LookalikeProps {
    currentPfp?: string;
    currentDisplayName: string;
    currentUsername: string;
    currentFollowers: string;
    currentVideos: string;
    lookalikePfp?: string;
    lookalikeDisplayName: string;
    lookalikeUsername: string;
    lookalikeFollowers: string;
    lookalikeVideos: string;
}

const Lookalike: React.FC<LookalikeProps> = ({
    currentPfp,
    currentDisplayName,
    currentUsername,
    currentFollowers,
    currentVideos,
    lookalikePfp,
    lookalikeDisplayName,
    lookalikeUsername,
    lookalikeFollowers,
    lookalikeVideos,
}) => {
    return (
        <div>
            <p className="text-sm text-black">A different TikTok account with a similar profile yet higher interaction count exists</p>
            <div className="text-black flex flex-row justify-evenly mt-4">
                <MiniProfile
                    pfp={currentPfp}
                    displayName={currentDisplayName}
                    username={currentUsername}
                    followers={currentFollowers}
                    video_count={currentVideos}
                />

                <MiniProfile
                    pfp={lookalikePfp}
                    displayName={lookalikeDisplayName}
                    username={lookalikeUsername}
                    followers={lookalikeFollowers}
                    video_count={lookalikeVideos}
                />
            </div>
        </div>
    );
}

interface MiniProfileProps {
    pfp?: string;
    displayName: string;
    username: string;
    followers: string;
    video_count: string;
}

const MiniProfile: React.FC<MiniProfileProps> = ({
    pfp,
    displayName,
    username,
    followers,
    video_count
}) => {
    return (
        <div className="flex flex-col items-center text-xs">
            <img src={pfp || ""} alt="profile picture" className="size-16 rounded-full mb-4"/>
            <p className="font-semibold text-sm">{ displayName }</p>
            <p className="font-medium">@{ username }</p>
            <div className="flex flex-row mt-1 space-x-2 text-xxs">
                {/* <p className="text-center">{followers} followers</p>
                <p className="text-center">{video_count} videos</p> */}
                <p>{followers} followers • { video_count } videos</p>
            </div>
        </div>
    )
}

export default Lookalike;
