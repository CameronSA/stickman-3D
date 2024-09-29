import { Group } from 'three';

export interface ISceneObject {
  group: Group;
  existsInScene: boolean;
  update: () => void;
}
