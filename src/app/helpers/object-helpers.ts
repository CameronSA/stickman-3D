import * as THREE from 'three';

export function generateSphere(
  radius: number,
  position: THREE.Vector3,
  material: THREE.Material
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);

  return mesh;
}

export function addWireframe(obj: THREE.Mesh) {
  var wireGeometry = new THREE.EdgesGeometry(obj.geometry);
  var wireframe = new THREE.LineSegments(
    wireGeometry,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );

  obj.add(wireframe);
}
