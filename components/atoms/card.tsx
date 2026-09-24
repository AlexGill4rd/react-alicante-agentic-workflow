import { Card as ChakraCard } from "@chakra-ui/react";

const CARD_SURFACE_CSS = {
  backgroundColor: "var(--card-fill)",
  borderColor: "transparent",
  color: "var(--text-primary)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-card)",
  transition:
    "box-shadow var(--transition-standard), transform var(--transition-standard)",
  _hover: {
    boxShadow: "var(--shadow-card-hover)",
    transform: "scale(1.02)",
  },
};

const CHART_CARD_CSS = {
  ...CARD_SURFACE_CSS,
  _hover: {
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
      fontSize="xl"
      fontWeight="500"
      letterSpacing="normal"
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
