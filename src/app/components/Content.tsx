"use client"

import React, { useRef, useEffect, useState } from 'react';
import ActionBar, { IInteractions } from './ActionBar';
import { useAutoplay } from '../contexts/AutoplayContext';
import Interstitial from './Interstitial';
import Verifeye, { IAccordionData, IData } from './Verifeye';
import { LookalikeData } from './Lookalike';
import { processData } from './HashtagCirclePack';
import { UserData } from './Timeline';
import { JsonViewsData, Post, getAverageViewers } from './ViewsOverTime';

interface ContentProps {
    user: IUserData;
}

export interface IUserData {
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
}

const Content: React.FC<ContentProps> = ({ user }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasInvestigated, setHasInvestigated] = useState(false);

    // video actions
    const { globalAutoplay, setGlobalAutoplay } = useAutoplay();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // verifeye props
    const [isVerifeyeOpen, setIsVerifeyeOpen] = useState(false);
    const [data, setData] = useState<IData | null>(null);
    const [accordionData, setAccordionData] = useState<IAccordionData | null>(null);
    const [miniProfiles, setMiniProfiles] = useState([]);
    const [lookalikeData, setLookalike] = useState<LookalikeData | null>(null);

    let interactions: IInteractions = {
        likes: user.likes,
        comments: user.comments,
        favorites: user.favorites,
        shares: user.shares,
    }

    const fetchTimelineData = async() => {
        try {
          const response = await fetch('analysisdata/' + user.username + '.json');
          const jsonData: UserData = await response.json();
  
          if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
            const sortedVideos = jsonData.result.posts.sort((a, b) => a.createTime - b.createTime);
            return {data: sortedVideos, highlight: 0};
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        return null;
    }

    const fetchHashtagData = async() => {
      try {
        const response = await fetch('analysisdata/' + user.username + '.json');
        const jsonData = await response.json();
        let topHashtag = "";
        if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
          const hashtagData = processData(jsonData.result.posts);
          if (hashtagData.children && hashtagData.children.length > 0) {
            topHashtag = hashtagData.children[0].name;
          }

          return {data: hashtagData, highlight: topHashtag};
        } else {
          console.error('Invalid JSON structure or no posts array found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      return null;
    }

    const fetchViewsData = async() => {
        try {
            const response = await fetch('/analysisdata/' + user.username + '.json');
            const jsonData: JsonViewsData = await response.json();

            if (jsonData && jsonData.result && Array.isArray(jsonData.result.posts)) {
                const filteredData = jsonData.result.posts.map((post: Post) => ({
                    playCount: post.stats?.playCount || 0,
                    createTime: post.createTime
                })).filter(d => {
                    return d.playCount > 0 && d.playCount < 100000000 && d.createTime > 0;
                }).sort((a, b) => a.createTime - b.createTime);

                return {data: filteredData, highlight: getAverageViewers(filteredData)};
            } else {
                console.error('Invalid JSON structure or no posts array found.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        return null;
    }

    const fetchMiniProfilesData = async () => {
        try {
            const response = await fetch('analysisdata/' + user.username + '.json');
            const jsonData = await response.json();
            
            console.log('Fetched data: ', jsonData);

            const miniProfiles = jsonData.result.miniProfiles || [];
            console.log('miniProfiles: ', miniProfiles);
            return miniProfiles;
        } catch (error) {
            console.error('Error fetching MiniProfile data:', error);
            return [];
        }
    };

    const fetchLookalike = async() => {
        try {
            const response = await fetch('analysisdata/' + user.username + '.json');
            const jsonData = await response.json();

            const lookalikeData : LookalikeData = {
                current_image: user.pfp,
                current_displayName: user.display_name,
                current_username: user.username,
                current_followerCount: jsonData.result.stats.followerCount,
                current_videoCount: jsonData.result.stats.videoCount,
                image: jsonData.result.lookalike.image,
                displayName: jsonData.result.lookalike.displayName,
                username: jsonData.result.lookalike.username,
                followerCount: jsonData.result.lookalike.followerCount,
                videoCount: jsonData.result.lookalike.videoCount,
            };

            console.log('Fetched: ', lookalikeData);

            return lookalikeData;
        }
        catch (error) {
            console.error('Error fetching lookalike data:', error);
        }
        return null;
    }

    useEffect(() => {
        console.log('Fetching miniProfiles data...');
        const fetchData = async () => {
            const profiles = await fetchMiniProfilesData();
            setMiniProfiles(profiles);
        };
        fetchData();
    }, [user.username]);

    // fetch lookalike data
    useEffect(() => {
        const fetchData = async () => {
            const lookalikeData = await fetchLookalike();
            setLookalike(lookalikeData);
        };
        fetchData();
    }, [user.username]);

    useEffect(() => {
        if (user.political) {
            const fetchData = async () => {
                const results = await Promise.all([
                    fetchTimelineData(),
                    fetchHashtagData(),
                    fetchViewsData(),
                ]);
    
                const [
                    timeline,
                    hashtag,
                    views
                ] = results;
    
                if (timeline && hashtag && views) {
                    const { data: dTimeline, highlight: hTimeline } = timeline;
                    const { data: dHashtags, highlight: hHashtags } = hashtag;
                    const { data: dViews, highlight: hViews } = views;
    
                    setData({ timelineData: timeline.data, hashtagData: hashtag.data, viewsData: views.data });
                    setAccordionData({ createDate: timeline.highlight, topHashtag: hashtag.highlight, averageViewers: views.highlight ?? 0 });
                }
            };

            fetchData();
        }
    }, [user]);

    // these two useEffects are for the purpose of rendering the data a second time,
    // updating them and preventing an undefined
    useEffect(() => {
        console.log('data updated: ', data);
    }, [data]);

    useEffect(() => {
        console.log('accordion data updated: ', accordionData);
    }, [accordionData])

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (videoRef.current) {
                        videoRef.current.currentTime = 0; // Reset video to start
                        if (globalAutoplay) {
                            playVideo();
                        }
                    }
                } else {
                    pauseVideo();
                }
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [globalAutoplay]);

    const playVideo = async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Autoplay failed:', error);
            }
        }
    };

    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleVideoPress = () => {
        if (!globalAutoplay) {
            setGlobalAutoplay(true);
        }
        
        if (isPlaying) {
            pauseVideo();
        } else {
            playVideo();
        }
    };

    const handleCaptionPress = (e: React.MouseEvent<HTMLElement>) => {
        setIsExpanded(!isExpanded);
        e.stopPropagation();
    };

    return (
        <div className='h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory'>
            <div 
                className="snap-start h-screen flex items-center justify-center relative"
                onClick={handleVideoPress}
            >
                <video 
                    ref={videoRef}
                    src={user.media} 
                    className="w-full h-full object-cover" 
                    loop 
                    playsInline 
                />
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                            className="w-20 h-20 text-white opacity-50" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}
                <div className={`absolute bottom-12 left-0 ${isExpanded && 'bg-gradient-to-t from-black'}`}>
                    <div className="pb-3 pl-2 text-white">
                        <h2 className="text-lg font-bold">{user.display_name}</h2>
                        { isExpanded ? 
                            (<p
                                className="text-sm mt-1 pr-11 mr-3"
                                onClick={(e) => handleCaptionPress(e)}>
                                    {user.captions}
                            </p>) :
                            (<p
                                className="text-sm mt-1 pr-11 mr-3 line-clamp-2"
                                onClick={(e) => handleCaptionPress(e)}>
                                    {user.captions}
                            </p>)
                        }
                        <p className="text-xs mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                            {user.sound_used} - {user.display_name}
                        </p>
                    </div>
                </div>
                <ActionBar 
                    pfp={user.pfp}
                    interactions={interactions}
                    hasInvestigated={hasInvestigated}
                    setHasInvestigated={setHasInvestigated}
                    setIsVerifeyeOpen={setIsVerifeyeOpen}
                />
            </div>

            {!hasInvestigated && user.political && (
                <div className="snap-start h-screen">
                    <Interstitial
                        username={user.username}
                        displayName={user.display_name}
                        id={user.highlight_id}
                        pfp={user.pfp}
                        setIsVerifeyeOpen={setIsVerifeyeOpen}
                        setHasInvestigated={setHasInvestigated}
                        data={accordionData}
                        // onNext={() => {}}
                    />
                </div>
            )}
            
            {isVerifeyeOpen && data && data.timelineData && (
                <Verifeye
                    setIsVerifeyeOpen={setIsVerifeyeOpen}
                    data={data}
                    accordionData={accordionData}
                    username={user.username}
                    miniProfiles={miniProfiles}
                    lookalike={lookalikeData}
                />
            )}
        </div>
    );
};

export default Content;