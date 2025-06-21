import { AnimatePresence, motion } from "motion/react";
import { useLocation, useMatches } from "react-router";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

function PageTransition() {
  const location = useLocation();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const ComponentToRender = currentMatch?.handle?.Component;
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        className="grid size-full max-w-[1200px] p-4 sm:px-8"
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        key={location.pathname}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ComponentToRender loaderData={currentMatch.data} />
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
