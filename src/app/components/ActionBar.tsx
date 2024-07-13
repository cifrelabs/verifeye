import React, { useState } from 'react';
import Image from 'next/image';
import { VerifeyeModal } from "./VerifeyeModal";
import { CommentsModal } from "./CommentsModal";
import { ShareModal } from "./ShareModal";

interface ActionBarProps {
    pfp?: string;
    likes: number;
    comments: number;
    favorites: number;
    shares: number;
    audio?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ pfp, likes, comments, favorites, shares }) => {
    const [isVerified, setIsVerified] = useState(false);
    
    return (
        <div className="absolute right-2.5 bottom-20 flex flex-col space-y-5">
            <ActionButton icon="/svgs/avatar.svg" pfp={pfp} size={50} type='profile' />
            <ActionButton icon="/svgs/like.svg" altIcon="/svgs/like-red.svg" count={likes} type='like' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/comment.svg" count={comments} type='comments' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/favorite.svg" altIcon="/svgs/favorite-yellow.svg" count={favorites} type='favorite' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/share.svg" count={shares} type='share' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/audio.svg" type="audio" size={35} />
        </div>
    );
};

interface ActionButtonProps {
    pfp?: string;
    icon: string;
    type: string;
    altIcon?: string;
    count?: number;
    size?: number;
    isVerified?: any;
    setIsVerified?(bool: boolean): any;
}

const ActionButton: React.FC<ActionButtonProps> = ({ pfp, icon, altIcon, type, count, size = 32, isVerified, setIsVerified }) => {
    const [verifeyeModalOpen, setVerifeyeModalOpen] = useState(false);
    const [actionState, setActionState] = useState(false);

    const manageState = () => {
        if(!isVerified)
            setVerifeyeModalOpen(true)
        else
            setActionState(!actionState)
        
        if(setIsVerified != undefined)
            setIsVerified(true);
    };

    interface ModalText {
        'like': string[];
        'comments': string[];
        'favorite': string[];
        'share': string[];
    }

    let modalText: ModalText = {
        'like': ['Review the account before leaving a like?', 'Like anyway'],
        'comments': ['Review the account before checking the comments?', 'Check comments anyway'],
        'favorite': ['Review the account before you bookmark?', 'Bookmark anyway'],
        'share': ['Review the account before sharing?', 'Share anyway'],
    };

    return (
        <div className="flex flex-col items-center">
            <button className="flex items-center justify-center filter drop-shadow-lg" type='button' onClick={() => manageState()}>
                {!pfp ? <Image
                    src={!actionState ? icon : (altIcon ? altIcon : icon)}
                    alt="Action"
                    width={size}
                    height={size}
                    style={{ width: 'auto', height: `${size}px` }}
                /> :
                    getAvatarIcon(pfp)
                }
            </button>

            {count !== undefined && (
                <span className="text-white text-xs mt-1 filter drop-shadow">{formatCount(count)}</span>
            )}

            {type in modalText && verifeyeModalOpen && (
                <VerifeyeModal
                    modalText={modalText[type as keyof ModalText]}
                    setVerifeyeModalOpen={setVerifeyeModalOpen}
                    setActionState={setActionState}
                >
                </VerifeyeModal>
            )}

            {type == 'comments' && actionState && (
                <CommentsModal
                    count={0}
                    setCommentsModalOpen={setActionState}
                />
            )}
            
            {type == 'share' && actionState && (
                <ShareModal
                    setShareModalOpen={setActionState}
                />
            )}
        </div>
    );
};

const formatCount = (count: number): string => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
};

const getAvatarIcon = (pfp: string) => {
    return (
        <svg width="50" height="60" viewBox="0 0 121 144" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="circleClip">
                    <circle cx="60.5" cy="60.5" r="59.0915" />
                </clipPath>
            </defs>
            <image 
                href={pfp} 
                width="121" 
                height="121" 
                x="0" 
                y="0" 
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#circleClip)"
            />
            <circle cx="60.5" cy="60.5" r="59.0915" fill="none" stroke="white" strokeWidth="2.8169"/>
            <circle cx="60.5" cy="113.438" r="30.25" fill="#FE2C55"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M60.5007 100.833C59.1085 100.833 57.9799 101.962 57.9799 103.354V110.916H50.4173C49.0251 110.916 47.8965 112.045 47.8965 113.437C47.8965 114.829 49.0251 115.958 50.4173 115.958H57.9799V123.521C57.9799 124.913 59.1085 126.041 60.5007 126.041C61.8929 126.041 63.0215 124.913 63.0215 123.521V115.958H70.584C71.9762 115.958 73.1048 114.829 73.1048 113.437C73.1048 112.045 71.9762 110.916 70.584 110.916H63.0215V103.354C63.0215 101.962 61.8929 100.833 60.5007 100.833Z" fill="white"/>
        </svg>
    );
};

export default ActionBar;