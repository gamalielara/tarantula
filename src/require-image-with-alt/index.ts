import { TSESLint, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { REQUIRE_ALT_MESSAGES, TMessagesId } from "./constants";
import crypto from "node:crypto";
import checkHasAttr from "../globalUtils/checkHasAttr";
import path from "node:path";
import { parse } from "@typescript-eslint/parser";

import * as fs from "node:fs";

const imporedStyles = [];

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
    ImportDeclaration: function (node) {
      const isImportedStyledComponent = Boolean(
        node.source.value.match(/styles?/)
      );

      const lintedFilePath = context.getPhysicalFilename?.();

      console.log({ isImportedStyledComponent, nodeName: node.source.value });

      if (!isImportedStyledComponent || !lintedFilePath) return;

      const parentPath = path.resolve(lintedFilePath, "..");

      const styledComponentPath =
        path.resolve(parentPath, node.source.value) + ".ts";

      console.log({
        styledComponentPath,
        lintedFilePath: path.resolve(lintedFilePath, ".."),
      });

      const styledFileStringified = fs.readFileSync(styledComponentPath, {
        encoding: "utf-8",
      });

      const result = parse(styledFileStringified);
    },
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
    "Program:exit": function () {
      imporedStyles.length = 0;
    },
  }),
};
