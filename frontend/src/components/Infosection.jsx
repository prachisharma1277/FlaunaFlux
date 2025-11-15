export default function InfoSection() {
  const info = [
    {
      title: "Declining Wildlife Populations",
      desc: "Global wildlife populations have declined by over 60% since 1970, primarily due to habitat loss, poaching, and climate change. Conservation efforts are now focusing on biodiversity hotspots to slow this decline.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
      title: "Species Recovery Efforts",
      desc: "Thanks to global conservation programs, certain species like tigers and whales are making a comeback. Data-driven monitoring and AI-assisted protection are leading the way in modern conservation.",
      img: "https://images.unsplash.com/photo-1599058917212-d750089bc07c",
    },
  ];

  return (
    <section className="py-16 px-8 bg-green-50">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
        Insights on Global Wildlife
      </h2>
      <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {info.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img src={item.img} alt={item.title} className="w-full h-56 object-cover" />
            <div className="p-6 text-left">
              <h3 className="text-xl font-semibold text-green-700 mb-2">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
