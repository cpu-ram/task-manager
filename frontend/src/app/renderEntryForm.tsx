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

type NodeCreationSubmitHandlerParams = {
  mode: 'create';
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
};

type NodeEditSubmitHandlerParams = {
  mode: 'edit';
  targetNodeId: string;
  nodeType: NodeType;
  onMenuClose?: () => void;
  updateNode: ({
    nodeId,
    newNode,
  }: {
    nodeId: string;
    newNode: BaseNode;
  }) => void;
};

type SubmitHandlerParams =
  | NodeCreationSubmitHandlerParams
  | NodeEditSubmitHandlerParams;

function createNodeSubmitHandler(args: SubmitHandlerParams) {
  return ({ e }: { e: React.FormEvent<HTMLFormElement> }) => {
    if (args.mode === 'create') {
      const {
        parentId, nodeType, onMenuClose, addChildNode,
      } = args;

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
    }

    else if (args.mode === 'edit') {
      const {
        targetNodeId, nodeType, onMenuClose, updateNode,
      } = args;

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

      updateNode({ nodeId: targetNodeId, newNode: newChildNode });
      onMenuClose && onMenuClose();
    }
  };
}

type CreateEntryFormParams = {
  nodeType: string;
  formType: 'create';
  onMenuClose?: () => void;
  parentId: string;
  addChildNode: ({
    parentId,
    childNode,
  }: {
    parentId: string;
    childNode: BaseNode;
  }) => void;
};

type EditEntryFormParams = {
  nodeType: string;
  formType: 'edit';
  onMenuClose?: () => void;
  targetNodeId: string;
  updateNode: ({
    nodeId,
    newNode,
  }: {
    nodeId: string;
    newNode: BaseNode;
  }) => void;
  initialState: {
    title: string;
    dueDate?: Temporal.PlainDate;
    instructions?: string;
  }
};

type EntryFormParams = CreateEntryFormParams | EditEntryFormParams;

function renderEntryForm(args: EntryFormParams) {
  const { formType } = args;

  if (formType === 'create') {
    return renderCreateForm(args);
  } if (formType === 'edit') {
    return renderEditForm(args);
  }
  return null;
}

function renderCreateForm(args: CreateEntryFormParams) {
  const {
    nodeType, onMenuClose, parentId, addChildNode,
  } = args;

  switch (nodeType) {
    case 'task':
      return (
        <TaskForm
          onMenuClose={onMenuClose}
          onSubmit={createNodeSubmitHandler({
            mode: 'create',
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
            mode: 'create',
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

function renderEditForm(args: EditEntryFormParams) {
  const {
    nodeType, onMenuClose, targetNodeId, updateNode, initialState
  } = args;

  switch (nodeType) {
    case 'domain':
      return (
        <DomainForm
          onMenuClose={onMenuClose}
          onSubmit={createNodeSubmitHandler({
            mode: 'edit',
            targetNodeId,
            nodeType: 'domain',
            updateNode,
            onMenuClose,
          })}
          initialState={initialState}
        />
      );
      break;

    case 'task':
      return (
        <TaskForm
          onMenuClose={onMenuClose}
          onSubmit={createNodeSubmitHandler({
            mode: 'edit',
            targetNodeId,
            nodeType: 'task',
            updateNode,
            onMenuClose,
          })}
          initialState={initialState}
        />
      );
      break;

    default:
      return null;
  }
}

export default renderEntryForm;
