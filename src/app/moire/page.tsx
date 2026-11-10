import MoireField from "@/moire-field/component";

export const metadata = { title: "Moiré Field — Hairline" };

export default function MoirePage() {
  return (
    <main className="wrap py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-[360px]">
        <MoireField />
      </div>
    </main>
  );
}

