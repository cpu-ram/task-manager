import { BaseNode } from 'nested-core';
import { Task } from './models/task/Task.ts';

function nodeSort(a: BaseNode, b: BaseNode) {
  if (a instanceof Task && b instanceof Task) {
    if (a.dueDate && b.dueDate) {
      if (a.dueDate.until(b.dueDate).days > 0) return -1;
    }
    return 1;
  }
  return 1;
}

export default nodeSort;
