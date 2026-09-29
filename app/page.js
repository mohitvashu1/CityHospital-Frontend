import ContactStrip from "./component/ContactStrip";
import Doctors from "./component/Doctors";
import GoogleReviews from "./component/GoogleReviews";
import Hero from "./component/Hero";
import HospitalTicker from "./component/HospitalTicker";
import MedicalServices from "./component/MedicalServices";
import QuickInfo from "./component/QuickInfo";


export default function Home() {
  return (
     <main>
      <HospitalTicker/>
      <Hero />
      <Doctors/>
      <MedicalServices/>
      <QuickInfo/>
      <GoogleReviews/>
      <ContactStrip/>
      

    </main>
  );
}