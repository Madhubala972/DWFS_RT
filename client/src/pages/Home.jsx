import { useState } from 'react';
import UrgentNeedsModal from '../components/UrgentNeedsModal';
import Hero from '../components/home/Hero';
import EmergencyBar from '../components/home/EmergencyBar';
import AboutSection from '../components/home/AboutSection';
import RequestHelpModal from '../components/request/RequestHelpModal';

const Home = () => {
    const [helpOpen, setHelpOpen] = useState(false);

    return (
        <div className="min-h-screen bg-light">
            <UrgentNeedsModal />
            <RequestHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
            <Hero onHelp={() => setHelpOpen(true)} />
            <EmergencyBar />
            <AboutSection />
        </div>
    );
};

export default Home;
