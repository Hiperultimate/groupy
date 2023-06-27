import Image from "next/image";
import SvgUserIcon from "public/SvgUserIcon";

const DisplayUserImage = ({
  userImage,
  sizeOption,
  userStatus,
}: {
  userImage?: string | null;
  sizeOption: "big" | "medium" | "small";
  userStatus?: boolean;
}) => {
  const sizes = {
    big: "h-[104px] w-[104px]",
    medium: "h-[59px] w-[59px]",
    small: "h-[48px] w-[48px]",
  };

  const noImageIconSize = {
    big: 43,
    medium: 32,
    small: 24,
  };

  return (
    <div
      className={`relative flex ${sizes[sizeOption]} items-center justify-center rounded-full bg-[#d9d9d9] shadow-md`}
    >
      {userImage === undefined || userImage === null ? (
        <SvgUserIcon iconSize={noImageIconSize[sizeOption]} />
      ) : (
        <Image
          className="rounded-full"
          src={userImage}
          alt="User image"
          fill
          style={{ objectFit: "cover" }}
        />
      )}
      {userStatus !== undefined &&
        (userStatus ? (
          <span
            className={`absolute left-12 top-12 h-[11px] w-[11px] rounded-full bg-green-500 content-none`}
          />
        ) : (
          <span
            className={`absolute left-12 top-12 h-[11px] w-[11px] rounded-full bg-grey content-none`}
          />
        ))}
    </div>
  );
};

export default DisplayUserImage;
