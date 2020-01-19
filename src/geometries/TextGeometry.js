/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  textDirection: <Vector3>, // direction of the text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel
 *  bevelOffset: <float> // how far from text outline does bevel start
 * }
 */

import { Geometry } from '../core/Geometry.js';
import { ExtrudeBufferGeometry } from './ExtrudeGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Vector2 } from '../math/Vector2.js';

// TextGeometry

function TextGeometry( text, parameters ) {

	Geometry.call( this );

	this.type = 'TextGeometry';

	this.parameters = {
		text: text,
		parameters: parameters
	};

	this.fromBufferGeometry( new TextBufferGeometry( text, parameters ) );
	this.mergeVertices();

}

TextGeometry.prototype = Object.create( Geometry.prototype );
TextGeometry.prototype.constructor = TextGeometry;

// TextBufferGeometry

function TextBufferGeometry( text, parameters ) {

	parameters = parameters || {};

	var font = parameters.font;

	if ( ! ( font && font.isFont ) ) {

		console.error( 'THREE.TextGeometry: font parameter is not an instance of THREE.Font.' );
		return new Geometry();

	}

	var shapes = font.generateShapes( text, parameters.size );

	// translate parameters to ExtrudeGeometry API

	parameters.depth = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	if ( parameters.textDirection === undefined || parameters.textDirection.equals( new Vector2( 1, 0 ) ) ) {
		ExtrudeBufferGeometry.call( this, shapes, parameters );
	} else {
		BufferGeometry.call ( this );

		var verticesArray = [],
			uvArray = [];
		
		var xOffset = 0,
			yOffset = 0,
			prevXOffset = 0,
			lineXOffset = 0,
			lineYOffset = 0;

		var textDirectionNormal = parameters.textDirection.clone().normalize();
			textDirectionNormal.set ( -textDirectionNormal.y, textDirectionNormal.x ).normalize();

		var lineHeight = ( font.data.boundingBox.yMax - font.data.boundingBox.yMin + font.data.underlineThickness ) * (parameters.size / font.data.resolution);

		shapes.forEach(shape => {
			var geo = new ExtrudeBufferGeometry( shape, parameters );
			geo.computeBoundingBox();

			xOffset = lineXOffset + geo.boundingBox.min.x;
			if( prevXOffset > xOffset ){
				//new line
				lineXOffset -= lineHeight * textDirectionNormal.x;
				lineYOffset -= lineHeight * textDirectionNormal.y;

				xOffset = lineXOffset + geo.boundingBox.min.x;
				yOffset = lineYOffset;
			} else {
				yOffset += geo.boundingBox.max.y - geo.boundingBox.min.y;
			}

			var scaledDirection = parameters.textDirection.clone().multiply( new Vector2( xOffset, yOffset ) );
			
			var vertices = geo.getAttribute( 'position' ).array;
			for (var i = 0; i < vertices.length; i += 3){
				vertices[i] += scaledDirection.x - xOffset;
				vertices[i + 1] += scaledDirection.y - yOffset;
			}

			verticesArray.push( ...vertices );
			uvArray.push( ...geo.getAttribute( 'uv' ).array );
			prevXOffset = xOffset;
		});

		this.setAttribute( 'position', new Float32BufferAttribute( verticesArray, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvArray, 2 ) );

		this.computeVertexNormals();
	}

	this.type = 'TextBufferGeometry';

}

TextBufferGeometry.prototype = Object.create( ExtrudeBufferGeometry.prototype );
TextBufferGeometry.prototype.constructor = TextBufferGeometry;


export { TextGeometry, TextBufferGeometry };
