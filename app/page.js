
import ContactStrip from "./component/ContactStrip";
import Doctors from "./component/Doctors";
import GoogleReviews from "./component/GoogleReviews";
import Hero from "./component/Hero";
import HospitalTicker from "./component/HospitalTicker";
import Location from "./component/Location";
import MedicalServices from "./component/MedicalServices";
import QuickInfo from "./component/QuickInfo";

export default function Home() {
  return (
    <main>
      <HospitalTicker />

      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      <section id="doctors" className="scroll-mt-24">
        <Doctors />
      </section>

      <section id="medical-services" className="scroll-mt-24">
        <MedicalServices />
      </section>

     

      <section id="reviews" className="scroll-mt-24">
        <GoogleReviews />
      </section>
      <Location/>
        <QuickInfo />
      {/* <section id="contact" className="scroll-mt-24">
        <ContactStrip />
      </section> */}
    </main>
  );
}