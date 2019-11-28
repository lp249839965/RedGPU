/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 23:2:58
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedShareGLSL from "../base/RedShareGLSL.js";

import RedMaterialPreset from "./RedMaterialPreset.js";
import RedColorMaterial from "./RedColorMaterial.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";

export default class RedColorPhongMaterial extends RedMaterialPreset.mix(
	RedColorMaterial,
	RedMaterialPreset.basicLightPropertys
) {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout(set = 2,binding = 0) uniform MeshUniforms {
        mat4 modelMatrix;
        mat4 normalMatrix;
    } meshUniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;
	layout(location = 2) out vec4 vVertexPosition;
	
	void main() {
		vVertexPosition = meshUniforms.modelMatrix* vec4(position,1.0);
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
		
		vNormal = (meshUniforms.normalMatrix * vec4(normal,1.0)).xyz;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniformsWithLight}
	layout(set = 3,binding = 1) uniform Uniforms {
        vec4 color;
        float shininess; float specularPower;
	    vec4 specularColor;
    } uniforms;
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 2) in vec4 vVertexPosition;
	layout(location = 0) out vec4 outColor;
	void main() {
		vec3 N = normalize(vNormal);
		calcDirectionalLight(
			uniforms.color,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			uniforms.shininess,
			uniforms.specularPower,
			uniforms.specularColor
		);
	    calcPointLight(
			uniforms.color,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			uniforms.shininess,
			uniforms.specularPower,
			uniforms.specularColor,
			vVertexPosition.xyz
		);
	
	    vec4 finalColor = LA + LD + LS;
		
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor = {
		bindings: [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX,
				type: "uniform-buffer"
			},
			{
				binding: 1,
				visibility: GPUShaderStage.FRAGMENT,
				type: "uniform-buffer"
			}
		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float4, valueName: 'colorRGBA', targetKey: 'material'},
		{size: RedTypeSize.float, valueName: 'shininess', targetKey: 'material'},
		{size: RedTypeSize.float, valueName: 'specularPower', targetKey: 'material'},
		{
			size: RedTypeSize.float4,
			valueName: 'specularColorRGBA',
			targetKey: 'material'
		},
	]


	constructor(redGPU, color = '#ff0000', alpha = 1) {
		super(redGPU, color, alpha);
	}

	resetBindingInfo() {
		this.bindings = null;
		this.searchModules();
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: null,
					offset: 0,
					size: this.uniformBufferDescriptor_vertex.size
				}
			},
			{
				binding: 1,
				resource: {
					buffer: null,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			}
		];
		this.setUniformBindGroupDescriptor();
		this.updateUUID();
	}
}
