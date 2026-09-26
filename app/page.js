import Doctors from "./component/Doctors";
import Hero from "./component/Hero";
import MedicalServices from "./component/MedicalServices";
import QuickInfo from "./component/QuickInfo";


export default function Home() {
  return (
     <main>
      <Hero />
      <Doctors/>
      <MedicalServices/>
      <QuickInfo/>
      

    </main>
  );
}