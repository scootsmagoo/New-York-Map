import { useEffect, useState } from "react";
import { copyText } from "../lib/viewLink";

interface CopyLinkButtonProps {
  /** Builds the URL at click time, so it reflects the view as it is then. */
  getUrl: () => string;
  label: string;
  className?: string;
  role?: string;
}

/**
 * Copies a link and says so. The link also goes into the address bar, which
 * is where it ends up if the browser won't allow clipboard access.
 */
export function CopyLinkButton({ getUrl, label, className, role }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "address-bar">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const onClick = async () => {
    const url = getUrl();
    history.replaceState(null, "", url);
    setStatus((await copyText(url)) ? "copied" : "address-bar");
  };

  return (
    <button type="button" className={className} role={role} onClick={onClick}>
      {status === "copied"
        ? "Link copied ✓"
        : status === "address-bar"
          ? "Link is in the address bar"
          : label}
    </button>
  );
}
