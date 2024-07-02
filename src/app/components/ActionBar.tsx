import React from 'react';
import Image from 'next/image';

interface ActionBarProps {
    pfp?: string;
    likes: number;
    comments: number;
    favorites: number;
    shares: number;
    audio?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ pfp, likes, comments, favorites, shares, audio }) => {
    return (
        <div className="absolute right-2.5 bottom-20 flex flex-col space-y-5">
            <ActionButton icon="/svgs/avatar.svg" />
            <ActionButton icon="/svgs/like.svg" count={likes} />
            <ActionButton icon="/svgs/comment.svg" count={comments} />
            <ActionButton icon="/svgs/favorite.svg" count={favorites} />
            <ActionButton icon="/svgs/share.svg" count={shares} />
            <ActionButton icon="/svgs/audio.svg" />
        </div>
    );
};

interface ActionButtonProps {
    icon: string;
    count?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, count }) => {
    return (
        <div className="flex flex-col items-center">
            <button className="flex items-center justify-center filter drop-shadow-lg">
                <Image 
                    src={icon} 
                    alt="Action" 
                    width={0}
                    height={0}
                    className="w-auto h-8 text-white fill-current"
                />
            </button>
            {count !== undefined && (
                <span className="text-white text-xs mt-2 filter drop-shadow">{formatCount(count)}</span>
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