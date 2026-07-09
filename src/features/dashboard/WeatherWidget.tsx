export function WeatherWidget() {
  return (
    <div className="glass-strong rounded-2xl p-3 sm:p-4 w-[140px] sm:w-[160px]">
      <div className="text-xs sm:text-sm tracking-[0.3em] panel-label font-display font-semibold mb-2">
        WEATHER
      </div>
      <div className="font-display text-3xl sm:text-4xl font-black text-foreground text-glow-accent">
        26°
      </div>
      <div className="text-sm panel-muted font-medium mt-1">Feels 28° · Clear</div>
      <div className="flex justify-between text-sm panel-muted font-medium mt-2">
        <span>
          Wind <span className="text-foreground font-bold">12</span>
        </span>
        <span>
          Rain <span className="text-foreground font-bold">0%</span>
        </span>
      </div>
    </div>
  );
}
