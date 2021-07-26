<template lang="pug">
    #container
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default {
    data() {
        return {
            camera: null,
            scene: null,
            renderer: null,
            mesh: null,
            phoneObject: null
        }
    },
    methods: {
        // three
        // init: function() {
        //     let container = document.getElementById('container');

        //     this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        //     this.camera.position.z = 1;

        //     this.scene = new Three.Scene();

        //     let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
        //     let material = new Three.MeshNormalMaterial();

        //     this.mesh = new Three.Mesh(geometry, material);
        //     this.scene.add(this.mesh);

        //     this.renderer = new Three.WebGLRenderer({antialias: true});
        //     this.renderer.setSize(container.clientWidth, container.clientHeight);
        //     container.appendChild(this.renderer.domElement);

        //     this.mesh.rotation.x += 2;
        //     this.mesh.rotation.y += 2;

        //     this.renderer.render(this.scene, this.camera);  

        // },
        animate: function() {
            requestAnimationFrame(this.animate);
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.02;
            this.renderer.render(this.scene, this.camera);
        },
        loaddd() {
            // if (this.isLoading3D) {
            //     setTimeout(this.load, 1000);
            //     return;
            // }
            this.isLoading3D = true;
            let container = document.getElementById('container');

            const dimension = {
                width: container.offsetWidth,
                height: container.offsetHeight
            };

            if (!this.scene) {
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(60, dimension.width / dimension.height, 0.01, 1000);
                this.scene.add(this.camera);

                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                this.renderer.setSize(dimension.width, dimension.height);
                this.renderer.physicallyCorrectLights = true;
                this.renderer.gammaOutput = true;
                this.renderer.gammaFactor = 2.2;
                this.renderer.setClearColor(0x000000, 0);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(dimension.width, dimension.height);
                container.appendChild(this.renderer.domElement);

                const light1 = new THREE.AmbientLight(0xffffff, 3.1);
                light1.name = 'ambient_light';
                this.camera.add(light1);
            }

            var loader = new GLTFLoader();
            var dracoLoader = new DRACOLoader();

            dracoLoader.setDecoderPath('../assets/3d/');
            loader.setDRACOLoader(dracoLoader);

            const phone3d = '../assets/3d/scene.gltf';
            const matcap = new THREE.TextureLoader().load('../assets/matcap_03.jpg', () => {
                matcap.encoding = THREE.sRGBEncoding;

                loader.load(
                    phone3d,
                    gltf => {
                        if (this.phoneObject) {
                            // Remove previously loaded object
                            this.scene.remove(this.phoneObject);
                        }
                        this.phoneObject = gltf.scene || gltf.scenes[0];

                        const box = new THREE.Box3().setFromObject(this.phoneObject);
                        const size = box.getSize(new THREE.Vector3()).length();
                        const center = box.getCenter(new THREE.Vector3());

                        this.phoneObject.position.x += this.phoneObject.position.x - center.x;
                        this.phoneObject.position.y += this.phoneObject.position.y - center.y;
                        this.phoneObject.position.z += this.phoneObject.position.z - center.z;

                        this.camera.position.copy(center);
                        //this.camera.position.x += size / 10.0;
                        //this.camera.position.y -= size / 3.0;
                        this.camera.position.z += size;
                        this.defaultCameraZ = this.camera.position.z;
                        this.camera.lookAt(center);

                        //Add material to iphone
                        this.phoneObject.children[0].material = new THREE.MeshMatcapMaterial({
                            matcap: matcap
                        });

                        //Add materials to screen
                        //this.phoneObject.children[0].children[0].material = materialScreen;
                        //this.phoneObject.children[0].children[1].material = materialNav;

                        for (let i = 0; i < this.phoneObject.children[0].children.length; i++) {
                            if (this.phoneObject.children[0].children[i].name === 'Ecran001') {
                                this.screenObject = this.phoneObject.children[0].children[i];
                            } else if (this.phoneObject.children[0].children[i].name === 'header_footer') {
                                this.headerFooterObject = this.phoneObject.children[0].children[i];
                            }
                        }

                        this.headerFooterObject.material = this.screenObject.material.clone();
                        this.headerFooterObject.material.map = this.screenObject.material.map.clone();
                        this.headerFooterObject.material.map.needsUpdate = true;

                        this.scene.add(this.phoneObject);

                        if (!this.isAnimated) {
                            if (this.props.isForward) {
                                this.forward(0, 0);
                            } else {
                                this.backward(0, 0);
                            }
                            if (this.props.onLoadingDone) {
                                this.props.onLoadingDone();
                            }
                        }

                        if (!this.isAnimated) {
                            this.isAnimated = true;
                            requestAnimationFrame(this.animate);
                            document.addEventListener('mousemove', this.onMouseMove, false);
                            window.addEventListener('deviceorientation', this.onDeviceRotation, false);
                        }
                        this.isLoading3D = false;
                    },
                    undefined,
                    error => {
                    }
                );
            });
        }


        // three end
    },
    mounted() {
        this.loaddd();
        // this.animate();
    },
}
</script>

<style lang="scss">
#container {
    width: 300px;
    height: 300px;
}
</style>