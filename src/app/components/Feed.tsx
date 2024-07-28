"use client"

import React, { useEffect, useState, useRef } from 'react';
import Content from './Content';
import Highlight from './Highlight';
import { AutoplayProvider } from '../contexts/AutoplayContext';
import { PoliticalContext, UsernameContext } from '../contexts/Contexts';
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

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const Feed: React.FC<FeedProps> = ({ contents }) => {
    const [hasInvestigated, setHasInvestigated] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);
    const [shuffledContents, setShuffledContents] = useState(contents);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const shuffled = shuffleArray([...contents]);
        setShuffledContents(shuffled);
    }, [contents]);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = 0;
        }
    }, [shuffledContents]);

    return (
        <AutoplayProvider>
            <div ref={feedRef} className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory">
                {shuffledContents.map((content, index) => (
                    <React.Fragment key={content.id}>
                        <div className="snap-start h-full">
                            <PoliticalContext.Provider value={content.political}>
                                <UsernameContext.Provider value={content.username}>
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
                                </UsernameContext.Provider>
                            </PoliticalContext.Provider>
                        </div>
                        {!hasInvestigated && content.political && (
                            <div className="snap-start h-full">
                                <Highlight
                                    username={content.username}
                                    displayName={content.display_name}
                                    id={content.highlight_id}
                                    pfp={content.pfp}
                                    setOpenDetails={() => {
                                        setCurrentUsername(content.username);
                                        setOpenDetails(true);
                                    }}
                                    onNext={() => { }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            {openDetails && <Details setOpenDetails={setOpenDetails} username={currentUsername} />}
        </AutoplayProvider>
    );
}

export default Feed;
