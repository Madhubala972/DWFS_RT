import { FaRobot } from 'react-icons/fa';

const AIHeader = () => (
    <div className="bg-blue-600 text-white py-12 mb-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                <FaRobot className="text-blue-200" /> AI Strategy & <span className="text-blue-200">Performance</span>
            </h1>
            <p className="text-blue-100 mt-3 max-w-2xl mx-auto italic">
                Metrics and notes for our AI-driven response system.
            </p>
        </div>
    </div>
);

export default AIHeader;
