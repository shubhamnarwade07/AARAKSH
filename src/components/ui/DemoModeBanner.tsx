export function DemoModeBanner() {
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
      style={{
        background: 'rgba(234,179,8,0.08)',
        border: '1px solid rgba(234,179,8,0.2)',
        color: '#ca8a04',
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
      <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
      <span className="text-amber-700/70 hidden sm:block">— All values are simulated. Not for operational use.</span>
    </div>
  );
}
