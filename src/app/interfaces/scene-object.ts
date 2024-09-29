import { Guid } from 'guid-typescript';
import { Group } from 'three';

export interface ISceneObject {
  id: Guid;
  group: Group;
  existsInScene: boolean;
  update: () => void;
}
