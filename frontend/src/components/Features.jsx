
export default function Features({ advantages }) {
  return (
    <section id="keunggulan" className="bg-white py-20 lg:py-28">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-16">
          Kenapa Harus Rentopia?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-blue-100"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <span className="text-3xl">{item.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
