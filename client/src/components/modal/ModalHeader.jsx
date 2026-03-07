const ModalHeader = ({ title, role, onClose }) => (
    <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
        <div className="flex items-center">
            <span className="text-2xl mr-3">{role === 'admin' ? '📋' : '🚨'}</span>
            <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <button onClick={onClose} className="text-blue-100 hover:text-white transition">✕</button>
    </div>
);

export default ModalHeader;
