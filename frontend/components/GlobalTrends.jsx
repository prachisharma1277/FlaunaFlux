export default function GlobalTrends() {
  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Global Trends Overview
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Mammal Populations (Global)</h3>
          <img
            src="https://quickchart.io/chart?c={type:'line',data:{labels:['2000','2005','2010','2015','2020'],datasets:[{label:'Monkeys',data:[100,90,75,65,55]},{label:'Elephants',data:[100,85,70,60,50]}]}}"
            alt="Trend Chart"
            className="w-full rounded-md"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Marine Life Trends (Coral Reefs)
          </h3>
          <img
            src="https://quickchart.io/chart?c={type:'line',data:{labels:['2000','2005','2010','2015','2020'],datasets:[{label:'Fish Biomass',data:[100,90,95,85,88]}]}}"
            alt="Trend Chart"
            className="w-full rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
