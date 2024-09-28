import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { throttle } from 'lodash-es';
import { FPS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private lastRenderTime: number = new Date().getTime();

  constructor() {}

  createThreeJsBox(): void {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var geo = new THREE.EdgesGeometry(cube.geometry); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    var wireframe = new THREE.LineSegments(geo, mat);
    cube.add(wireframe);

    camera.position.z = 5;

    const animate = () => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastRenderTime > 1000 / FPS) {
        this.lastRenderTime += 1000 / FPS;
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
    };

    renderer.setClearColor(0xbbbbbbbb);
    renderer.setAnimationLoop(animate);

    window.addEventListener(
      'resize',
      throttle(
        () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        },
        1000 / FPS,
        { trailing: true }
      ),
      false
    );
  }
}
