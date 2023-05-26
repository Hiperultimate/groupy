import Image from "next/image";
import SvgUserIcon from "public/SvgUserIcon";

const DisplayUserImage = ({
  userImage,
  dimensionPx,
}: {
  userImage?: string | null;
  dimensionPx: number;
}) => {
  return (
    <div
      className={`relative flex h-[${dimensionPx}px] w-[${dimensionPx}px] items-center justify-center rounded-full bg-[#d9d9d9] shadow-md`}
    >
      {userImage === undefined || userImage === null ? (
        <SvgUserIcon />
      ) : (
        <Image
          className="rounded-full"
          src={userImage}
          alt="User image"
          width={`${dimensionPx}`}
          height={`${dimensionPx}`}
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default DisplayUserImage;
