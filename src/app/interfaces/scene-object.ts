import { Group } from 'three';

export interface ISceneObject {
  id: string;
  meshIds: string[];
  group: Group;
  existsInScene: boolean;
  update: () => void;
}
