import { Pipe, PipeTransform } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Pipe({
  name: 'treeJsonConversion',
  standalone: true,
})
export class TreeJsonConversionPipe implements PipeTransform {
  transform(data: any): TreeNode[] {
    if (!data) {
      return [];
    }

    const treeNodes: TreeNode[] = [];
    this.convertToTree(data, treeNodes);
    return treeNodes;
  }

  private convertToTree(dataNodes: any[], treeNodes: TreeNode[]): void {
    const nodeMap: { [key: number]: TreeNode } = {};

    dataNodes.forEach((dataNode: any) => {
      const node = this.convertNode(dataNode);
      nodeMap[dataNode.id] = node;
    });

    const parentNodes: TreeNode[] = [];
    const childNodesMap: { [key: number]: TreeNode[] } = {};

    dataNodes.forEach((dataNode: any) => {
      const node = nodeMap[dataNode.id];
      const parentId = dataNode.parentId;

      if (parentId) {
        if (!childNodesMap[parentId]) {
          childNodesMap[parentId] = [];
        }
        childNodesMap[parentId].push(node);
      } else {
        parentNodes.push(node);
      }
    });

    parentNodes.sort((a, b) => {
      const displayOrderA = a.data.displayOrder || 0;
      const displayOrderB = b.data.displayOrder || 0;
      return displayOrderA - displayOrderB;
    });
    parentNodes.forEach(parentNode => {
      if (childNodesMap[parentNode.data.id]) {
        childNodesMap[parentNode.data.id].sort((a, b) => {
          const displayOrderA = a.data.displayOrder || 0;
          const displayOrderB = b.data.displayOrder || 0;
          return displayOrderA - displayOrderB;
        });
        parentNode.children = childNodesMap[parentNode.data.id];
      }
    });
    treeNodes.push(...parentNodes);
    for (const parentId in childNodesMap) {
      if (!nodeMap[parentId]) {
        treeNodes.push(...childNodesMap[parentId]);
      }
    }
  }

  private convertNode(dataNode: any): TreeNode {
    return {
      label: dataNode.text,
      data: {
        id: dataNode.id,
        text: dataNode.text,
        url: dataNode.url,
        roles: dataNode.roles,
        isVisible: dataNode.isVisible,
        parentId: dataNode.parentId,
        displayOrder: dataNode.displayOrder,
      },
      expanded: true,
      children: [],
    };
  }
}
