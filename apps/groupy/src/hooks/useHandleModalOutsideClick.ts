import { RefObject, useEffect } from "react";
import { SetterOrUpdater } from "recoil";
import { DialogElement } from "~/components/CreatePostInput";

const useHandleModalOutsideClick = (
  modalRef: RefObject<DialogElement>,
  isModalOpen: boolean,
  setIsModalOpen: SetterOrUpdater<boolean>
) => {
  useEffect(() => {
    isModalOpen === true
      ? modalRef.current?.showModal()
      : modalRef.current?.close();
  }, [isModalOpen]);

  function outsideModalClickHandler(e: React.MouseEvent) {
    const dialogDimensions = modalRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      modalRef.current?.close();
      setIsModalOpen(false);
    }
  }

  return { outsideModalClickHandler };
};

export default useHandleModalOutsideClick;
