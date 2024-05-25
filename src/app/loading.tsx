import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen bg-black" >
            <Image
                src="images/verifeye.png"
                alt="Vercel Logo"
                width={200}
                height={200}
                priority
            />
        </div>
    );
};