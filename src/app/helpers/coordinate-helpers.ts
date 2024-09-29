import * as THREE from 'three';
import { SphericalCoordinate } from '../interfaces/spherical-coordinate';

export function getSphericalCoordinate(
  vector: THREE.Vector3
): SphericalCoordinate {
  // x is +x
  // y is -z
  // z is y

  const x = vector.x;
  const y = -vector.z;
  const z = vector.y;

  const radius = calculateRadius(x, y, z);
  const theta = calculateTheta(x, y, z);
  const phi = calculatePhi(x, y, z);

  return {
    radius,
    theta,
    phi,
  } as SphericalCoordinate;
}

export function getCartesianCoordinate(
  sphericalCoordinate: SphericalCoordinate
): THREE.Vector3 {
  // x is +x
  // y is -z
  // z is y

  const toXYPlane =
    sphericalCoordinate.radius * Math.sin(sphericalCoordinate.theta);

  const x = toXYPlane * Math.cos(sphericalCoordinate.phi);
  const y = toXYPlane * Math.sin(sphericalCoordinate.phi);
  const z = sphericalCoordinate.radius * Math.cos(sphericalCoordinate.theta);

  return new THREE.Vector3(x, z, -y);
}

function calculateRadius(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

function calculateTheta(x: number, y: number, z: number): number {
  const xyMagnitude = Math.sqrt(x * x + y * y);
  if (z > 0) {
    return Math.atan(xyMagnitude / z);
  }

  if (z < 0) {
    return Math.PI + Math.atan2(xyMagnitude, z);
  }

  if (z === 0 && xyMagnitude != 0) {
    return Math.PI / 2;
  }

  return 0;
}

function calculatePhi(x: number, y: number, z: number): number {
  if (x > 0) {
    return Math.atan(y / x);
  }

  if (x < 0 && y >= 0) {
    return Math.PI + Math.atan(y / x);
  }

  if (x < 0 && y < 0) {
    return Math.atan(y / x) - Math.PI;
  }

  if (x === 0 && y > 0) {
    return Math.PI / 2;
  }

  if (x === 0 && y < 0) {
    return -Math.PI / 2;
  }

  return 0;
}
