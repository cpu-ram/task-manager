import { BaseNode } from 'nested-core';
import Domain from '../models/domain/Domain';
import { Task } from '../models/task/Task';

const seedData = new Domain({
  title: 'root',
  children: [],
});

function loadLocalStorageData(): BaseNode {
  const stored = localStorage.getItem('taskData');
  return stored ? parseObject(JSON.parse(stored)) : seedData;
}

export function exportData(): string {
  const data = localStorage.getItem('taskData');
  return data ?? JSON.stringify(seedData);
}

type ParsedObjectType = {
  type: string;
  title: string;
  children?: any;
};

function parseObject(object: ParsedObjectType): BaseNode {
  let result: BaseNode | null = null;

  switch (object.type) {
    case 'domain':
      result = new Domain(object);
      break;
    case 'task':
      result = new Task(object);
      break;
    default:
      throw new Error(`Unknown node type: ${object.type}`);
  }
  if (!result) throw new Error('Internal error.');

  result.children = (object.children ?? []).map((x: ParsedObjectType) => parseObject(x));
  return result;
}

export function getData(): BaseNode {
  const result = loadLocalStorageData();

  return result;
}
