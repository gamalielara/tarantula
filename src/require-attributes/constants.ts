type attrNames = "className" | "data-testid" | "onClick";

export const REQUIRE_ATTR_MESSAGES = {
  requireAttribute: `This element has no {{attrName}} attribute`,
  addAttribute: `Add {{attrName}} attribute`,
};

export type TMessagesId = keyof typeof REQUIRE_ATTR_MESSAGES;

export type TRuleParameter = [
  {
    attributes: string[];
  }
];
