"use client";

import { Button } from "@/components/atoms/button";
import type { Session } from "@/types/session";
import { formatSessionPlanText } from "@/utils/format-session-plan";
import { Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

type CopyStatus = "idle" | "copied" | "error";

interface PlanCopyButtonProps {
  sessions: Session[];
}

export function PlanCopyButton({ sessions }: PlanCopyButtonProps) {
  const t = useTranslations("Plan.copy");
  const [status, setStatus] = useState<CopyStatus>("idle");
  const disabled = sessions.length === 0;

  useEffect(() => {
    if (status === "idle") return;
    const id = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(id);
  }, [status]);

  const copy = useCallback(async () => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(formatSessionPlanText(sessions));
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }, [disabled, sessions]);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => void copy()}
        aria-label={disabled ? t("disabledHint") : t("button")}
      >
        {status === "copied" ? t("copied") : t("button")}
      </Button>
      {status === "error" && (
        <Text fontSize="sm" color="var(--error-hex)" role="alert">
          {t("error")}
        </Text>
      )}
    </>
  );
}
