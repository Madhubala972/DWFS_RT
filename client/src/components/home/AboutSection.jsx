import { Link } from 'react-router-dom';

const AboutSection = () => (
    <div className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">About the Platform</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                We bridge the gap between victims and relief. AI helps us prioritize.
            </p>
        </div>
        <div className="flex justify-center text-center text-sm">
            <div className="max-w-md w-full">
                <Link to="/track-delivery" className="p-6 border rounded-xl hover:shadow-lg transition block">
                    <span className="text-3xl">🚚</span>
                    <h3 className="text-lg font-bold mt-4">Track Delivery</h3>
                    <p className="text-gray-500 mt-2">Track aid from start to end.</p>
                </Link>
            </div>
        </div>
    </div>
);

export default AboutSection;
