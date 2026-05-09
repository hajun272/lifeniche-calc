export type CategoryId = "tax" | "family" | "realEstate" | "work" | "money" | "etc";

export type FieldOption = {
  label: string;
  value: string;
};

export type CalculatorField = {
  name: string;
  label: string;
  type: "number" | "select" | "date";
  unit?: string;
  placeholder?: string;
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: FieldOption[];
  helper?: string;
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: CategoryId;
  description: string;
  popularity: number;
  status: "ready" | "template";
  fields: CalculatorField[];
  explanation: string[];
  caution: string[];
  lawLinks: { label: string; href: string }[];
  relatedSlugs?: string[];
};

export type CalculatorResult = {
  headline: string;
  value: number | string;
  unit?: string;
  summary: string;
  items: { label: string; value: string; tone?: "good" | "warn" | "neutral" }[];
};
