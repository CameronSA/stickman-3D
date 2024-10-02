import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

export class Stickman implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;
  private headRadius = 1;
  private stickRadius = 0.25;
  private stickLength = 2;

  constructor(positionX: number, positionY: number, positionZ: number) {
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    let wireMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    this.group = new THREE.Group();

    const head = this.createHead(bodyMaterial, wireMaterial);
    const topBody = this.createStick(bodyMaterial, wireMaterial);
    const topLeftLeg = this.createStick(bodyMaterial, wireMaterial);
    const topRightLeg = this.createStick(bodyMaterial, wireMaterial);
    const bottomLeftLeg = this.createStick(bodyMaterial, wireMaterial);
    const bottomRightLeg = this.createStick(bodyMaterial, wireMaterial);

    const overlap = 0.1;
    const topLegAngle = Math.PI / 6;
    topBody.position.y -= this.stickLength - overlap;

    topLeftLeg.position.y -= 2 * this.stickLength - overlap;
    topLeftLeg.rotateZ(-topLegAngle);
    topLeftLeg.position.x += -0.5 * this.stickLength * Math.sin(topLegAngle);

    topRightLeg.position.y -= 2 * this.stickLength - overlap;
    topRightLeg.rotateZ(topLegAngle);
    topRightLeg.position.x += 0.5 * this.stickLength * Math.sin(topLegAngle);

    bottomLeftLeg.position.y -=
      this.stickLength * (2 + Math.cos(topLegAngle)) - overlap;
    bottomLeftLeg.position.x -= this.stickLength * Math.sin(topLegAngle);

    bottomRightLeg.position.y -=
      this.stickLength * (2 + Math.cos(topLegAngle)) - overlap;
    bottomRightLeg.position.x += this.stickLength * Math.sin(topLegAngle);

    this.group.add(
      head,
      topBody,
      topLeftLeg,
      topRightLeg,
      bottomLeftLeg,
      bottomRightLeg
    );

    this.group.position.set(positionX, positionY, positionZ);
  }

  private createHead(
    bodyMaterial: THREE.Material,
    edgeMaterial: THREE.Material
  ): THREE.Mesh {
    const headGeometry = new THREE.SphereGeometry(this.headRadius);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);

    var wireGeometry = new THREE.EdgesGeometry(head.geometry);
    var wireframe = new THREE.LineSegments(wireGeometry, edgeMaterial);

    head.add(wireframe);
    return head;
  }

  private createStick(
    bodyMaterial: THREE.Material,
    edgeMaterial: THREE.Material
  ): THREE.Mesh {
    const bodyGeometry = new THREE.CylinderGeometry(
      this.stickRadius,
      this.stickRadius,
      this.stickLength
    );
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    var wireGeometry = new THREE.EdgesGeometry(body.geometry);
    var wireframe = new THREE.LineSegments(wireGeometry, edgeMaterial);

    body.add(wireframe);
    return body;
  }

  update() {}
}
