import { useEffect, useRef } from "react";

const useDebouncer = ({
  inputState,
  durationMS,
  triggerFn,
  triggerCondition = true,
}: {
  inputState: string;
  durationMS: number;
  triggerFn: () => void;
  triggerCondition?: boolean;
}) => {
  const timerRef = useRef<null | NodeJS.Timeout>(null);
  const timeoutFn = () => {
    return setTimeout(() => {
      triggerFn();
    }, durationMS);
  };

  // Get raw users without search , Get users with search
  useEffect(() => {
    if (triggerCondition) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = timeoutFn();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputState]);
};

export default useDebouncer;
