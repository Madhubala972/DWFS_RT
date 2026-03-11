import { FaShieldAlt } from 'react-icons/fa';

const AuditHeader = () => (
    <div className="bg-blue-600 text-white py-12 mb-10">
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaShieldAlt className="text-blue-200" /> Transparent <span className="text-blue-200">Audit Trails</span>
            </h1>
            <p className="text-blue-100 mt-2">Full governance logs for system decisions and activity.</p>
        </div>
    </div>
);

export default AuditHeader;
