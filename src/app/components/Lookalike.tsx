import React from "react";

interface LookalikeProps {
    currentPfp?: string;
    currentDisplayName: string;
    currentUsername: string;
    currentFollowers: number;
    currentVideos: number;
    lookalikePfp?: string;
    lookalikeDisplayName: string;
    lookalikeUsername: string;
    lookalikeFollowers: number;
    lookalikeVideos: number;
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
        <div className="text-black flex flex-row justify-center mt-4">
            <div className="flex flex-col mx-4 items-center current">
                <img src={currentPfp || ""} alt="Current Profile" className="w-24 h-24 rounded-full mb-4"/>
                <p className="font-semibold">{currentDisplayName}</p>
                <p className="font-medium text-sm mt-2">@{currentUsername}</p>
                <div className="flex flex-row justify-center mt-2">
                    <p className="me-2 text-xs">{currentFollowers} followers</p>
                    <p className="text-xs">{currentVideos} videos</p>
                </div>
            </div>
            <div className="flex flex-col mx-4 items-center lookalike">
                <img src={lookalikePfp || ""} alt="Lookalike Profile" className="w-24 h-24 rounded-full mb-4"/>
                <p className="font-semibold">{lookalikeDisplayName}</p>
                <p className="font-medium text-sm mt-2">@{lookalikeUsername}</p>
                <div className="flex flex-row justify-center mt-2">
                    <p className="me-2 text-xs">{lookalikeFollowers} followers</p>
                    <p className="text-xs">{lookalikeVideos} videos</p>
                </div>
            </div>
        </div>
    );
}

export default Lookalike;
