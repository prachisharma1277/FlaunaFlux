const stats = [
  { label: "Species Tracked", value: "1,200+" },
  { label: "Countries Covered", value: "80+" },
  { label: "Avg Growth Rate", value: "+3.4%" },
  { label: "Threatened Species", value: "320" },
];

export default function StatsSummary() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-2xl font-bold text-green-700">{s.value}</h3>
          <p className="text-sm text-gray-600 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
