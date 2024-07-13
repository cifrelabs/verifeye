import Image from 'next/image';

interface CommentsModalProps {
    count: number;
    setCommentsModalOpen(bool: boolean): any
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ count, setCommentsModalOpen }) => {
    return(
        <div className="fixed bottom-0 inset-x-0 z-10 px-3 flex flex-col h-3/5 w-screen bg-white rounded-t-lg">
            <Header
                text={`${formatCount(count)} comments`}
                setModalOpen={setCommentsModalOpen}
            />
            {count == 0 ? 
                <div className="grow content-center">
                    <p className='text-xs text-gray-400 text-center'>Be the first to comment on this video</p>
                </div>
                :
                <div>
                    <p className='text-red-600'>Not programmed yet</p>
                </div>
            }
            <div className='flex flex-row gap-2 items-center py-3 border-t'>
                <div className='flex justify-center items-center rounded-full bg-slate-400 size-10'>
                    <p>C</p>
                </div>
                <div className='content-center rounded-full bg-gray-200 h-11 w-full px-3'>
                    <p className='text-sm text-gray-500'>Add comment...</p>
                </div>
            </div>
        </div>
    )
}

interface CommentsModalButtonProps {
    icon: string;
    text: string;
    bgColor?: string;
    size?: number;
    border?: string;
}

const ShareButton: React.FC<CommentsModalButtonProps> = ({ icon, text, bgColor, size=18, border }) => {
    return(
        <div className='flex flex-col w-12 mr-4'>
            <button className={`flex overflow-hidden justify-center items-center rounded-full h-12 w-12 mb-1 ${ bgColor } ${ border }`}>
                <Image
                    src={icon}
                    alt="Share option"
                    width={size}
                    height={size}
                />
            </button>
            <p className='text-wrap text-xxs'>{ text }</p>
        </div>
    )
}

interface HeaderProps {
    text: string;
    setModalOpen(bool: boolean): any;
}

const Header: React.FC<HeaderProps> = ({ text, setModalOpen }) => {
    let iconSize = 18;

    return(
        <div className="h-fit py-2 grid grid-cols-8">
            <div className="col-start-2 col-end-8">
            <h1 className="text-black text-xs font-semibold text-center">{text}</h1>
            </div>
            <div className="flex col-span-1 justify-end items-center">
                <button onClick={() => {setModalOpen(false)}}>
                    <Image
                        src="/svgs/x.svg"
                        alt="close"
                        width={iconSize}
                        height={iconSize}
                    />
                </button>
            </div>
        </div>
    )
}

const formatCount = (count: number): string => {
    if(count == 0)
        return 'No';
    else
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default CommentsModal;