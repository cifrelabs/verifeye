interface MiniProfileProps {
    image: string;
    displayName: string;
    username: string;
    interaction: string;
    site: string;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ image, displayName, username, interaction }) => {
    return (
        <div className='flex flex-col w-fit items-center'>
            <img src={image} alt="profile picture" className='size-16 rounded-full border-2 mb-3'/>
            <p className='text-xs font-semibold'>{ displayName }</p>
            <p className='text-xs font-semibold'>@{ username }</p>
            <p className='text-xs'>{ interaction }</p>
        </div>
    )
}

export default MiniProfile;