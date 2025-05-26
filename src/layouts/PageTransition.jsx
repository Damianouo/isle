import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";

const variants = {
  visible: { opacity: 1, position: "static" },
  hidden: { opacity: 0, position: "absolute" },
};

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        className="grid size-full max-w-[1100px] border p-2"
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        key={location.pathname}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
