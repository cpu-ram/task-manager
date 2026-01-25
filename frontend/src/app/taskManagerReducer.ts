import { TreeReducer, BaseNode, findNode } from 'nested-core';
import { isTask } from './models/task/Task';
import { isDomain } from './models/domain/Domain';

type ToggleDoneAction = {
  type: 'TOGGLE_DONE';
  payload: {
    nodeId: string;
  };
};

type ToggleArchiveDomainAction = {
  type: 'TOGGLE_ARCHIVE_DOMAIN';
  payload: {
    nodeId: string;
  };
};

type ReplaceTreeAction = {
  type: 'REPLACE_TREE';
  payload: {
    newTree: BaseNode;
  };
}

type TaskManagerAction = ToggleDoneAction | ToggleArchiveDomainAction | ReplaceTreeAction;

const taskManagerReducer: TreeReducer<TaskManagerAction> = (
  draft: BaseNode,
  action: TaskManagerAction,
): boolean => {
  switch (action.type) {
    case 'TOGGLE_DONE':
      {
        if (!action.payload.nodeId) {
          throw new Error('Invalid payload for TOGGLE_DONE action');
        }
        const foundTask: BaseNode | null = findNode({
          root: draft,
          nodeId: action.payload.nodeId,
        });
        if (!foundTask) throw new Error('Search error: node not found.');
        if (!isTask(foundTask)) throw new Error('Type error: can not toggle done on a non-task node');
        foundTask.done = !foundTask.done;
        return true;
      }
      break;

    case 'TOGGLE_ARCHIVE_DOMAIN':
      {
        if (!action.payload.nodeId) {
          throw new Error('Invalid payload for TOGGLE_ARCHIVE_DOMAIN action');
        }
        const { nodeId } = action.payload;
        const foundDomain: BaseNode | null = findNode({ root: draft, nodeId });
        if (!foundDomain) throw new Error('Search error: node not found.');
        if (!isDomain(foundDomain)) throw new Error('Type error: can not (un)archive a non-domain node');
        foundDomain.archived = !foundDomain.archived;
        return true;
      }
      break;

    case 'REPLACE_TREE':
      {
        const { newTree } = action.payload;
        if (!newTree) {
          throw new Error('Invalid payload for REPLACE_TREE action');
        }

        for (const key of Object.keys(draft)) {
          delete (draft as any)[key];
        }

        Object.assign(draft, newTree);

        return true;
      }

    default:
      return false;
  }
}

export default taskManagerReducer;
