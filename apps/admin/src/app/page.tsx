import { colors, typography, spacing } from "@studio-fit/design-tokens";

export default function Home() {
  return (
    <main
      style={{
        background: colors.iron.deep,
        color: colors.iron.stencil,
        minHeight: "100vh",
        padding: spacing[7],
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: typography.displayLg.fontSize, margin: 0 }}>
        @studio-fit/admin
      </h1>
      <p style={{ color: colors.ink.pencilFaded, marginTop: spacing[2] }}>
        Tokens import is live. Smoke test only — real admin comes later.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: spacing[3],
          marginTop: spacing[6],
        }}
      >
        {Object.entries(colors.paper).map(([name, hex]) => (
          <Swatch key={`paper-${name}`} name={`paper.${name}`} hex={hex} />
        ))}
        {Object.entries(colors.ink).map(([name, hex]) => (
          <Swatch key={`ink-${name}`} name={`ink.${name}`} hex={hex} />
        ))}
        {Object.entries(colors.rust).map(([name, hex]) => (
          <Swatch key={`rust-${name}`} name={`rust.${name}`} hex={hex} />
        ))}
      </div>
    </main>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div
      style={{
        background: colors.iron.base,
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid ${colors.iron.light}`,
      }}
    >
      <div style={{ background: hex, height: 80 }} />
      <div style={{ padding: spacing[3], fontSize: 13 }}>
        <div style={{ fontFamily: "monospace", color: colors.paper.cream }}>
          {name}
        </div>
        <div style={{ fontFamily: "monospace", color: colors.ink.pencilFaded }}>
          {hex}
        </div>
      </div>
    </div>
  );
}
