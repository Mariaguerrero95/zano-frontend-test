import { motion } from "framer-motion";

export default function GettingStartedHero() {
    return (
        <motion.section
        className="page-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <p className="page-eyebrow">Begin your journey</p>

        <h1 className="page-hero-title">
            Your first steps into yoga
        </h1>

        <p className="page-hero-text">
            Learn the foundations of yoga, how to move with awareness,
            and how to build a calm daily practice.
        </p>
        </motion.section>
    );
}
