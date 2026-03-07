const EmergencyBar = () => (
    <div className="bg-red-600 text-white py-4 shadow-md text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-2 md:mb-0">🚨 EMERGENCY HELPLINE: 112</div>
            <div className="flex space-x-6 font-semibold">
                <a href="tel:108" className="hover:underline">Ambulance: 108</a>
                <a href="tel:100" className="hover:underline">Police: 100</a>
                <a href="tel:101" className="hover:underline">Fire: 101</a>
            </div>
        </div>
    </div>
);

export default EmergencyBar;
