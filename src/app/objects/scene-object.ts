import { Group } from 'three';
import { Guid } from 'guid-typescript';

export interface ISceneObject {
  id: Guid;
  group: Group;
  existsInScene: boolean;
  update: () => void;
}
