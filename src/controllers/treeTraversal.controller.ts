import { type Request, type Response } from "express";

export async function inOrderTraversal(req: Request, res: Response) {
  /**
   * Represents a node in the tree.
   */
  class TreeNode {
    value: any;
    children: TreeNode[];

    constructor(value: any, children: TreeNode[] = []) {
      this.value = value;
      this.children = children;
    }
  }

  /**
   * Performs an in-order traversal of a tree and collects the values in an array.
   * @param node - The root node of the tree.
   * @returns An array of values from the in-order traversal.
   */
  function inOrderTraversal(node: TreeNode | null): any[] {
    const values: any[] = [];

    function visit(value: any) {
      values.push(value);
    }

    function traverse(node: TreeNode | null) {
      if (node === null) return;

      if (node.children.length > 0) {
        // Visit the leftmost child
        traverse(node.children[0]);
      }

      // Visit the node itself
      visit(node.value);

      // Visit the remaining children
      for (let i = 1; i < node.children.length; i++) {
        traverse(node.children[i]);
      }
    }

    traverse(node);
    return values;
  }

  // Creating the tree structure
  const nodeK = new TreeNode("K");
  const nodeE = new TreeNode("E", [nodeK]);
  const nodeF = new TreeNode("F");
  const nodeL = new TreeNode("L");
  const nodeG = new TreeNode("G", [nodeL]);
  const nodeB = new TreeNode("B", [nodeF, nodeG]);

  const nodeC = new TreeNode("C");

  const nodeH = new TreeNode("H");
  const nodeI = new TreeNode("I");
  const nodeJ = new TreeNode("J");
  const nodeD = new TreeNode("D", [nodeH, nodeI, nodeJ]);

  const root = new TreeNode("A", [nodeB, nodeC, nodeD, nodeE]);

  // Performing in-order traversal and collecting the values
  const values = inOrderTraversal(root);

  res.status(200).json({ message: values });
}
