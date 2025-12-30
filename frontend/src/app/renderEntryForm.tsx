import { Temporal } from 'temporal-polyfill';

import { BaseNode } from 'nested-core';
import { Task } from './models/task/Task.ts';
import Domain from './models/domain/Domain.ts';

import TaskForm from './forms/TaskForm.tsx';
import DomainForm from './forms/DomainForm.tsx';

type NodeType = 'task' | 'domain';

function createNode({
  nodeData,
  nodeType,
}: {
  nodeData: any;
  nodeType: NodeType;
}): BaseNode {
  let resultNode: BaseNode | null = null;

  if (nodeType === 'task') {
    resultNode = new Task(nodeData);
  } else if (nodeType === 'domain') {
    resultNode = new Domain(nodeData);
  } else {
    throw new Error('Error: unsupported node type.');
  }

  return resultNode;
}

function interceptFormData(e: React.FormEvent<HTMLFormElement>): any {
  e.preventDefault();
  const form = e.currentTarget;

  const data = new FormData(form);
  const nodeData = Object.fromEntries(data.entries());

  return nodeData;
}

function convertDateStringToTemporalPlainDate(
  dateString: string,
): Temporal.PlainDate | undefined {
  if (dateString === '') return undefined;
  return Temporal.PlainDate.from(dateString);
}

function transformFormData({
  formData,
  transformConfig,
}: {
  formData: any;
  transformConfig: {
    [key: string]: (arg: string) => any;
  };
}): any {
  const transformedData = Object.entries(formData).map(([key, value]) => {
    if (transformConfig[key]) {
      return [key, transformConfig[key](value as string)];
    }
    return [key, value];
  });
  return Object.fromEntries(transformedData);
}

function createNodeSubmitHandler({
  parentId,
  nodeType,
  onMenuClose,
  addChildNode,
}: {
  parentId: string;
  nodeType: NodeType;
  onMenuClose?: () => void;
  addChildNode: ({
    parentId,
    childNode,
  }: {
    parentId: string;
    childNode: BaseNode;
  }) => void;
}) {
  return ({ e }: { e: React.FormEvent<HTMLFormElement> }) => {
    const nodeData = interceptFormData(e);

    const transformConfig: {
      [key: string]: (arg: string) => any;
    } = {
      dueDate: convertDateStringToTemporalPlainDate,
    };
    const transformedNodeData = transformFormData({
      formData: nodeData,
      transformConfig,
    });

    const newChildNode = createNode({
      nodeData: transformedNodeData,
      nodeType,
    });
    addChildNode({ parentId, childNode: newChildNode });
    onMenuClose && onMenuClose();
  };
}

function renderEntryForm({
  type,
  onMenuClose,
  parentId,
  addChildNode,
}: {
  type: string;
  onMenuClose?: () => void;
  parentId: string;
  addChildNode: ({
    parentId,
    childNode,
  }: {
    parentId: string;
    childNode: BaseNode;
  }) => void;
}) {
  switch (type) {
    case 'task':
      return (
        <TaskForm
          onMenuClose={onMenuClose}
          onSubmit={createNodeSubmitHandler({
            parentId,
            nodeType: 'task',
            addChildNode,
            onMenuClose,
          })}
        />
      );
      break;

    case 'domain':
      return (
        <DomainForm
          onMenuClose={onMenuClose}
          onSubmit={createNodeSubmitHandler({
            parentId,
            nodeType: 'domain',
            addChildNode,
            onMenuClose,
          })}
        />
      );
      break;

    default:
      return null;
  }
}

export default renderEntryForm;
