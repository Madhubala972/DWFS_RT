import { FaCheck, FaTruck, FaBoxOpen, FaClipboardCheck, FaMapMarkerAlt } from 'react-icons/fa';

const DeliveryTracker = ({ status }) => {
    const steps = [
        { label: 'Pending', status: ['Pending', 'Verified'], icon: <FaClipboardCheck /> },
        { label: 'Approved', status: ['Approved'], icon: <FaCheck /> },
        { label: 'Assigned', status: ['Assigned'], icon: <FaTruck /> },
        { label: 'Delivered', status: ['Delivered'], icon: <FaMapMarkerAlt /> },
    ];

    const getCurrentStepIndex = () => {
        if (['Pending', 'Verified'].includes(status)) return 0;
        if (status === 'Approved') return 1;
        if (status === 'Assigned') return 2;
        if (status === 'Delivered') return 3;
        return -1; // Unknown or Cancelled/Rejected
    };

    const activeStep = getCurrentStepIndex();

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>

                {/* Progress Bar Active */}
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 rounded transition-all duration-500 ease-in-out"
                    style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isActive = index <= activeStep;
                    const isCompleted = index < activeStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                ${isActive
                                        ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                        : 'bg-white border-gray-300 text-gray-400'}`}
                            >
                                {isCompleted ? <FaCheck className="text-[10px] md:text-xs" /> : <span className="text-[10px] md:text-xs">{step.icon}</span>}
                            </div>
                            <span
                                className={`text-[10px] md:text-xs mt-2 font-medium uppercase tracking-wide
                                ${isActive ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeliveryTracker;
