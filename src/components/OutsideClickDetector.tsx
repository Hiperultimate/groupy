import React, { useRef, useEffect, type ReactNode, useCallback } from 'react';

interface OutsideClickDetectorProps {
  children: ReactNode;
  onOutsideClick: () => void;
}

const OutsideClickDetector: React.FC<OutsideClickDetectorProps> = ({ children, onOutsideClick }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      // Clicked outside the component
      onOutsideClick();
    }
  }, [onOutsideClick]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleDocumentClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [handleClickOutside]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickDetector;