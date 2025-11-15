import image from "../assets/images/Sign1.png";

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[50vh] overflow-hidden flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`, // ✅ wrapped inside url()
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text */}
      <h1 className="relative text-4xl md:text-5xl font-bold text-white text-center z-10 drop-shadow-lg">
        Wildlife Population Trends
      </h1>
    </section>
  );
}