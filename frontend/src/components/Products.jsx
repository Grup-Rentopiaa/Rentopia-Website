
import { ChevronRight } from "lucide-react";
import { POPULAR_PRODUCTS } from "../constants/landingData";
import Card from "./Card";

export default function Products() {
  return (
    <section id="produk" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Sedang Tren Disewa
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pilihan produk favorit pengguna minggu ini dengan harga terbaik.
            </p>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
          >
            Lihat semua{" "}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Factory Pattern: setiap produk di-render oleh ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_PRODUCTS.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}