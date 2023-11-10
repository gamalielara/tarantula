import { TSESLint, AST_NODE_TYPES } from "@typescript-eslint/utils";
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

      const hasAltAttribute = attributes.some((attr) => {
        if (attr.type === "JSXAttribute") {
          return attr.name.name === "alt";
        } else {
          const spreadAttrName =
            attr.argument.type === "Identifier" ? attr.argument.name : null;

          const references = context.getScope().references;

          const foundOriginSpreadAttrName = references.find(
            (ref) => ref.identifier.name === spreadAttrName
          );

          if (
            foundOriginSpreadAttrName &&
            foundOriginSpreadAttrName.writeExpr?.type === "ObjectExpression"
          ) {
            try {
              return foundOriginSpreadAttrName.writeExpr.properties
                .filter((prop) => prop.type === "Property")
                .some((prop) => (prop as any).key.value === spreadAttrName);
            } catch (err) {
              return false;
            }
          }
        }
      });

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
