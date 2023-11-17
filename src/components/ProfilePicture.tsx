import Image from 'next/image';

interface ProfilePictureProps {
    src: string;
    alt: string;
}

const ProfilePicture = ({ src, alt }: ProfilePictureProps) => (
    <div className="relative shrink-0">
        <Image src={src} alt={alt} width={100} height={100} className="rounded-full" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm">사진 변경</span>
        </div>
    </div>
);

export { ProfilePicture };