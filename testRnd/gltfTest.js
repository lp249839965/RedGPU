/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 9:45:10
 *
 */

import RedGPU from "../src/RedGPU.js";


const cvs = document.createElement('canvas');
document.body.appendChild(cvs);

new RedGPU.RedGPUContext(
	cvs,
	function (v, reason) {

		if (!v) {
			console.log('reason', reason)
			return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
		}
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedObitController(this)
		let tCamera2 = new RedGPU.RedObitController(this)
		tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0

		tCamera.distance = 10
		tCamera.speedDistance = 1


		tView = new RedGPU.RedView(this, tScene, tCamera)

		tCamera.targetView = tView // optional

		tScene.grid = tGrid

		tScene.axis = new RedGPU.RedAxis(this)
		let tLight
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = 3
		tLight.y = 2
		tLight.z = 3
		tScene.addLight(tLight)
		//
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = -100
		tLight.y = -100
		tLight.z = -100
		tScene.addLight(tLight)

		// tLight = new RedGPU.RedDirectionalLight()
		// tLight.x = 100
		// tLight.y = -100
		// tLight.z = 100
		// tScene.addLight(tLight)

		tLight = new RedGPU.RedAmbientLight()
		tScene.addLight(tLight)

		this.addView(tView)

		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'NormalTangentMirrorTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'TextureSettingsTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		tMesh.z = -5
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );


		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'https://cdn.rawgit.com/KhronosGroup/glTF-Blender-Exporter/0e23c773bf27dad67d2c25f060370d6fa012d87d/polly/', 'project_polly.gltf',
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
		// 		// tScene.addChild({children:[tMesh.children[2]]})
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	// new RedGPU.RedBitmapCubeTexture(this, [
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 	//
		// 	// ])
		// );

		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/', // assetRootPath
		// 	'Sponza.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
		// 		// tScene.addChild({children:[tMesh.children[2]]})
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'AlphaBlendModeTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
		// 		// tScene.addChild({children:[tMesh.children[2]]})
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	// new RedGPU.RedBitmapCubeTexture(this, [
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 	//
		// 	// ])
		// );
		// let self = this
		// new RedGPU.RedGLTFLoader(self, '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 	tScene.addChild(v['resultMesh'])
		// 	v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.0012
		// 	v['resultMesh'].x = 0
		// 	var i = 40
		// 	while (i--) {
		// 		setTimeout(_=>{
		// 			new RedGPU.RedGLTFLoader(self,  '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 				tScene.addChild(v['resultMesh'])
		// 				v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.002
		// 				v['resultMesh'].x = Math.random() * 30 - 15
		// 				v['resultMesh'].z = Math.random() * 30 - 15
		//
		// 			})
		// 		},i*50)
		// 	}
		// })

		new RedGPU.RedGLTFLoader(
			this, // redGL
			'../assets/gltf/', // assetRootPath
			'DamagedHelmet.gltf', // fileName
			function (v) { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				// tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
				// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
				// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
				// tScene.addChild({children:[tMesh.children[2]]})
				tScene.addChild(tMesh)


			},
			new RedGPU.RedBitmapCubeTexture(this, [
				'../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nz.jpg'

			])
		);
		//
		// tScene.skyBox = new RedGPU.RedSkyBox(this, new RedGPU.RedBitmapCubeTexture(this, [
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// ]))
		// new RedGPU.RedBitmapCubeTexture(this, [
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// ])

		let renderer = new RedGPU.RedRender();
		let render = time => {

			// tLight.x = Math.sin(time / 1000)
			// tLight.y = Math.cos(time / 500)
			// tLight.z = Math.cos(time / 750)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)