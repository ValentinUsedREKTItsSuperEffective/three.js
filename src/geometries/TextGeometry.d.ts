import { Font } from './../extras/core/Font';
import { ExtrudeGeometry, ExtrudeBufferGeometry } from './ExtrudeGeometry';
import { Vector3 } from '../math/Vector3';

export interface TextGeometryParameters {
	font?: Font;
	size?: number;
	height?: number;
	textDirection?: Vector3;
	curveSegments?: number;
	bevelEnabled?: boolean;
	bevelThickness?: number;
	bevelSize?: number;
	bevelOffset?: number;
	bevelSegments?: number;
}

export class TextBufferGeometry extends ExtrudeBufferGeometry {

	constructor( text: string, parameters?: TextGeometryParameters );

	parameters: {
		font: Font;
		size: number;
		height: number;
		textDirection: Vector3;
		curveSegments: number;
		bevelEnabled: boolean;
		bevelThickness: number;
		bevelSize: number;
		bevelOffset: number;
		bevelSegments: number;
	};

}

export class TextGeometry extends ExtrudeGeometry {

	constructor( text: string, parameters?: TextGeometryParameters );

	parameters: {
		font: Font;
		size: number;
		height: number;
		textDirection: Vector3;
		curveSegments: number;
		bevelEnabled: boolean;
		bevelThickness: number;
		bevelSize: number;
		bevelOffset: number;
		bevelSegments: number;
	};

}
