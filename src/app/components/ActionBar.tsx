import React, { useState } from 'react';
import Image from 'next/image';
import { VerifeyeModal } from "./VerifeyeModal";
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
    const [verifeyeModalOpen, setVerifeyeModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    
    return (
        <div className="absolute right-2.5 bottom-20 flex flex-col space-y-5">
            <ActionButton icon="/svgs/avatar.svg" size={50} />
            <ActionButton icon="/svgs/like.svg" count={likes} size={28} />
            <ActionButton icon="/svgs/comment.svg" count={comments} size={28} />
            <ActionButton icon="/svgs/favorite.svg" count={favorites} size={28} />
            <ActionButton icon="/svgs/share.svg" count={shares} size={28} setShareModalOpen={setShareModalOpen} />
            <ActionButton icon="/svgs/audio.svg" size={35} />

            {shareModalOpen && (
                <ShareModal
                    setModalOpen={setShareModalOpen}
                />
            )}
        </div>
        
    );
};

interface ActionButtonProps {
    icon: string;
    count?: number;
    size?: number;
    setVerifeyeModal?: any;
    setShareModalOpen?: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, count, size = 32, setVerifeyeModal, setShareModalOpen }) => {
    return (
        <div className="flex flex-col items-center">
            <button className="flex items-center justify-center filter drop-shadow-lg" onClick={setShareModalOpen ? () => setShareModalOpen(true) : undefined}>
                <Image
                    src={icon}
                    alt="Action"
                    width={size}
                    height={size}
                    style={{ width: 'auto', height: `${size}px` }}
                />
            </button>
            {count !== undefined && (
                <span className="text-white text-xs mt-1 filter drop-shadow">{formatCount(count)}</span>
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