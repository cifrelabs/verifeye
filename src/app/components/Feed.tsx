"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import Content from './Content';
import Highlight from './Highlight';
import { AutoplayProvider } from '../contexts/AutoplayContext';
import { PoliticalContext } from '../contexts/PoliticalContext';
import Details from './Details';

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
    const [hasInvestigated, setHasInvestigated] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    
    return (
        <AutoplayProvider>
            <div className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory">
                {contents.flatMap((content, index) => [
                    <div key={`content-${content.id}`} className="snap-start h-full">
                        <PoliticalContext.Provider value = {content.political}>
                            <Content
                                soundUsed={content.sound_used}
                                displayName={content.display_name}
                                captions={content.captions}
                                likes={content.likes}
                                comments={content.comments}
                                favorites={content.favorites}
                                shares={content.shares}
                                media={content.media}
                                pfp={content.pfp}
                                setHasInvestigated={content.political ? setHasInvestigated : undefined}
                            />
                        </PoliticalContext.Provider>
                    </div>,
                    !hasInvestigated && content.political && (
                        <div key={`highlight-${content.id}`} className="snap-start h-full">
                            <Highlight
                                username={content.username}
                                displayName={content.display_name}
                                id={content.highlight_id}
                                pfp={content.pfp}
                                setOpenDetails={setOpenDetails}
                                onNext={()=>{}}
                            />
                        </div>
                    )
                ].filter(Boolean))}
            </div>
            {openDetails && <Details setOpenDetails={setOpenDetails}/>}
        </AutoplayProvider>
    );
}

export default Feed;