import Hero from "../../components/Hero.jsx";
import Explore from "../../components/Explore.jsx";
import Stories from "../../components/Stories.jsx";
import CommunityJoin from "../../components/CommunityJoin.jsx";
import Navbar from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Explore />
      <Stories />
      <CommunityJoin />
      <Footer />
    </>

  );
}
