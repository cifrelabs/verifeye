import React from 'react';
import Content from './Content';
import Highlight from './Highlight';

interface FeedProps {
    contents: Array<{
        id: string;
        username: string;
        display_name: string;
        pfp: string;


        media: string;
        captions: string;
        sound_used: string;

        likes: number;
        comments: number;
        favorites: number;
        shares: number;

        political: boolean;
        highlight_id: string;
    }>;
}

const Feed: React.FC<FeedProps> = ({ contents }) => {
    return (
        <div className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory">
            {contents.map(content => (
                <>
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
                    {content.political && (
                        <div key={content.id + "h"} className="snap-start h-full">
                            <Highlight
                                username={content.username}
                                displayName={content.display_name}
                                id={content.highlight_id}
                                pfp={content.pfp}
                            />
                        </div>
                    )}
                </>
            ))}
        </div>
    );
}

export default Feed;