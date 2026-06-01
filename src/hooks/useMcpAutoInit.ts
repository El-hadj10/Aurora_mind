import { useEffect } from "react";
import { useMcpStore } from "../../mcpManager";

export function useMcpAutoInit() {
  const connectToRelay = useMcpStore((state) => state.connectToRelay);

  useEffect(() => {
    connectToRelay();
    // testExtensions() should now be called manually or from a specific UI action,
    // as it relies on the relay being connected and routing correctly.
  }, [connectToRelay]);
}
