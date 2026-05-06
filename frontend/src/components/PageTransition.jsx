import { motion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => (
  <motion.main
    animate={{ opacity: 1, y: 0 }}
    className={className}
    exit={{ opacity: 0, y: 18 }}
    initial={{ opacity: 0, y: 18 }}
    transition={{ duration: 0.32, ease: "easeOut" }}
  >
    {children}
  </motion.main>
);

export default PageTransition;
