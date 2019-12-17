/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.16 20:34:19
 *
 */
import RedGPU from "./src/RedGPU.js";

const cvs = document.createElement('canvas');

let testMat_color, testMat_colorPhong, testMat_bitmap, testMat_standard_diffuse, testMat_standard_diffuse_normal,
	testMat_standard_diffuse_normal_displacement, testMat_colorPhongTexture_normal,
	testMat_colorPhongTexture_normal_displacement,
	testMat_environment;
new RedGPU.RedGPUContext(
	cvs,
	function () {
		document.body.appendChild(cvs);
		let textureLoader = new RedGPU.RedTextureLoader(
			this,
			[
				'assets/UV_Grid_Sm.jpg',
				'assets/Brick03_col.jpg',
				'assets/Brick03_nrm.jpg',
				'assets/crate.png',
				'assets/Brick03_disp.jpg',
				'assets/specular.png',
				'assets/emissive.jpg',
				[
					'./assets/cubemap/SwedishRoyalCastle/px.jpg',
					'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
					'./assets/cubemap/SwedishRoyalCastle/py.jpg',
					'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
					'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
					'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
				]
			],
			_ => {
				console.log('텍스쳐 로딩완료', textureLoader)
				let MAX = 8000;
				let i = MAX;
				let tView, tView2;
				let tScene = new RedGPU.RedScene();
				let tScene2 = new RedGPU.RedScene();
				let tGrid = new RedGPU.RedGrid(this)
				let tAxis = new RedGPU.RedAxis(this)
				let tCamera = new RedGPU.RedObitController(this)
				let tCamera2 = new RedGPU.RedObitController(this)
				tGrid.centerColor = '#ff0000'
				tScene2.backgroundColor = '#ff0000'

				tView = new RedGPU.RedView(this, tScene, tCamera)
				tView2 = new RedGPU.RedView(this, tScene2, tCamera2)
				tView2.setSize(150, 150)
				tView2.setLocation(0, 0)


				tCamera.targetView = tView // optional
				tCamera2.targetView = tView2 // optional
				tCamera.distance = 50
				tCamera.speedDistance = 10

				tScene.grid = tGrid;
				tScene.axis = tAxis;
				let tLight
				tLight = new RedGPU.RedDirectionalLight('#0000ff', 0.5)
				tLight.x = 10
				tLight.y = 10
				tLight.z = 10
				tScene.addLight(tLight)
				//
				tLight = new RedGPU.RedDirectionalLight('#ff0000', 0.5)
				tLight.x = -10
				tLight.y = -10
				tLight.z = -10
				tScene.addLight(tLight)

				tLight = new RedGPU.RedDirectionalLight('#00ff00', 0.5)
				tLight.x = -10
				tLight.y = 20
				tLight.z = 20
				tScene.addLight(tLight)


				let i2 = 0
				let testColor = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#ffff00']
				while (i2--) {
					let tLight = new RedGPU.RedPointLight(testColor[i2 % testColor.length], 1, 1, Math.random() * 25)

					tScene.addLight(tLight)
				}

				this.addView(tView)
				let tEffect = new RedGPU.RedPostEffect_Bloom(this);
				let tEffect2 = new RedGPU.RedPostEffect_DoF(this);
				tEffect.bloomStrength = 0.35
				tEffect2.focusLength = 1000
				tView.postEffect.addEffect(tEffect)
				tView.postEffect.addEffect(tEffect2)
				// tView.postEffect.addEffect(new RedGPU.RedPostEffect_Gray(this))
				this.addView(tView2)


				let testCubeTexture = textureLoader.getTextureByIndex(7)

				testMat_environment = new RedGPU.RedEnvironmentMaterial(this, textureLoader.getTextureByIndex(1), testCubeTexture)
				testMat_color = new RedGPU.RedColorMaterial(this, '#ffff12');
				testMat_colorPhong = new RedGPU.RedColorPhongMaterial(this, '#ffffff');
				testMat_colorPhongTexture_normal = new RedGPU.RedColorPhongTextureMaterial(this, '#fff253', 1, textureLoader.getTextureByIndex(2))
				testMat_colorPhongTexture_normal_displacement = new RedGPU.RedColorPhongTextureMaterial(this, '#341fff', 1, textureLoader.getTextureByIndex(2), textureLoader.getTextureByIndex(5), textureLoader.getTextureByIndex(6), textureLoader.getTextureByIndex(4))

				testMat_bitmap = new RedGPU.RedBitmapMaterial(this, textureLoader.getTextureByIndex(0));
				testMat_standard_diffuse = new RedGPU.RedStandardMaterial(this, textureLoader.getTextureByIndex(1), null, textureLoader.getTextureByIndex(5), textureLoader.getTextureByIndex(6));
				testMat_standard_diffuse_normal = new RedGPU.RedStandardMaterial(this, textureLoader.getTextureByIndex(0), textureLoader.getTextureByIndex(2), textureLoader.getTextureByIndex(5), textureLoader.getTextureByIndex(6));
				testMat_standard_diffuse_normal_displacement = new RedGPU.RedStandardMaterial(this, textureLoader.getTextureByIndex(1), textureLoader.getTextureByIndex(2), textureLoader.getTextureByIndex(5), textureLoader.getTextureByIndex(6), textureLoader.getTextureByIndex(4));
				testMat_standard_diffuse_normal_displacement.displacementPower = 1
				testMat_standard_diffuse_normal_displacement.displacementFlowSpeedX = 0.1
				testMat_standard_diffuse_normal_displacement.displacementFlowSpeedY = 0.1

				testMat_colorPhongTexture_normal_displacement.displacementPower = 1
				testMat_colorPhongTexture_normal_displacement.displacementFlowSpeedX = 0.01
				testMat_colorPhongTexture_normal_displacement.displacementFlowSpeedY = 0.01


				let mats = [testMat_color, testMat_colorPhong, testMat_bitmap, testMat_standard_diffuse, testMat_standard_diffuse_normal, testMat_standard_diffuse_normal_displacement]
				let changeNum = 0
				// setInterval(_ => {
				// 	let tChildren = tView.scene.children
				// 	let i = tChildren.length;
				// 	changeNum++
				// 	console.log('안오냐',mats[changeNum%mats.length])
				//
				// 	while (i--) {
				//
				// 		tChildren[i].material = mats[changeNum%mats.length]
				// 	}
				// }, 2500)

				let randomGeometry = _ => {
					return new RedGPU.RedSphere(this, 0.5, 16, 16, 16)
					return Math.random() > 0.5
						? new RedGPU.RedSphere(this, 0.5, 16, 16, 16) :
						Math.random() > 0.5
							? new RedGPU.RedCylinder(this, 0, 1, 2, 16, 16) :
							Math.random() > 0.5 ? new RedGPU.RedBox(this) : new RedGPU.RedPlane(this)
				}
				let i3 = 100
				while (i3--) {
					let testMesh = new RedGPU.RedMesh(
						this,
						new RedGPU.RedSphere(this, 0.5, 32, 32, 32),
						testMat_bitmap
					);
					testMesh.x = Math.random() * 30 - 15
					testMesh.y = Math.random() * 30 - 15
					testMesh.z = Math.random() * 30 - 15
					tScene2.addChild(testMesh)
				}
				let testMesh = new RedGPU.RedMesh(
					this,
					new RedGPU.RedSphere(this, 0.5, 32, 32, 32),
					testMat_standard_diffuse
				);
				testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = 20
				testMesh.x = -25
				tScene.addChild(testMesh)

				testMesh = new RedGPU.RedMesh(
					this,
					new RedGPU.RedSphere(this, 0.5, 32, 32, 32),
					testMat_environment
				);
				testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = 20
				testMesh.x = 25
				tScene.addChild(testMesh)

				let division = MAX / 8
				while (i--) {
					let testMesh = new RedGPU.RedMesh(
						this,
						randomGeometry(),
						i > division * 7 ? testMat_color
							: i > division * 6 ? testMat_colorPhong
							: i > division * 5 ? testMat_bitmap
								: i > division * 4 ? testMat_standard_diffuse
									: i > division * 3 ? testMat_standard_diffuse_normal
										: i > division * 2 ? testMat_standard_diffuse_normal_displacement
											: i > division * 1 ? testMat_colorPhongTexture_normal : testMat_colorPhongTexture_normal_displacement
					);
					testMesh.x = Math.random() * 3000 - 1500;
					testMesh.y = Math.random() * 3000 - 1500;
					testMesh.z = Math.random() * 3000 - 1500;
					testMesh.rotationX = testMesh.rotationY = testMesh.rotationZ = Math.random() * 360;
					testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = Math.random() * 25 + 35;
					if (testMesh.material == testMat_standard_diffuse_normal_displacement) testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = 55
					tScene.addChild(testMesh)
					// //
					// let testMesh2 = new RedGPU.RedMesh(
					// 	this,
					// 	new RedGPU.RedSphere(this, 1, 16, 16, 16),
					// 	testMat_colorPhong
					// );
					// testMesh2.x = 2
					// testMesh2.scaleX = testMesh2.scaleY = testMesh2.scaleZ = 0.5;
					// testMesh.addChild(testMesh2)
					//
					// let testMesh3 = new RedGPU.RedMesh(
					// 	this,
					// 	new RedGPU.RedSphere(this),
					// 	testMat_bitmap
					// );
					// testMesh3.x = 2
					// testMesh3.scaleX = testMesh3.scaleY = testMesh3.scaleZ = 0.5;
					// testMesh2.addChild(testMesh3)

				}


				let renderer = new RedGPU.RedRender();
				let render = time => {


					tLight.x = Math.sin(time / 1000)
					tLight.y = Math.cos(time / 500)
					tLight.z = Math.cos(time / 750)
					renderer.render(time, this);
					testMat_standard_diffuse_normal.emissivePower = testMat_standard_diffuse_normal_displacement.emissivePower = testMat_colorPhongTexture_normal_displacement.emissivePower = Math.abs(Math.sin(time / 250))
					testMat_colorPhongTexture_normal_displacement.displacementPower = testMat_standard_diffuse_normal_displacement.displacementPower = Math.sin(time / 1000) * 25
					testMat_standard_diffuse.normalPower = testMat_standard_diffuse_normal.normalPower = testMat_standard_diffuse_normal_displacement.normalPower = Math.abs(Math.sin(time / 1000)) + 1
					testMat_standard_diffuse.shininess = testMat_standard_diffuse.shininess = testMat_standard_diffuse_normal.shininess = Math.abs(Math.sin(time / 1000)) * 64 + 8
					testMat_standard_diffuse.specularPower = Math.abs(Math.sin(time / 1000)) * 5
					testMat_colorPhong.shininess = 8


					let tChildren = tView.scene.pointLightList
					let i = tChildren.length;
					while (i--) {
						tChildren[i].x = Math.sin(time / 1000 + i * 10 + Math.PI * 2 / tChildren.length * i * 3) * 150
						tChildren[i].y = Math.sin(time / 2000 + i * 10 + Math.PI * 2 / tChildren.length * i * 3) * 150
						tChildren[i].z = Math.cos(time / (2000 + i * 10) + Math.PI * 2 / tChildren.length * i * 3) * 150
					}

					tChildren = tView.scene.children
					i = tChildren.length


					while (i--) {

						tChildren[i]._rotationX += 1
						tChildren[i]._rotationY += 1
						tChildren[i]._rotationZ += 1
						tChildren[i].dirtyTransform = 1


					}


					requestAnimationFrame(render);
				};
				requestAnimationFrame(render);
				setTestUI(this, tView, tScene, testCubeTexture)
			}
		)

	}
);

