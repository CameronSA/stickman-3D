import { ColorRepresentation, Fog, Vector3 } from 'three';

export const FPS: number = 60;
export const FOV: number = 75;
export const NEARCLIPPINGPLANE: number = 0.1;
export const FARCLIPPINGPLANE: number = 1000;
export const DEFAULTBACKGROUND: ColorRepresentation = 0xeeeeee;
export const DEFAULTFLOOR: ColorRepresentation = 0xdddddd;
export const DEFAULTCAMERAPOSITION: Vector3 = new Vector3(10, 10, 20);
export const DEFAULTLIGHTCOLOR: ColorRepresentation = 0xffffff;
export const DEFAULTMOUSESENSITIVITY: number = 0.02;
export const DEFAULTFOG = new Fog(DEFAULTBACKGROUND, 10, 300);
export const DEFAULTWORLDSIZE: number = 1000;
