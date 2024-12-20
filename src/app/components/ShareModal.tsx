import Image from 'next/image';

interface ShareModalProps {
    setShareModalOpen(bool: boolean): any
}

const ShareModal: React.FC<ShareModalProps> = ({ setShareModalOpen }) => {
    let maxSize = 9999;

    return(
        <div className="fixed bottom-0 inset-x-0 z-10 px-3 flex flex-col w-screen bg-white rounded-t-lg">
            <Header
                text='Share to'
                setModalOpen={setShareModalOpen}
            />
            <div className="grow text-black text-center flex flex-col">
                <div className="flex py-2 border-b">
                    <ShareButton
                        icon='/svgs/x.svg'
                        text='Add to Story'
                        bgColor='bg-gray-500'
                    />
                    <ShareButton
                        icon='/svgs/x.svg'
                        text='username'
                        bgColor='bg-gray-500'
                    />
                    <ShareButton
                        icon='/svgs/more.svg'
                        text='More'
                        bgColor='bg-gray-300'
                    />
                    <ShareButton
                        icon='/svgs/invite.svg'
                        text='Invite friends to chat'
                        bgColor='bg-invite'
                        size={22}
                    />
                </div>

                <div className="flex py-2">
                    <ShareButton
                        icon='/svgs/repost.svg'
                        text='Add to Story'
                        bgColor='bg-repost'
                        size={22}
                    />
                    <ShareButton
                        icon='/svgs/link.svg'
                        text='Add to Story'
                        bgColor='bg-link'
                        size={20}
                    />
                    <ShareButton
                        icon='/svgs/messenger.svg'
                        text='Messenger'
                        border='border'
                        size={32}
                    />
                    <ShareButton
                        icon='/svgs/facebook.svg'
                        text='Facebook'
                        size={maxSize}
                    />
                    <ShareButton
                        icon='/images/instagram.png'
                        text='Instagram'
                        size={maxSize}
                    />
                    <ShareButton
                        icon='/images/instagram-stories.png'
                        text='Stories'
                        size={maxSize}
                    />
                </div>

                <div className="flex py-2">
                    <ShareButton
                        icon='/svgs/flag.svg'
                        text='Report'
                        bgColor='bg-gray-300'
                    />
                    <ShareButton
                        icon='/svgs/download.svg'
                        text='Save video'
                        bgColor='bg-gray-300'
                    />
                    <ShareButton
                        icon='/svgs/caption.svg'
                        text='Captions'
                        bgColor='bg-gray-300'
                        size={20}
                    />
                    <ShareButton
                        icon='/svgs/fire.svg'
                        text='Promote'
                        bgColor='bg-gray-300'
                    />
                    <ShareButton
                        icon='/svgs/duet.svg'
                        text='Duet'
                        bgColor='bg-gray-300'
                        size={22}
                    />
                    <ShareButton
                        icon='/svgs/stitch.svg'
                        text='Stitch'
                        bgColor='bg-gray-300'
                    />
                </div>
            </div>
        </div>
    )
}

interface ShareButtonProps {
    icon: string;
    text: string;
    bgColor?: string;
    size?: number;
    border?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ icon, text, bgColor, size = 18, border }) => {
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

export default ShareModal;