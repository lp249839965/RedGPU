/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";

export default class Camera extends BaseObject3D {
	#up = new Float32Array([0, 1, 0]);
	fov = 60;
	nearClipping = 0.1;
	farClipping = 100000;
	constructor(redGPUContext) {
		super(redGPUContext)
	}

	lookAt(x, y, z) {
		mat4.lookAt(this.matrix, [this.x, this.y, this.z], [x, y, z], this.#up);
	}
}