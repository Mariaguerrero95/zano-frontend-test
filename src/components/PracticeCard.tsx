import { motion } from "framer-motion";

type PracticeCardProps = {
    title: string;
    text: string;
    onClick?: () => void;
};

export default function PracticeCard({
    title,
    text,
    onClick,
    }: PracticeCardProps) {
    return (
        <motion.div
        className="practice-card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        >
        <h3>{title}</h3>
        <p>{text}</p>
        </motion.div>
    );
}
