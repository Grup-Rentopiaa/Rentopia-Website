
import { Users, Star, ShieldCheck, Clock } from "lucide-react";

const ICON_MAP = {
  Users:       <Users className="h-8 w-8 text-blue-600 mb-2" />,
  Star:        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400 mb-2" />,
  ShieldCheck: <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />,
  Clock:       <Clock className="h-8 w-8 text-indigo-500 mb-2" />,
};

export default function Trust({ stats }) {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-slate-200">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center text-center">
              {ICON_MAP[stat.icon]}
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}