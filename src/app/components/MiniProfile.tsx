interface MiniProfileProps {
    image: string;
    displayName: string;
    username: string;
    interaction: string;
    site?: string;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ image, displayName, username, interaction, site }) => {
    return (
        <div className='flex flex-col w-fit items-center'>
            <img src={image} alt="profile picture" className='size-16 rounded-full border-2 mb-2'/>
            <div className = "text-center text-xs"> 
                <p className='text-sm font-semibold'>{ displayName }</p>
                {username != "" && <p className='font-medium'>@{ username }</p>}
                <p>{ interaction }</p>
                {site && <p className="text-xxs">{ site }</p>}
            </div>
        </div>
    )
}

export default MiniProfile;