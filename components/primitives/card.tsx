import { Card as ChakraCard } from "@chakra-ui/react";

export function Card(props: ChakraCard.RootProps) {
  return (
    <ChakraCard.Root
      css={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border-hex)",
        color: "var(--text-primary)",
      }}
      {...props}
    />
  );
}

export function CardHeader(props: ChakraCard.HeaderProps) {
  return <ChakraCard.Header {...props} />;
}

export function CardTitle(props: ChakraCard.TitleProps) {
  return <ChakraCard.Title {...props} />;
}

export function CardDescription(props: ChakraCard.DescriptionProps) {
  return (
    <ChakraCard.Description
      css={{ color: "var(--text-muted)" }}
      {...props}
    />
  );
}

export function CardContent(props: ChakraCard.BodyProps) {
  return <ChakraCard.Body {...props} />;
}

export function CardFooter(props: ChakraCard.FooterProps) {
  return <ChakraCard.Footer {...props} />;
}
