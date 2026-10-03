export default function SuccessModal({ open, title, message, onClose }) {
    if (!open) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <button className="modal-x" type="button" onClick={onClose}>
                    ×
                </button>
                <div className="success-circle">✓</div>
                <h3>{title}</h3>
                <p>{message}</p>
                <button className="btn btn-primary" type="button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}