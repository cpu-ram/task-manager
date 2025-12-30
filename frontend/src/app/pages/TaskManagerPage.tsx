import './taskManagerStyles.css';
import {
  FilterCriterionConfig,
  FilterCriteriaState,
  BaseNode,
  TreeUI,
  Action,
} from 'nested-core';
import { Task } from '../models/task/Task.ts';
import Domain from '../models/domain/Domain.ts';
import { exportData } from '../data/getData.ts';
import nodeSort from '../nodeSort.ts';
import { renderTitle } from '../components/NodeTitle/NodeTitle.tsx';
import renderEntryForm from '../renderEntryForm.tsx';

import { useTaskManagerState } from '../useTaskManagerState.ts';

function TaskManagerPage() {
  const {
    dataTree,
    switchDone,
    addChildNode,
    deleteNode,
    toggleArchiveDomain,
  } = useTaskManagerState();

  function downloadData(): void {
    const dataStr: string = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskData.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const initialFilterCriteria: FilterCriterionConfig[] = [
    {
      name: 'showCompleteTasks',
      label: 'Show complete tasks',
      initialValue: false,
    },
    {
      name: 'showArchivedDomains',
      label: 'Show archived domains',
      initialValue: false,
    },
  ];

  function renderCustomDataFields(node: BaseNode) {
    return (
      <>
        {'done' in node && (
          <span className="actions">
            <label>
              <input
                type="checkbox"
                name="done"
                checked={(node as Task).done}
                onChange={() => {
                  switchDone({ nodeId: node.id });
                }}
              />
              Done?
            </label>
          </span>
        )}
        {'dueDate' in node && node.dueDate && (
          <p>
            <u>Duedate:</u>
            {' '}
            {node.dueDate.toString()}
          </p>
        )}
        {'instructions' in node && node.instructions && (
          <p>
            <u>Instructions:</u>
            {' '}
            {node.instructions as string}
          </p>
        )}
      </>
    );
  }

  function isFilteredOut(
    node: BaseNode,
    filterCriteria: FilterCriteriaState,
  ): boolean {
    switch (node.type) {
      case 'task':
        if (
          (node as Task).done === true
          && filterCriteria.showCompleteTasks.value === false
        ) {
          return true;
        }
        return false;
      case 'domain':
        if (
          (node as Domain).archived === true
          && filterCriteria.showArchivedDomains.value === false
        ) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  const actions: {
    [key: string]: Action;
  } = {
    createNewChildTask: {
      type: 'node',

      label: '+ Create New Task',

      renderer: ({
        hidePopup,
        callerId,
      }: {
        hidePopup?: () => void;
        callerId: string;
      }) => renderEntryForm({
        type: 'task',
        onMenuClose: hidePopup,
        parentId: callerId,
        addChildNode,
      }),
    },

    createNewChildDomain: {
      type: 'node',

      label: '+ Create New Domain',

      renderer: ({
        hidePopup,
        callerId,
      }: {
        hidePopup?: () => void;
        callerId: string;
      }) => renderEntryForm({
        type: 'domain',
        onMenuClose: hidePopup,
        parentId: callerId,
        addChildNode,
      }),
    },

    toggleArchiveDomain: {
      type: 'node',

      label: 'Archive',

      execute: ({ callerId }: { callerId: string }) => toggleArchiveDomain({ nodeId: callerId }),
    },

    toggleUnarchiveDomain: {
      type: 'node',

      label: 'Unarchive',

      execute: ({ callerId }: { callerId: string }) => toggleArchiveDomain({ nodeId: callerId }),
    },

    deleteTask: {
      type: 'node',

      label: 'Delete',

      execute: ({ callerId }: { callerId: string }) => deleteNode({ nodeId: callerId }),
    },

    downloadData: {
      type: 'global',

      label: 'Export Data',

      execute: () => downloadData(),
    },
  };

  const headerActions: string[] = ['downloadData'];

  const getNodeActionsList = (node: BaseNode) => {
    switch (node.type) {
      case 'task': {
        return ['createNewChildTask', 'deleteTask'];
      }
      case 'domain': {
        const domainActionsList = [
          'createNewChildTask',
          'createNewChildDomain',
        ];

        if (node instanceof Domain && node.archived) {
          domainActionsList.push('toggleUnarchiveDomain');
        } else {
          domainActionsList.push('toggleArchiveDomain');
        }
        return domainActionsList;
      }
      default:
        return [];
    }
  };

  const treeUI = (
    <TreeUI
      initialFilterCriteria={initialFilterCriteria}
      nodeSort={nodeSort}
      renderTitle={renderTitle}
      dataTree={dataTree}
      renderCustomDataFields={renderCustomDataFields}
      isFilteredOut={isFilteredOut}
      actions={actions}
      headerActions={headerActions}
      getNodeActionsList={getNodeActionsList}
    />
  );
  return treeUI;
}

export default TaskManagerPage;
