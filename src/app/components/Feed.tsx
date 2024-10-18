"use client"

import React, { useEffect, useState, useRef } from 'react';
import Content, { IUserData } from './Content';
import { AutoplayProvider } from '../contexts/AutoplayContext';
import { PoliticalContext, UsernameContext } from '../contexts/Contexts';

interface FeedProps {
    contents: Array<IUserData>;
}

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const Feed: React.FC<FeedProps> = ({ contents }) => {
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
                {shuffledContents.map((content: IUserData, index) => (
                    <React.Fragment key={content.id}>
                        <div className="snap-start h-full">
                            <PoliticalContext.Provider value={content.political}>
                                <UsernameContext.Provider value={content.username}>
                                    <Content
                                        user={content}
                                    />
                                </UsernameContext.Provider>
                            </PoliticalContext.Provider>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </AutoplayProvider>
    );
}

export default Feed;
