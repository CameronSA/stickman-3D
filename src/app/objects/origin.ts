import * as THREE from 'three';
import { getSphericalCoordinate } from '../helpers/coordinate-helpers';
import { ISceneObject } from '../interfaces/scene-object';

export class Origin implements ISceneObject {
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.group = new THREE.Group();

    const length = 0.5;
    const origin = new THREE.Vector3();
    const xDir = new THREE.Vector3(1, 0, 0);
    const yDir = new THREE.Vector3(0, 1, 0);
    const zDir = new THREE.Vector3(0, 0, 1);

    const xArrow = this.arrow(xDir, origin, 0xff0000);
    const yArrow = this.arrow(yDir, origin, 0x00ff00);
    const zArrow = this.arrow(zDir, origin, 0x0000ff);

    this.group.add(xArrow);
    this.group.add(yArrow);
    this.group.add(zArrow);
  }

  update() {}

  private arrow(
    target: THREE.Vector3,
    origin: THREE.Vector3,
    color: THREE.ColorRepresentation,
    thickness = 0.01
  ): THREE.Group {
    const direction = target.clone().sub(origin).normalize();
    const coneHeight = thickness * 10;
    const magnitude = direction.length() / 2 - coneHeight / 2;

    const cylinderGeometry = new THREE.CylinderGeometry(
      thickness,
      thickness,
      magnitude,
      50
    );

    const coneGeometry = new THREE.ConeGeometry(thickness * 2, coneHeight, 36);

    const material = new THREE.MeshLambertMaterial({ color: color });

    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.position.set(origin.x, origin.y + magnitude / 2, origin.z);

    const cone = new THREE.Mesh(coneGeometry, material);
    cone.position.set(origin.x, origin.y + magnitude, origin.z);

    const spherical = getSphericalCoordinate(direction);

    console.log(direction, spherical);

    const group = new THREE.Group();
    group.add(cylinder, cone);

    if (spherical.theta !== 0 && spherical.phi !== 0) {
      // z direction
      group.rotateX(spherical.theta);
    } else {
      // x/y direction
      group.rotateZ(-spherical.theta);
      group.rotateY(spherical.phi);
    }

    return group;
  }
}
