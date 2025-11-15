import image from "../../assets/images/Pop3.png";

// This component now receives its props from PopulationMetricsPage
export default function Overview({ selectedRegion, regions, setSelectedRegion }) {
  return (
    <section
      className="relative w-full h-[70vh] flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${image})`,
        marginTop: "0.5 rem",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Wildlife Population Trends
        </h1>
        <p className="text-gray-200 mb-8 text-sm md:text-base max-w-2xl mx-auto">
          Explore regional wildlife data — select a region to discover population and habitat trends.
        </p>

        {/* 🔍 Search Dropdown */}
        <div className="flex justify-center">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-white w-[90%] md:w-[400px] p-3 rounded-full border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
          >
            {/* THE FIX: Add a '?' before .map() 
              This prevents a crash if 'regions' is ever undefined.
            */}
            {regions?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-200 mt-4 italic">
          Currently showing data for:{" "}
          <span className="font-semibold text-white">{selectedRegion}</span>
        </p>
      </div>
    </section>
  );
}