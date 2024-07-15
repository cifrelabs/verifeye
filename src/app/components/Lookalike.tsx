import { useState, useEffect } from "react";
import React from "react";
import { getSimilarUsernames } from "@/utils/supabase";

// interface LookalikeProps {
//     username: string;
// }

// Using supabase query:
// const Lookalike: React.FC<LookalikeProps> = ({username}) => {
//     const [similarUsernames, setSimilarUsernames] = useState<string[]>([])

//     useEffect(() => {
//         const fetchSimilarUsernames = async () => {
//             try {
//                 const usernames = await getSimilarUsernames(username);
//                 setSimilarUsernames(usernames);
//             } catch (error) {
//                 console.error("error fetching similar usernames: ", error);
//             }
//         };

//         fetchSimilarUsernames();
//     }, [username]);

//     return(
//         <div>
//             <p className="text-sm text-black">
//                 A different TikTok account with a similar username exists
//             </p>
//             {/* TODO: DISPLAY SIMILAR ACCOUNTS */}
//         </div>
//     );
// }

const Lookalike: React.FC = () => {
    return (
        <div className="text-black flex flex-row justify-center mt-4">
            <div className="flex flex-col mx-4 items-center">
                <img src="" alt="image" className="w-24 h-24 rounded-full mb-4"/>
                <p className="font-semibold">Display name 1</p>
                <p className="font-medium text-sm mt-2">@username</p>
                <div className="flex flex-row justify-center mt-2">
                    <p className="me-2 text-xs">0 followers</p>
                    <p className="text-xs">0 videos</p>
                </div>
            </div>
            <div className="flex flex-col mx-4 items-center">
                <img src="" alt="image" className="w-24 h-24 rounded-full mb-4"/>
                <p className="font-semibold">Display name 1</p>
                <p className="font-medium text-sm mt-2">@username</p>
                <div className="flex flex-row justify-center mt-2">
                    <p className="me-2 text-xs">0 followers</p>
                    <p className="text-xs">0 videos</p>
                </div>
            </div>
        </div>
    );
}

export default Lookalike;