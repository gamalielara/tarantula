import { TSESTree } from "@typescript-eslint/types";
import { TSESLint } from "@typescript-eslint/utils";

type TParam = {
  node: TSESTree.JSXOpeningElement;
  attrName: string;
  context: TSESLint.RuleContext<string, readonly unknown[]>;
};

export default (params: TParam) => {
  const { node, attrName, context } = params;

  const attributes = node.attributes;

  return attributes.some((attr) => {
    if (attr.type === "JSXAttribute") {
      return attr.name.name === attrName;
    }

    if (attr.type === "JSXSpreadAttribute") {
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
            .some((prop) => (prop as any).key.name === attrName);
        } catch (err) {
          return false;
        }
      }
    }
  });
};
