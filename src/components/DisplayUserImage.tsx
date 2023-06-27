import Image from "next/image";
import SvgUserIcon from "public/SvgUserIcon";

const DisplayUserImage = ({
  userImage,
  dimentionPx,
}: {
  userImage?: string | null;
  dimentionPx: number;
}) => {
  return (
    <div
      className={`relative flex h-[${dimentionPx}px] w-[${dimentionPx}px] items-center justify-center rounded-full bg-[#d9d9d9] shadow-md`}
    >
      {userImage === undefined || userImage === null ? (
        <SvgUserIcon />
      ) : (
        <Image
          className="rounded-full"
          src={userImage}
          alt="User image"
          width={`${dimentionPx}`}
          height={`${dimentionPx}`}
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default DisplayUserImage;
