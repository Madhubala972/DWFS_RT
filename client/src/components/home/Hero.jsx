import { Link } from 'react-router-dom';

const Hero = () => (
    <div className="bg-blue-600 text-white py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                Connecting Help to <span className="text-blue-200">Those in Need</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
                A transparent, AI-driven platform ensuring disaster relief reaches the right people.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/request-help" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold">Get Help Now</Link>
                <Link to="/register" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold">Volunteer</Link>
            </div>
        </div>
    </div>
);

export default Hero;
