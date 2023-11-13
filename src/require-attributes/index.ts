import { TSESLint } from "@typescript-eslint/utils";
import {
  REQUIRE_ATTR_MESSAGES,
  TMessagesId,
  TRuleParameter,
} from "./constants";
import checkHasAttr from "../globalUtils/checkHasAttr";
import crypto from "node:crypto";

export const requireAttributesName = "require-attributes";

export const requireAttributes: TSESLint.RuleModule<
  TMessagesId,
  TRuleParameter
> = {
  defaultOptions: [{ attributes: [] }],
  meta: {
    type: "problem",
    docs: {
      description: "Every image element must have alt attribute",
    },
    fixable: "code",
    hasSuggestions: true,
    messages: REQUIRE_ATTR_MESSAGES,
    schema: [
      {
        type: "object",
        properties: {
          attributes: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    ],
  },
  create: (context) => ({
    JSXOpeningElement: (node) => {
      const [option] = context.options;
      const { attributes } = option;

      const nodeNameTree = node.name;
      const nodeName =
        nodeNameTree.type === "JSXIdentifier" && nodeNameTree.name;

      const hasAttr = attributes.every((attr) =>
        checkHasAttr({ attrName: attr, node, context })
      );

      if (!hasAttr) {
        const absentAttr = attributes.filter(
          (attr) => !checkHasAttr({ attrName: attr, node, context })
        );

        context.report({
          node,
          messageId: "requireAttribute",
          data: {
            attrName: absentAttr.join(", "),
          },
          suggest: absentAttr.map((attr) => ({
            messageId: "addAttribute",
            fix: (fixer) => fixer.insertTextAfter(nodeNameTree, ` ${attr}={}`),
            data: {
              attrName: attr,
            },
          })),
        });
      }
    },
  }),
};
