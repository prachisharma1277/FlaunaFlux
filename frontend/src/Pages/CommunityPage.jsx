import Navbar from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Community from '../components/Community.jsx';

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <Community />
      <Footer />
    </main>
  );
}