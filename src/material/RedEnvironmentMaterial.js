/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedShareGLSL from "../base/RedShareGLSL.js";
import RedMix from "../base/RedMix.js";

export default class RedEnvironmentMaterial extends RedMix.mix(
	RedBaseMaterial,
	RedMix.diffuseTexture,
	RedMix.normalTexture,
	RedMix.specularTexture,
	RedMix.emissiveTexture,
	RedMix.environmentTexture,
	RedMix.displacementTexture,
	RedMix.basicLightPropertys
) {
	static vertexShaderGLSL = `
	#version 450
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement}    
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
        mat4 normalMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
    } meshUniforms;
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
        float index;
    } meshUniformsIndex;
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;	
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
    } vertexUniforms;
	
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	//#RedGPU#displacementTexture# layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		vVertexPosition = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position, 1.0);
		vNormal = (meshUniforms.normalMatrix[ int(meshUniformsIndex.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		//#RedGPU#displacementTexture# vVertexPosition.xyz += calcDisplacement(vNormal, vertexUniforms.displacementFlowSpeedX, vertexUniforms.displacementFlowSpeedY, vertexUniforms.displacementPower, uv, uDisplacementTexture, uSampler);
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	
	
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${RedShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${RedShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float environmentPower;
    } fragmentUniforms;

	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uSampler;
	//#RedGPU#diffuseTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	//#RedGPU#normalTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform texture2D uNormalTexture;	
	//#RedGPU#specularTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uSpecularTexture;
	//#RedGPU#emissiveTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform texture2D uEmissiveTexture;
	//#RedGPU#environmentTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform textureCube uEnvironmentTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		
	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		//#RedGPU#normalTexture# normalColor = texture(sampler2D(uNormalTexture, uSampler), vUV) ;
		//#RedGPU#useFlatMode# N = getFlatNormal(vVertexPosition.xyz);
		//#RedGPU#normalTexture# N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
	
		//#RedGPU#environmentTexture# vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
		//#RedGPU#environmentTexture# vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uSampler), R);
		//#RedGPU#environmentTexture# diffuseColor = mix(diffuseColor, reflectionColor, fragmentUniforms.environmentPower);
		
		float specularTextureValue = 1.0;
		//#RedGPU#specularTexture# specularTextureValue = texture(sampler2D(uSpecularTexture, uSampler), vUV).r ;
		
		vec4 finalColor = 
		calcDirectionalLight(
			diffuseColor,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
		calcPointLight(
			diffuseColor,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		);
		
		//#RedGPU#emissiveTexture# vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uSampler), vUV);
		//#RedGPU#emissiveTexture# finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		
		outColor = finalColor;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = ['diffuseTexture', 'displacementTexture', 'emissiveTexture', 'environmentTexture', 'normalTexture', 'specularTexture', 'useFlatMode'];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.VERTEX, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.VERTEX, type: "sampled-texture"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 4, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 5, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 6, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 7, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 8, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 9, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", textureDimension: 'cube'}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedX'},
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedY'},
		{size: RedTypeSize.float, valueName: 'displacementPower'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'normalPower'},
		{size: RedTypeSize.float, valueName: 'shininess'},
		{size: RedTypeSize.float, valueName: 'specularPower'},
		{size: RedTypeSize.float4, valueName: 'specularColorRGBA'},
		{size: RedTypeSize.float, valueName: 'emissivePower'},
		{size: RedTypeSize.float, valueName: 'environmentPower'}
	];

	#timeout
	constructor(redGPUContext, diffuseTexture, environmentTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
		super(redGPUContext);
		console.log(diffuseTexture, normalTexture);
		this.diffuseTexture = diffuseTexture;
		this.environmentTexture = environmentTexture;
		this.normalTexture = normalTexture;
		this.emissiveTexture = emissiveTexture;
		this.specularTexture = specularTexture;
		this.displacementTexture = displacementTexture;

		this.needResetBindingInfo = true
	}

	checkTexture(texture, textureName) {
		if (texture) {
			if (texture.GPUTexture) {
				switch (textureName) {
					case 'diffuseTexture' :
						this._diffuseTexture = texture;
						break;
					case 'normalTexture' :
						this._normalTexture = texture;
						break;
					case 'specularTexture' :
						this._specularTexture = texture;
						break;
					case 'emissiveTexture' :
						this._emissiveTexture = texture;
						break;
					case 'environmentTexture' :
						this._environmentTexture = texture;
						break;
					case 'displacementTexture' :
						this._displacementTexture = texture;
						break
				}
				console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture.GPUTexture : '');
				clearTimeout(this.#timeout);
				this.#timeout = setTimeout(_ => {
					this.needResetBindingInfo = true
				}, 500)
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			if(this['_'+textureName]){
				this['_'+textureName] = null;
				this.needResetBindingInfo = true
			}
		}
	}

	resetBindingInfo() {
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_vertex.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_vertex.size
				}
			},
			{binding: 1, resource: this.sampler.GPUSampler},
			{
				binding: 2,
				resource: this._displacementTexture ? this._displacementTexture.GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 3,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			},
			{binding: 4, resource: this.sampler.GPUSampler},
			{
				binding: 5,
				resource: this._diffuseTexture ? this._diffuseTexture.GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 6,
				resource: this._normalTexture ? this._normalTexture.GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 7,
				resource: this._specularTexture ? this._specularTexture.GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 8,
				resource: this._emissiveTexture ? this._emissiveTexture.GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 9,
				resource: this._environmentTexture ? this._environmentTexture.GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
			}


		];
		this._afterResetBindingInfo();
	}
}