export default function FiltersPanel() {
  return (
    <aside className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">
      <h2 className="font-semibold text-lg text-green-700 mb-4">Filters</h2>

      {[
        { label: "Species", options: ["Tiger", "Elephant", "Panda", "Coral Reefs"] },
        { label: "Region", options: ["Asia", "Africa", "Arctic", "Amazon"] },
        { label: "Time Frame", options: ["2000–2020", "2010–2025", "Past Decade"] },
        { label: "Data Source", options: ["WWF", "UNEP", "IUCN", "NASA EcoTrack"] },
      ].map(({ label, options }) => (
        <div key={label}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <select className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-gray-800">
            <option>Select {label}</option>
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}

      <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
        Apply Filters
      </button>
    </aside>
  );
}
