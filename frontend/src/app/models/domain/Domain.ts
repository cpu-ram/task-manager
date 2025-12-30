import { BaseNode, type BaseNodeArgs } from 'nested-core';

export type DomainArgs = BaseNodeArgs & {
  archived?: boolean;
};
class Domain extends BaseNode {
  static readonly nodeTypeName = 'domain';

  archived: boolean;

  constructor(args: DomainArgs) {
    super({ ...args, type: Domain.nodeTypeName });
    this.archived = args.archived ?? false;
  }
}

export function isDomain(node: BaseNode): node is Domain {
  return node.type === Domain.nodeTypeName;
}

export default Domain;
