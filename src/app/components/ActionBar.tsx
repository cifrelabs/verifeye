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

const ActionBar: React.FC<ActionBarProps> = ({ pfp, likes, comments, favorites, shares, audio }) => {
    const [isVerified, setIsVerified] = useState(false);
    
    return (
        <div className="absolute right-2.5 bottom-20 flex flex-col space-y-5">
            <ActionButton icon="/svgs/avatar.svg" size={50} type='profile' />
            <ActionButton icon="/svgs/like.svg" altIcon="/svgs/like-red.svg" count={likes} type='like' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/comment.svg" count={comments} type='comments' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/favorite.svg" altIcon="/svgs/favorite-yellow.svg" count={favorites} type='favorite' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/share.svg" count={shares} type='share' size={28} isVerified={isVerified} setIsVerified={setIsVerified} />
            <ActionButton icon="/svgs/audio.svg" type="audio" size={35} />
        </div>
    );
};

interface ActionButtonProps {
    icon: string;
    type: string;
    altIcon?: string;
    count?: number;
    size?: number;
    isVerified?: any;
    setIsVerified?(bool: boolean): any;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, altIcon, type, count, size = 32, isVerified, setIsVerified }) => {
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
                <Image
                    src={!actionState ? icon : (altIcon ? altIcon : icon)}
                    alt="Action"
                    width={size}
                    height={size}
                    style={{ width: 'auto', height: `${size}px` }}
                />
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

export default ActionBar;