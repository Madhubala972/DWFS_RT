import UrgentNeedsModal from '../components/UrgentNeedsModal';
import Hero from '../components/home/Hero';
import EmergencyBar from '../components/home/EmergencyBar';
import AboutSection from '../components/home/AboutSection';

const Home = () => {
    return (
        <div className="min-h-screen bg-light">
            <UrgentNeedsModal />
            <Hero />
            <EmergencyBar />
            <AboutSection />
        </div>
    );
};

export default Home;
