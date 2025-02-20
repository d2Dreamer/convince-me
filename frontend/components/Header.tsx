import { WalletSelector } from "@/components/WalletSelector";

export function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
      <h1 className="display font-fruktur rounded-sm p-2 border-[2px]">CM</h1>

      <div className="flex gap-2 items-center flex-wrap  border-[2px] bg-none rounded-sm">
        <WalletSelector />
      </div>
    </div>
  );
}
