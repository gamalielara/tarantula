import { TSESLint } from "@typescript-eslint/utils";
import {
  requireImageWithAlt,
  requireImageWithAltRuleName,
} from "./require-image-with-alt";
import { requireAttributes, requireAttributesName } from "./require-attributes";

export const rules: Record<
  string,
  TSESLint.RuleModule<string, readonly unknown[]>
> = {
  [requireImageWithAltRuleName]: requireImageWithAlt,
  [requireAttributesName]: requireAttributes,
};
