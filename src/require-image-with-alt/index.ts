import { TSESLint } from "@typescript-eslint/utils";
import { REQUIRE_ALT_MESSAGES, TMessagesId } from "./constants";
import crypto from "node:crypto";

export const requireImageWithAltRuleName = "require-image-with-alt";
export const requireImageWithAlt: TSESLint.RuleModule<TMessagesId> = {
  defaultOptions: [],
  meta: {
    type: "problem",
    docs: {
      description: "Every image element must have alt attribute",
    },
    fixable: "code",
    hasSuggestions: true,
    messages: REQUIRE_ALT_MESSAGES,
    schema: [],
  },
  create: (context) => ({
    JSXOpeningElement: (node) => {
      const nodeNameTree = node.name;
      const nodeName =
        nodeNameTree.type === "JSXIdentifier" && nodeNameTree.name;

      if (!nodeName || nodeName !== "img") return;

      const attributes = node.attributes;

      const hasAltAttribute = attributes.some((attr) =>
        attr.type === "JSXAttribute" ? attr.name.name === "alt" : true
      );

      if (!hasAltAttribute) {
        context.report({
          node,
          messageId: "requireAlt",
          suggest: [
            {
              messageId: "addAlt",
              fix: (fixer) =>
                fixer.insertTextAfter(
                  nodeNameTree,
                  ` alt='${nodeName}-${crypto.randomUUID()}'`
                ),
            },
          ],
        });
      }
    },
  }),
};
