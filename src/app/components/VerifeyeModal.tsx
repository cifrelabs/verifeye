import Image from 'next/image';

interface VerifeyeModalProps {
    setModalOpen(bool: boolean): any
}

export const VerifeyeModal: React.FC<VerifeyeModalProps> = ({ setModalOpen }) => {
    let iconSize = 18;
    let maxSize = 9999;

    return(
        <div className="fixed bottom-0 inset-x-0 z-10 px-3 flex flex-col w-screen bg-white rounded-t-lg">
            <div className="h-fit py-2 grid grid-cols-8">
                <div className="col-start-2 col-end-8">
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
            <div className="grow text-black text-center flex flex-col">
                
            </div>
        </div>
    )
}

export default VerifeyeModal;