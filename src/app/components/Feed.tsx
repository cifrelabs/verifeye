import React from 'react';
import Content from './Content';

interface FeedProps {
    contents: Array<{
        id: string;
        username: string;
        displayName: string;
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
                        username={content.username}
                        displayName={content.displayName}
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