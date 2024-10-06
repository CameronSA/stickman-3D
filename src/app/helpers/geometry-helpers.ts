import { Vector3 } from 'three';

// Note: Uses a taylor approximation
export function calculateArcAngle(
  startPosition: Vector3,
  endPosition: Vector3,
  arcLength: number
): number {
  const chordLength = startPosition.distanceTo(endPosition);
  return Math.sqrt(24 * (1 - chordLength / arcLength));
}

export function calculateArcRadius(
  arcLength: number,
  arcAngle: number
): number {
  return arcLength / arcAngle;
}

export function calculateArcCenters(
  startPosition: Vector3,
  endPosition: Vector3,
  arcRadius: number
): [Vector3, Vector3] {
  const squareDifference =
    square(startPosition.x) +
    square(startPosition.y) -
    square(endPosition.x) -
    square(endPosition.y);

  const xDiff = endPosition.x - startPosition.x;
  const yDiff = endPosition.y - startPosition.y;

  // Quadratic equation
  const a = square(yDiff / xDiff) - 1;
  const b = endPosition.y + yDiff / square(xDiff);
  const c =
    square(squareDifference) / (4 * square(xDiff)) -
    square(endPosition.y) -
    square(arcRadius);

  const determinant = Math.sqrt(square(b) - 4 * a * c);

  const yCoord1 = (b + determinant) / (2 * a);
  const yCoord2 = (b - determinant) / (2 * a);

  const xCoord1 = (-squareDifference - 2 * yCoord1 * yDiff) / (2 * xDiff);
  const xCoord2 = (-squareDifference - 2 * yCoord2 * yDiff) / (2 * xDiff);

  const zCoord = (startPosition.z + endPosition.z) / 2;

  return [
    new Vector3(xCoord1, yCoord1, zCoord),
    new Vector3(xCoord2, yCoord2, zCoord),
  ];
}

function square(val: number): number {
  return val * val;
}
