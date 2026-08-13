import { createTheme } from "@mantine/core";

const primary = [
  "#fff1f2",
  "#ffe4e6",
  "#fecdd3",
  "#fda4af",
  "#fb7185",
  "#e11d48",
  "#be123c",
  "#9f1239",
  "#881337",
  "#4c0519",
] as const;

export const theme = createTheme({
  primaryColor: "primary",
  primaryShade: { light: 6, dark: 5 },
  colors: { primary },
  fontFamily: "Avenir Next, Segoe UI, sans-serif",
  headings: {
    fontFamily: "Avenir Next, Segoe UI, sans-serif",
    fontWeight: "650",
  },
  defaultRadius: "sm",
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  components: {
    Button: {
      defaultProps: {
        radius: "sm",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "sm",
      },
    },
    Select: {
      defaultProps: {
        radius: "sm",
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "sm",
      },
    },
    Modal: {
      defaultProps: {
        radius: "sm",
        overlayProps: { backgroundOpacity: 0.28, blur: 2 },
      },
    },
    Table: {
      defaultProps: {
        horizontalSpacing: "md",
        verticalSpacing: "sm",
        highlightOnHover: true,
        striped: false,
      },
    },
  },
});
