import { colors, spacing, typography } from "@studio-fit/design-tokens";

export default function Home() {
  return (
    <main
      style={{
        background: colors.iron.deep,
        color: colors.iron.stencil,
        minHeight: "100vh",
        padding: spacing[7],
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: typography.displayXl.fontSize,
          fontWeight: 700,
          margin: 0,
          color: colors.paper.cream,
          textShadow: `2px 2px 0 ${colors.rust.base}`,
          lineHeight: 1,
        }}
      >
        Studio Fit Notebook
      </h1>
      <p
        style={{
          fontFamily: "var(--font-block)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: 14,
          color: colors.ink.pencilFaded,
          marginTop: spacing[3],
        }}
      >
        Admin · Tokens & Fonts Smoke Test
      </p>

      <section style={{ marginTop: spacing[7] }}>
        <SectionTitle>Typography roles</SectionTitle>

        <SampleRow label="display · Caveat" fontFamily="var(--font-display)" size={48} weight={700}>
          Wednesday — April 27
        </SampleRow>
        <SampleRow label="block · Oswald" fontFamily="var(--font-block)" size={18} upper letterSpacing="0.1em" weight={600}>
          Publish Program
        </SampleRow>
        <SampleRow label="pencil · Architects Daughter" fontFamily="var(--font-pencil)" size={22}>
          Back Squat — 3 sets of 5
        </SampleRow>
        <SampleRow label="pencil-mono · Special Elite" fontFamily="var(--font-pencil-mono)" size={22}>
          5  5  5  4  3
        </SampleRow>
      </section>

      <section style={{ marginTop: spacing[7] }}>
        <SectionTitle>Color palette</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: spacing[3],
            marginTop: spacing[4],
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
      </section>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-block)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontSize: 12,
        color: colors.ink.pencilFaded,
        margin: 0,
        paddingBottom: spacing[2],
        borderBottom: `1px solid ${colors.iron.light}`,
      }}
    >
      {children}
    </h2>
  );
}

function SampleRow({
  label,
  fontFamily,
  size,
  weight,
  upper,
  letterSpacing,
  children,
}: {
  label: string;
  fontFamily: string;
  size: number;
  weight?: number;
  upper?: boolean;
  letterSpacing?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: spacing[5],
        alignItems: "baseline",
        padding: `${spacing[3]}px 0`,
        borderBottom: `1px dashed ${colors.iron.light}`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-block)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: 11,
          color: colors.ink.pencilFaded,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight,
          textTransform: upper ? "uppercase" : undefined,
          letterSpacing,
          color: colors.paper.cream,
        }}
      >
        {children}
      </span>
    </div>
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
