import ContentSection from "@/components/landingPage/contentSection";
import Footer from "@/components/landingPage/Footer";
import Hero from "@/components/landingPage/Hero";
import OnWorkingProcessSection from "@/components/landingPage/OnWorkingProcessSection";
import LandingPageNavbar from "@/components/sidebar/LandingPageNavbar";

const Home = async () => {
  return (
    <>
      <LandingPageNavbar />
      <Hero />
      <div className="p-4">
        <ContentSection />
        <OnWorkingProcessSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;
