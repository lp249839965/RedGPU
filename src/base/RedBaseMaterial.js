/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 23:2:58
 *
 */

"use strict";
import RedShaderModule_GLSL from "../resources/RedShaderModule_GLSL.js";
import RedSampler from "../resources/RedSampler.js";
import RedUUID from "./RedUUID.js";
import RedUniformBuffer from "../buffer/RedUniformBuffer.js";
import RedUniformBufferDescriptor from "../buffer/RedUniformBufferDescriptor.js";

let TABLE = new Map();
let makeUniformBindLayout = function (redGPU, uniformsBindGroupLayoutDescriptor) {
	let uniformsBindGroupLayout;
	if (!(uniformsBindGroupLayout = TABLE.get(uniformsBindGroupLayoutDescriptor))) {
		uniformsBindGroupLayout = redGPU.device.createBindGroupLayout(uniformsBindGroupLayoutDescriptor);
		TABLE.set(uniformsBindGroupLayoutDescriptor, uniformsBindGroupLayout)
	}
	return uniformsBindGroupLayout
};
export default class RedBaseMaterial extends RedUUID {
	get redGPU() {
		return this.#redGPU;
	}

	set redGPU(value) {
		this.#redGPU = value;
	}

	static uniformBufferDescriptor_empty = []


	uniformBufferDescriptor_vertex;
	uniformBufferDescriptor_fragment;
	GPUBindGroupLayout;
	vShaderModule;
	fShaderModule;
	vertexStage;
	fragmentStage;
	sampler;
	bindings;
	#redGPU;
	//
	uniformBuffer_vertex;
	uniformBuffer_fragment;

	constructor(redGPU) {
		super();
		let vShaderModule, fShaderModule;
		let materialClass = this.constructor;
		let vertexGLSL = materialClass.vertexShaderGLSL;
		let fragmentGLSL = materialClass.fragmentShaderGLSL;
		let programOptionList = materialClass.PROGRAM_OPTION_LIST || [];
		let vKey = materialClass.name + '_vertex';
		let fKey = materialClass.name + '_fragment';
		if (!(vShaderModule = TABLE.get(vKey))) TABLE.set(vKey, vShaderModule = new RedShaderModule_GLSL(redGPU, 'vertex', materialClass, vertexGLSL, programOptionList));
		if (!(fShaderModule = TABLE.get(fKey))) TABLE.set(fKey, fShaderModule = new RedShaderModule_GLSL(redGPU, 'fragment', materialClass, fragmentGLSL, programOptionList));

		if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : uniformBufferDescriptor_vertex 를 정의해야함`);
		if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : uniformBufferDescriptor_fragment 를 정의해야함`);
		if (!materialClass.uniformsBindGroupLayoutDescriptor) throw  new Error(`${materialClass.name} : uniformsBindGroupLayoutDescriptor 를  정의해야함`);

		this.uniformBufferDescriptor_vertex = new RedUniformBufferDescriptor(materialClass.uniformBufferDescriptor_vertex);
		this.uniformBufferDescriptor_fragment = new RedUniformBufferDescriptor(materialClass.uniformBufferDescriptor_fragment);
		this.GPUBindGroupLayout = makeUniformBindLayout(redGPU, materialClass.uniformsBindGroupLayoutDescriptor);
		this.vShaderModule = vShaderModule;
		this.fShaderModule = fShaderModule;

		this.uniformBuffer_fragment = new RedUniformBuffer(redGPU);
		this.uniformBuffer_vertex = new RedUniformBuffer(redGPU);
		this.sampler = new RedSampler(redGPU);
		this.#redGPU = redGPU;
		console.log('TABLE', TABLE)
	}

	checkTexture(texture, textureName) {
		throw new Error(`${this.constructor.name} : must override!!!`)
	}

	resetBindingInfo() {
		throw new Error(`${this.constructor.name} : must override!!!`)
	}

	searchModules() {
		let tKey = [this.constructor.name];
		this.constructor.PROGRAM_OPTION_LIST.forEach(key => {
			if (this[key]) tKey.push(key);
		});
		tKey = tKey.join('_')
		console.log('searchModules',tKey)
		this.vShaderModule.searchShaderModule(tKey);
		this.fShaderModule.searchShaderModule(tKey);
		console.log(this.vShaderModule);
		console.log(this.fShaderModule);
	}

	setUniformBindGroupDescriptor() {
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
	}
}