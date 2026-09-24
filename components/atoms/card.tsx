import { Card as ChakraCard } from "@chakra-ui/react";

const CARD_SURFACE_CSS = {
  backgroundColor: "var(--card-fill)",
  backgroundImage: "var(--card-bg)",
  borderColor: "var(--card-border-hex)",
  color: "var(--text-primary)",
  borderRadius: "var(--radius-2xl)",
  boxShadow: "var(--shadow-card)",
  transition:
    "border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)",
  _hover: {
    borderColor: "var(--card-border-hover-hex)",
    boxShadow: "var(--shadow-card-hover)",
    transform: "translateY(-4px)",
  },
};

const CHART_CARD_CSS = {
  ...CARD_SURFACE_CSS,
  _hover: {
    borderColor: "var(--card-border-hex)",
    boxShadow: "var(--shadow-card)",
    transform: "none",
  },
};

export function Card({
  variant,
  ...props
}: ChakraCard.RootProps & { variant?: "default" | "chart" }) {
  return (
    <ChakraCard.Root
      css={variant === "chart" ? CHART_CARD_CSS : CARD_SURFACE_CSS}
      {...props}
    />
  );
}

export function CardHeader(props: ChakraCard.HeaderProps) {
  return <ChakraCard.Header gap="3" {...props} />;
}

export function CardTitle(props: ChakraCard.TitleProps) {
  return (
    <ChakraCard.Title
      fontSize="lg"
      fontWeight="semibold"
      letterSpacing="tight"
      {...props}
    />
  );
}

export function CardDescription(props: ChakraCard.DescriptionProps) {
  return (
    <ChakraCard.Description css={{ color: "var(--text-muted)" }} {...props} />
  );
}

export function CardContent(props: ChakraCard.BodyProps) {
  return <ChakraCard.Body {...props} />;
}

export function CardFooter(props: ChakraCard.FooterProps) {
  return <ChakraCard.Footer {...props} />;
}
