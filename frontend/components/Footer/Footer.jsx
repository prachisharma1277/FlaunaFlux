export default function Footer() {
  return (
    <footer className="w-screen bg-gray-100 text-gray-800 py-8 border-t border-gray-300">
      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        <div>
          <h3 className="font-bold text-green-700 mb-2">FaunaFlux</h3>
          <p className="text-sm text-gray-600">
            Empowering conservation through data and community.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Discover</h4>
          <ul className="space-y-1 text-sm">
            <li>About Us</li>
            <li>Stories</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-sm">
            <li>Donate</li>
            <li>Events</li>
            <li>Communities</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Connect</h4>
          <ul className="space-y-1 text-sm">
            <li>Help Center</li>
            <li>Instagram / YouTube</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} FaunaFlux — Conservation for All 🌿
      </div>
    </footer>
  );
}
