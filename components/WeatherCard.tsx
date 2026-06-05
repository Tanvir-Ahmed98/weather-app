export default function WeatherCard({ title, value, sub }: { title: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-slate-400">{sub}</div> : null}
    </div>
  );
}
