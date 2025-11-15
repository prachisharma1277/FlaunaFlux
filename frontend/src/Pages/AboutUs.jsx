import Navbar from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import About from '../components/About_comp/About.jsx';
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <About />
      <Footer />
    </main>
  );
}
