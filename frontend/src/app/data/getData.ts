import { BaseNode } from 'nested-core';
import Domain from '../models/domain/Domain';
import { Task } from '../models/task/Task';

import { parseData } from './parseData';

const seedData = new Domain({
  title: 'root',
  children: [],
});

function loadLocalStorageData(): BaseNode {
  const stored = localStorage.getItem('taskData');
  return stored ? parseData(stored) : seedData;
}

export function exportData(): string {
  const data = localStorage.getItem('taskData');
  return data ?? JSON.stringify(seedData);
}

export function getData(): BaseNode {
  const result = loadLocalStorageData();

  return result;
}
