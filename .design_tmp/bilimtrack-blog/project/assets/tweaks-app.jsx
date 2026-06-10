// Bilimtrack blog — Tweaks app.
// Drives the CSS custom properties that blog.css / article.css already read.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#155dfc",
  "columns": "3",
  "radius": "Скруглённые"
}/*EDITMODE-END*/;

const RADIUS_MAP = {
  "Острые":      { card: "6px",  lg: "10px" },
  "Скруглённые": { card: "16px", lg: "24px" },
  "Мягкие":      { card: "22px", lg: "30px" },
};

function BlogTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--blog-accent", t.accent);
    root.setProperty("--blog-accent-hover", `color-mix(in srgb, ${t.accent} 78%, white)`);
    root.setProperty("--blog-accent-subtle", `color-mix(in srgb, ${t.accent} 9%, white)`);
    root.setProperty("--blog-cols", t.columns);
    const r = RADIUS_MAP[t.radius] || RADIUS_MAP["Скруглённые"];
    root.setProperty("--blog-radius", r.card);
    root.setProperty("--blog-radius-lg", r.lg);
  }, [t.accent, t.columns, t.radius]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Оформление" />
      <TweakColor label="Акцент" value={t.accent}
        options={["#155dfc", "#00a63e", "#ad46ff", "#ff8904"]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakRadio label="Колонки" value={t.columns}
        options={["2", "3", "4"]}
        onChange={(v) => setTweak("columns", v)} />
      <TweakRadio label="Скругление" value={t.radius}
        options={["Острые", "Скруглённые", "Мягкие"]}
        onChange={(v) => setTweak("radius", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<BlogTweaks />);
