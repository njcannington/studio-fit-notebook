import { colors } from "@studio-fit/design-tokens";

export default function Home() {
  return (
    <main className="min-h-screen bg-iron-deep text-iron-stencil p-7">
      <h1 className="font-display text-7xl font-bold m-0 text-paper-cream leading-none [text-shadow:2px_2px_0_var(--color-rust-base)]">
        Studio Fit Notebook
      </h1>
      <p className="font-block uppercase tracking-[0.1em] text-sm text-ink-pencil-faded mt-3">
        Admin · Tokens & Fonts Smoke Test
      </p>

      <section className="mt-7">
        <SectionTitle>Typography roles</SectionTitle>

        <SampleRow label="display · Caveat" sampleClass="font-display text-5xl font-bold">
          Wednesday — April 27
        </SampleRow>
        <SampleRow label="block · Oswald" sampleClass="font-block uppercase tracking-[0.1em] text-lg font-semibold">
          Publish Program
        </SampleRow>
        <SampleRow label="pencil · Architects Daughter" sampleClass="font-pencil text-2xl">
          Back Squat — 3 sets of 5
        </SampleRow>
        <SampleRow label="pencil-mono · Special Elite" sampleClass="font-pencil-mono text-2xl">
          5  5  5  4  3
        </SampleRow>
      </section>

      <section className="mt-7">
        <SectionTitle>Color palette</SectionTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mt-4">
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
    <h2 className="font-block uppercase tracking-[0.1em] text-xs text-ink-pencil-faded m-0 pb-2 border-b border-iron-light">
      {children}
    </h2>
  );
}

function SampleRow({
  label,
  sampleClass,
  children,
}: {
  label: string;
  sampleClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-5 items-baseline py-3 border-b border-dashed border-iron-light">
      <span className="font-block uppercase tracking-[0.05em] text-[11px] text-ink-pencil-faded">
        {label}
      </span>
      <span className={`text-paper-cream ${sampleClass}`}>{children}</span>
    </div>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="bg-iron-base rounded-lg overflow-hidden border border-iron-light">
      <div className="h-20" style={{ background: hex }} />
      <div className="p-3 text-[13px]">
        <div className="font-mono text-paper-cream">{name}</div>
        <div className="font-mono text-ink-pencil-faded">{hex}</div>
      </div>
    </div>
  );
}
