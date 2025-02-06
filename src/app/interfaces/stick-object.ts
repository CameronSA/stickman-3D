import * as THREE from 'three';
import { RotationSetting } from '../components/enums/rotation-setting';

export interface IStickObject {
  readonly startPosition: THREE.Vector3;
  readonly endPosition: THREE.Vector3;
  showMouseControls(): void;
  hideMouseControls(): void;
  setRotationSetting(rotationSetting: RotationSetting): void;
}
