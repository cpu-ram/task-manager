import { useEffect } from 'react';

import { BaseNode } from 'nested-core';
import { useTreeState, type TreeReducer, type TreeAction } from 'nested-core';
import { getData } from './data/getData';
import taskManagerReducer from './taskManagerReducer';

export function useTaskManagerState() {
  const initialData: BaseNode = getData();

  const core = useTreeState({
    initialData,
    supplementalReducers: [taskManagerReducer as TreeReducer<TreeAction>],
  });

  useEffect(() => {
    saveData(core.dataTree);
  }, [core.dataTree]);

  function saveData(baseNode: BaseNode) {
    localStorage.setItem('taskData', JSON.stringify(baseNode, null, 2));
  }

  return {
    ...core,

    switchDone: ({ nodeId }: { nodeId: string }) => {
      core.dispatch({
        type: 'TOGGLE_DONE',
        payload: { nodeId },
      });
    },

    toggleArchiveDomain: ({ nodeId }: { nodeId: string }) => {
      core.dispatch({
        type: 'TOGGLE_ARCHIVE_DOMAIN',
        payload: { nodeId },
      });
    },

    replaceTree: ({ newTree }: { newTree: BaseNode }) => {
      core.dispatch({
        type: 'REPLACE_TREE',
        payload: { newTree },
      });
    },
  };
}
