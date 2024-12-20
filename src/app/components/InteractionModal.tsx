import Image from 'next/image';

interface InteractionModalProps {
    modalText: string[];
    setIsVerifeyeOpen: ((bool: boolean) => void) | null;
    setIsInteractionModalOpen: ((bool: boolean) => void);
    setActionState(bool: boolean): any;
    setHasInvestigated: ((bool: boolean) => void) | null;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ 
    modalText, 
    setIsVerifeyeOpen, 
    setIsInteractionModalOpen,
    setActionState, 
    setHasInvestigated
}) => {
    const closeVerifeyeModal = () => {
        setHasInvestigated && setHasInvestigated(true);
        setIsInteractionModalOpen(false);
        setIsVerifeyeOpen && setIsVerifeyeOpen(true)
    }

    return (
        <div
            className="fixed -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 z-10 p-3 flex flex-col w-80 bg-white rounded-lg">
            <Header
                setIsVerifeyeOpen={setIsVerifeyeOpen}
            />
            <div className="grow text-black text-center flex flex-col gap-3 mb-3">
                <h1 className='text-xl font-bold leading-6 text-pretty'>{modalText[0]}</h1>
                <p className='text-xs text-balance'>We found information about the account you may find relevant. Review the account before interacting to keep our community authentic.</p>
            </div>
            <div className='flex flex-col w-full items-center gap-1'>
                <button className='w-60 bg-tiktok-red rounded-lg' onClick={closeVerifeyeModal}>
                    <p className="font-medium text-sm tracking-wide py-2">Check details</p>
                </button>

                <button
                    className='w-60 rounded-lg'
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                        setIsInteractionModalOpen(false);
                        setActionState(true);
                        e.stopPropagation();
                    }}
                >
                    <p className="font-medium text-sm tracking-wide text-red-600 py-2">{modalText[1]}</p>
                </button>
            </div>
        </div>
    )
}

interface HeaderProps {
    setIsVerifeyeOpen: ((bool: boolean) => void)| null;
}

const Header: React.FC<HeaderProps> = ({ setIsVerifeyeOpen }) => {
    let iconSize = 18;
    
    return(
        <div className="flex justify-end items-center">
            <button onClick={(e: React.MouseEvent<HTMLElement>) => {
                setIsVerifeyeOpen && setIsVerifeyeOpen(false);
                e.stopPropagation();}}
            >
                <Image
                    src="/svgs/x.svg"
                    alt="close"
                    width={iconSize}
                    height={iconSize}
                />
            </button>
        </div>
    )
}

export default InteractionModal;