import { motion, AnimatePresence } from "framer-motion";

const FadeInOut = ({
  displayState,
  children,
}: {
  displayState: boolean;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {displayState && (
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeInOut;
