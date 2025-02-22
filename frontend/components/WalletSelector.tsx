import {
  WalletItem,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Copy, LogOut } from "lucide-react";
import { useCallback } from "react";
// Internal components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export function WalletSelector() {
  const { account, connected, disconnect, wallets = [] } = useWallet();
  const mizuWallet = wallets.find((w) => w.name === "Mizu Wallet");
  const { toast } = useToast();

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);

  if (!mizuWallet) {
    return <>Mizu Wallet Not Found</>;
  }

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {account?.ansName || truncateAddress(account?.address) || "Unknown"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={disconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <WalletItem
      wallet={mizuWallet}
      className="flex items-center justify-between  gap-4   rounded-md"
    >
      {isInstallRequired(mizuWallet) ? (
        <Button
          size="sm"
          variant="ghost"
          className="bg-transparent border-none"
          asChild
        >
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm" className="">
            Connect
          </Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}
