import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

interface SegmentLink {
  mesh: THREE.Mesh;
  nextSegment: SegmentLink | undefined;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
}

export class Stick implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;
  private stickSegments: SegmentLink[] = [];

  constructor(
    private readonly stickRadius: number,
    private readonly stickLength: number,
    private readonly stickMaterial: THREE.Material,
    private readonly numberOfSegments: number = 1
  ) {
    this.group = new THREE.Group();

    // // Generate linked list of stick segments
    // do {
    //   let previousSegmentLink = this.tryGetLastSegment();
    //   const segmentLink = this.generateSegment(previousSegmentLink.segment);

    //   if (previousSegmentLink.segment) {
    //     this.stickSegments[previousSegmentLink.index].nextSegment = segmentLink;
    //   }

    //   this.stickSegments.push(segmentLink);
    //   this.group.add(segmentLink.mesh);
    // } while (this.stickSegments.length < this.numberOfSegments);

    // this.bendTest();

    const body = this.bendTheCone();

    this.group.add(body);
    this.group.position.y = 5;
  }

  update() {}

  bendTheCone(): THREE.Mesh {
    let angle = Math.PI / 4;
    var geom = new THREE.CylinderGeometry(
      this.stickRadius,
      this.stickRadius,
      angle
    );

    geom.translate(10, angle, 0);
    var position = geom.attributes['position'];
    for (var i = 0; i < position.count; i++) {
      var localTheta = position.getY(i);
      var localRadius = position.getX(i);
      position.setXY(
        i,
        Math.cos(localTheta) * localRadius,
        Math.sin(localTheta) * localRadius
      );
    }

    geom.computeVertexNormals();

    let wireMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    let wireGeometry = new THREE.EdgesGeometry(geom);
    let wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    const body = new THREE.Mesh(geom, this.stickMaterial);
    body.add(wireframe);

    return body;
  }

  private bendTest() {
    const totalAngle = Math.PI / 2;
    const individualAngle = totalAngle / this.stickSegments.length;
    for (let i = 0; i < this.stickSegments.length; i++) {
      const currentAngle = individualAngle * (i + 1);
      this.stickSegments[i].mesh.rotateZ(currentAngle);
      this.stickSegments[i].mesh.position.x -=
        i * (this.stickLength / 8) * Math.sin(currentAngle);
      console.log(this.stickSegments[i].mesh.position.x, currentAngle);
    }
  }

  private tryGetLastSegment(): {
    segment: SegmentLink | undefined;
    index: number;
  } {
    if (this.stickSegments.length > 0) {
      const lastIndex = this.stickSegments.length - 1;
      return {
        segment: this.stickSegments[lastIndex],
        index: lastIndex,
      };
    }

    return {
      segment: undefined,
      index: -1,
    };
  }

  private generateSegment(
    previousSegment: SegmentLink | undefined
  ): SegmentLink {
    const length = this.stickLength / this.numberOfSegments;

    const stickGeometry = new THREE.CylinderGeometry(
      this.stickRadius,
      this.stickRadius,
      length
    );

    const body = new THREE.Mesh(stickGeometry, this.stickMaterial);

    let startPosition = new THREE.Vector3(0, length / 2, 0);
    let endPosition = new THREE.Vector3(0, length + length / 2, 0);
    // Original direction of cylinder
    let axis = new THREE.Vector3(0, 1, 0);

    if (previousSegment) {
      const direction = previousSegment.endPosition
        .clone()
        .sub(previousSegment.startPosition);

      startPosition = previousSegment.endPosition;
      endPosition = startPosition.clone().add(direction);
      axis = direction.clone().normalize();
    }

    const direction = endPosition.clone().sub(startPosition);

    // Rotate to same direction as previous segment
    body.quaternion.setFromUnitVectors(axis, direction.clone().normalize());

    // move to end of previous segment
    body.position.copy(direction.clone().multiplyScalar(0.5));
    body.position.set(startPosition.x, startPosition.y, startPosition.z);

    let wireMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    let wireGeometry = new THREE.EdgesGeometry(body.geometry);
    let wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    body.add(wireframe);

    return {
      mesh: body,
      nextSegment: undefined,
      startPosition: startPosition,
      endPosition: endPosition,
    };
  }
}
