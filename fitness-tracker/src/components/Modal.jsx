export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-y-auto p-4">
            <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 pt-2 pr-5 text-red-600 hover:text-red-800 cursor-pointer"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}