import SvgUploadIcon from "public/SvgUploadIcon";
import InputErrorText from "./InputErrorText";
import { encodeImageToBase64 } from "~/common/imageConversion";
import imageValidation from "~/common/imageValidation";

/**
 * Create these states to import it to the component.
 *  
 * const [userImage, setUserImage] = useState<string | undefined>(); 
 * const [userImageFile, setUserImageFile] = useState<File | null>(null);
 * const [userImageError, setUserImageError] = useState<string[]>([]);
 */
const StyledImageInput = ({
  title,
  setUserImage,
  setUserImageFile,
  setUserImageError,
  userImageError,
}: {
  title?: string;
  setUserImageError: React.Dispatch<React.SetStateAction<string[]>>;
  setUserImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setUserImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  userImageError: string[];
}) => {

  // IMPORTANT NOTE: Dragging images and file select images to upload are two different functions.
  //                 Using this function to keep same logic at both areas.
  const imageErrorSetter = (file: File) => {
    const promise = encodeImageToBase64(file);
    promise
      .then((base64String) => {
        const imageUploadError: string[] = imageValidation(file);
        setUserImageError(imageUploadError);
        if (imageUploadError.length === 0) {
          setUserImage(base64String);
          setUserImageFile(file);
        }
      })
      .catch((error) => {
        console.log("Error occured : ", error);
      });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setUserImageError([]);
    const file = e.dataTransfer.files[0];
    if (file) {
      imageErrorSetter(file);
    } else {
      console.log("Error occured while loading file");
    }
  };

  return (
    <div className="flex flex-col">
      {title && <span>{title}</span>}
      {/* Handle file submit with on drag and imageUpload to update state to a single useState */}
      <input
        className="hidden"
        type="file"
        id="imageUpload"
        onChange={(e) => {
          e.preventDefault();
          setUserImageError([]);
          const file = e.target.files ? e.target.files[0] : undefined;
          if (file) {
            imageErrorSetter(file);
          } else {
            console.log("Error occured while loading file");
          }
        }}
      />
      <label
        htmlFor="imageUpload"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="my-1 flex h-60 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8"
      >
        <span className="flex flex-col items-center text-grey">
          <SvgUploadIcon dimension={50} />
          <span>
            Drag and drop an image, or{" "}
            <span className="text-orange">Browse</span>
          </span>
          <span className="text-[#cad0d9]">
            High resolution images (png, jpg)
          </span>
        </span>
      </label>
      <InputErrorText errorArray={userImageError} />
    </div>
  );
};

export default StyledImageInput;