let setTestUI = function (redGPUContextContext, tView, tScene, testCubeTexture) {

	let tFolder;

	let skyBox = new RedGPU.RedSkyBox(redGPUContextContext, testCubeTexture)
	tScene.skyBox = skyBox
	let testSceneUI = new dat.GUI({});
	let testSceneData = {
		useSkyBox: true,
		useGrid: true,
	}
	testSceneUI.width = 350
	tFolder = testSceneUI.addFolder('RedScene')
	tFolder.open()
	tFolder.add(testSceneData, 'useSkyBox').onChange(v => tScene.skyBox = v ? skyBox : null)
	tFolder.add(testSceneData, 'useGrid').onChange(v => tScene.grid = v ? new RedGPU.RedGrid(redGPUContextContext) : null)
	tFolder.addColor(tScene, 'backgroundColor')
	tFolder.add(tScene, 'backgroundColorAlpha', 0, 1, 0.01)
	tFolder = testSceneUI.addFolder('RedView')
	tFolder.open()
	let viewTestData = {
		setLocationTest1: function () {
			tView.setLocation(0, 0)
		},
		setLocationTest2: function () {
			tView.setLocation(100, 100)
		},
		setLocationTest3: function () {
			tView.setLocation('50%', 100)
		},
		setLocationTest4: function () {
			tView.setLocation('40%', '40%')
		},
		setSizeTest1: function () {
			tView.setSize(200, 200)
		},
		setSizeTest2: function () {
			tView.setSize('50%', '100%')
		},
		setSizeTest3: function () {
			tView.setSize('50%', '50%')
		},
		setSizeTest4: function () {
			tView.setSize('20%', '20%')
		},
		setSizeTest5: function () {
			tView.setSize('100%', '100%')
		}
	}
	tFolder.add(viewTestData, 'setLocationTest1').name('setLocation(0,0)');
	tFolder.add(viewTestData, 'setLocationTest2').name('setLocation(100,100)');
	tFolder.add(viewTestData, 'setLocationTest3').name('setLocation(50%,100)');
	tFolder.add(viewTestData, 'setLocationTest4').name('setLocation(40%,40%)');
	tFolder.add(viewTestData, 'setSizeTest1').name('setSize(200,200)');
	tFolder.add(viewTestData, 'setSizeTest2').name('setSize(50%,100%)');
	tFolder.add(viewTestData, 'setSizeTest3').name('setSize(50%,50%)');
	tFolder.add(viewTestData, 'setSizeTest4').name('setSize(20%,20%)');
	tFolder.add(viewTestData, 'setSizeTest5').name('setSize(100%,100%)');

	let testUI = new dat.GUI({});
	let testData = {
		useFloatMode: false,
		useDepthTest: true,
		depthTestFunc: "less",
		cullMode: "back",
		primitiveTopology: "triangle-list"
	};
	tFolder = testUI.addFolder('Test Material option')
	tFolder.add(testData, 'useFloatMode').onChange(v => {
		testMat_color,
			testMat_colorPhong.useFlatMode = v
		testMat_standard_diffuse.useFlatMode = v
		testMat_standard_diffuse_normal.useFlatMode = v
		testMat_standard_diffuse_normal_displacement.useFlatMode = v
		testMat_colorPhongTexture_normal.useFlatMode = v
		testMat_colorPhongTexture_normal_displacement.useFlatMode = v

	});
	tFolder = testUI.addFolder('RedMesh')
	tFolder.open()


	tFolder.add(testData, 'useDepthTest').onChange(v => tScene.children.forEach(tMesh => tMesh.useDepthTest = v));

	tFolder.add(testData, 'depthTestFunc', [
		"never",
		"less",
		"equal",
		"less-equal",
		"greater",
		"not-equal",
		"greater-equal",
		"always"
	]).onChange(v => tScene.children.forEach(tMesh => tMesh.depthTestFunc = v));
	tFolder.add(testData, 'cullMode', [
		"none",
		"front",
		"back"
	]).onChange(v => tScene.children.forEach(tMesh => tMesh.cullMode = v));

	tFolder.add(testData, 'primitiveTopology', [
		"point-list",
		"line-list",
		"line-strip",
		"triangle-list",
		"triangle-strip"
	]).onChange(v => tScene.children.forEach(tMesh => tMesh.primitiveTopology = v));
}