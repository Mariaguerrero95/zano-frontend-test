import "../styles/PopupDiscount.css";

type Props = {
    open: boolean;
    onClose: () => void;
};

function WelcomeModal({ open, onClose }: Props) {
    if (!open) return null;
    return (
        <div className="welcome-overlay">
        <div className="welcome-modal">
            <span className="welcome-icon">🧘‍♀️</span>
            <h2>Welcome to Asana Atlas</h2>
            <p>
            Start your yoga journey with calm and intention.
            Enjoy <strong>20% off</strong> your first practice.
            </p>
            <div className="welcome-code">FLOW20</div>
            <button onClick={onClose}>
            Start my practice
            </button>
        </div>
        </div>
    );
}

export default WelcomeModal;
