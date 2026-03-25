import { Link } from 'react-router-dom';

const Hero = ({ onHelp }) => (
    <div className="bg-blue-600 text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 drop-shadow-md">
                Connecting Help to <span className="text-blue-200">Those in Need</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
                A transparent, AI-driven platform ensuring disaster relief reaches the right people instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={onHelp} className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl">Get Help Now</button>
                <Link to="/register" className="bg-blue-700/50 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-blue-700/70 transition-all">Volunteer Join</Link>
            </div>
        </div>
    </div>
);

export default Hero;
