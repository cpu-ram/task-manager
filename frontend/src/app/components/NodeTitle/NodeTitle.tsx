import { ReactNode } from 'react';
import { BaseNode } from 'nested-core';
import { isTask } from '../../models/task/Task.js';
import { getDaysLeftInline } from '../TaskView/TaskView.js';

export function renderTitle(node: BaseNode): ReactNode {
  return (
    <>
      <span
        style={{
          textDecoration: isTask(node) && node.done ? 'line-through' : 'none',
        }}
      >
        {node.title}
      </span>
      {isTask(node) && node.dueDate && !node.done && (
        <>{getDaysLeftInline(node.dueDate)}</>
      )}
    </>
  );
}
