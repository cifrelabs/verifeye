import React from 'react';
import Content from './Content';

interface FeedProps {
    contents: Array<{
        id: string;
        sound_used?: string;
        display_name: string;
        captions: string;
        likes: number;
        comments: number;
        favorites: number;
        shares: number;
        media: string;
    }>;
}

const Feed: React.FC<FeedProps> = ({ contents }) => {
    return (
        <div className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory">
            {contents.map(content => (
                <div key={content.id} className="snap-start h-full">
                    <Content
                        soundUsed={content.sound_used}
                        displayName={content.display_name}
                        captions={content.captions}
                        likes={content.likes}
                        comments={content.comments}
                        favorites={content.favorites}
                        shares={content.shares}
                        media={content.media}
                    />
                </div>
            ))}
        </div>
    );
}

export default Feed;