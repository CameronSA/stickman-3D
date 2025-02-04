import * as THREE from 'three';

export interface IStickObject {
  readonly startPosition: THREE.Vector3;
  readonly endPosition: THREE.Vector3;
  showMouseControls(): void;
  hideMouseControls(): void;
}
