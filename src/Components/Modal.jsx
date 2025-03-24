import '../Style/modal.scss';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    // Sustabdyti click įvykio plitimą, kad modalas neužsidarytų
    // paspaudus modale esančius elementus
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={stopPropagation}>
                {children}
                <button className="close-button" onClick={onClose}>×</button>
            </div>
        </div>
    );
}