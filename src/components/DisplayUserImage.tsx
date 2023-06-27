import Image from "next/image";
import SvgUserIcon from "public/SvgUserIcon";

const DisplayUserImage = ({
  userImage,
  sizeOption,
}: {
  userImage?: string | null;
  sizeOption: "big" | "medium" | "small";
}) => {
  const sizes = {
    big : "h-[104px] w-[104px]",
    medium: "h-[59px] w-[59px]",
    small: "h-[48px] w-[48px]",
  }

  return (
    <div
      className={`relative flex ${sizes[sizeOption]} items-center justify-center rounded-full bg-[#d9d9d9] shadow-md`}
    >
      {userImage === undefined || userImage === null ? (
        <SvgUserIcon />
      ) : (
        <Image
          className="rounded-full"
          src={userImage}
          alt="User image"
          fill
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default DisplayUserImage;
