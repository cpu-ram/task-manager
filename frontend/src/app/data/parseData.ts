import { BaseNode } from 'nested-core';
import Domain from '../models/domain/Domain';
import { Task } from '../models/task/Task';


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

export function parseData(dataStr: string): BaseNode {
  let dataJson: unknown;
  try {
    dataJson = JSON.parse(dataStr);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Failed to parse JSON: ' + e.message);
    } else {
      throw e;
    }
  }

  return parseObject(dataJson as ParsedObjectType);
};