
import { PackageSearch, CalendarDays, CreditCard } from "lucide-react";

const ICON_MAP = {
  PackageSearch: <PackageSearch className="h-10 w-10" />,
  CalendarDays:  <CalendarDays className="h-10 w-10" />,
  CreditCard:    <CreditCard className="h-10 w-10" />,
};

export default function Steps({ steps }) {
  return (
    <section id="cara-kerja" className="bg-white py-20 lg:py-28">
      <div className="mx-auto w-full max-w-screen-xl px-6 md:px-12 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Cara Kerja Rentopia
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Tiga langkah mudah untuk mulai meminjam barang impianmu tanpa proses yang
          membingungkan.
        </p>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 relative">
          {/* Garis penghubung antar step */}
          <div className="hidden sm:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10 w-[68%]"></div>

          {steps.map((step) => (
            <div key={step.id} className="group flex flex-col items-center bg-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
                {ICON_MAP[step.icon]}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600 text-sm px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}