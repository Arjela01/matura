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
      nodeMap[dataNode.id] = this.convertNode(dataNode);
    });

    dataNodes.forEach((dataNode: any) => {
      const node = nodeMap[dataNode.id];
      const parentId = dataNode.parentId;

      if (parentId) {
        const parentNode = nodeMap[parentId];
        if (parentNode) {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(node);
          parentNode.children.sort((a, b) => {
            return a.data.displayOrder - b.data.displayOrder;
          });
          treeNodes.sort((a, b) => {
            return a.data.displayOrder - b.data.displayOrder;
          });
        } else treeNodes.push(node);
      } else treeNodes.push(node);
    });
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
