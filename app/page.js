import Doctors from "./component/Doctors";
import Hero from "./component/Hero";
import MedicalServices from "./component/MedicalServices";


export default function Home() {
  return (
     <main>
      <Hero />
      <Doctors/>
      <MedicalServices />
      

    </main>
  );
}