import { TSESLint, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { REQUIRE_ALT_MESSAGES, TMessagesId } from "./constants";
import crypto from "node:crypto";
import checkHasAttr from "../globalUtils/checkHasAttr";

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
    JSXOpeningElement: function (node) {
      const nodeNameTree = node.name;
      const nodeName =
        nodeNameTree.type === "JSXIdentifier" && nodeNameTree.name;

      const isImageElement =
        nodeName === "img" || checkHasAttr({ attrName: "src", context, node });

      if (!isImageElement) return;

      const hasAltAttribute = checkHasAttr({ attrName: "alt", context, node });

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
