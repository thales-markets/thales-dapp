import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

let init = false;
let eventListenerSet = false;
export const setupThreeJS = () => {
    if (!init) {
        init = true;
        const root: any = document.getElementById('landing-hero');
        const LOADER = new THREE.TextureLoader();
        const PARTICLES_CNT = root.clientWidth > root.clientHeight ? 5 * root.clientWidth : 5 * root.clientHeight;
        const SMOKE_SIZE = 200;
        const SMOKE_CNT =
            root.clientWidth > root.clientHeight
                ? (100 * root.clientWidth) / SMOKE_SIZE
                : (100 * root.clientHeight) / SMOKE_SIZE;
        const MIN_SPEED = 0.5;
        const MAX_SPEED = 10;
        const ACCELERATION = 0.1;
        const CAM_POSITION = 400;
        const STAR = LOADER.load(window.location.origin + '/three/star.png');
        const SMOKE = LOADER.load(window.location.origin + '/three/purple.jpeg');

        let speedUp = false;
        const smoke_particles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
        let particleSpeed = MIN_SPEED;

        const scene = new THREE.Scene();
        const color = 0x2d0947; // white
        const near = 10;
        const far = 1000;
        scene.fog = new THREE.Fog(color, near, far);
        const renderer = new THREE.WebGLRenderer();
        const camera = new PerspectiveCamera(75, root.clientWidth / root.clientHeight, 1, 1000);
        renderer.setClearColor('#04045a');
        camera.position.z = CAM_POSITION;
        renderer.setSize(root.clientWidth, root.clientHeight);
        root?.appendChild(renderer.domElement);

        const smokeGeo = new THREE.PlaneBufferGeometry(200, 200);

        const smokeMaterial = new THREE.MeshBasicMaterial({
            map: SMOKE,
            transparent: true,
            opacity: 0.03,
            blending: THREE.NormalBlending,
        });

        for (let p = 0, l = SMOKE_CNT; p < l; p++) {
            const smoke = new THREE.Mesh(smokeGeo, smokeMaterial);

            smoke.position.set(
                (Math.random() - 0.5) * 2 * (Math.random() * root.clientWidth),
                (Math.random() - 0.5) * 2 * (Math.random() * root.clientHeight),
                CAM_POSITION - 300 + Math.random() * 400
            );
            scene.add(smoke);
            (smoke as any).myZ = smoke.position.z;
            smoke_particles.push(smoke);
        }

        const particlesGeo = new THREE.BufferGeometry();
        const posArr = new Float32Array(PARTICLES_CNT * 3);
        const material = new THREE.PointsMaterial({
            size: 6.5,
            map: STAR,
            color: 'white',
            transparent: true,
            blending: THREE.AdditiveBlending,
            alphaTest: 0.5,
        });

        for (let i = 0; i < PARTICLES_CNT * 3; i++) {
            posArr[i] = (Math.random() - 0.5) * (Math.random() * 2000);
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

        const particles = new THREE.Points(particlesGeo, material);
        scene.add(particles);

        const ambientLight = new THREE.AmbientLight(0x04045a);
        scene.add(ambientLight);

        const onWindowResize = () => {
            camera.aspect = root.clientWidth / root.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(root.clientWidth, root.clientHeight);
        };

        window.addEventListener('resize', onWindowResize, false);
        let countRender = 0;
        // let MAX_SCROLL: any;
        const animate = function () {
            if (root) {
                const useApp = document.getElementById('use-app');
                if (useApp && !eventListenerSet) {
                    eventListenerSet = true;
                    useApp.addEventListener('mouseenter', () => {
                        speedUp = true;
                    });
                    useApp.addEventListener('mouseleave', () => {
                        speedUp = false;
                    });
                }
                // MAX_SCROLL = root.clientHeight - root.clientHeight;
                // if (window.scrollY > (25 * MAX_SCROLL) / 100) {
                //     particles.material.opacity = 1.55 - window.scrollY / MAX_SCROLL;
                // } else {
                //     particles.material.opacity = 1;
                // }
                if (speedUp) {
                    particleSpeed = particleSpeed + ACCELERATION > MAX_SPEED ? MAX_SPEED : particleSpeed + ACCELERATION;
                } else {
                    particleSpeed = particleSpeed - ACCELERATION < MIN_SPEED ? MIN_SPEED : particleSpeed - ACCELERATION;
                }
                for (let i = 0; i < PARTICLES_CNT; i++) {
                    if (posArr[i * 3 + 2] >= CAM_POSITION) {
                        posArr[i * 3 + 2] = -300;
                    }
                    posArr[i * 3 + 2] += particleSpeed;
                }
                particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

                smoke_particles.forEach((smoke, i) => {
                    smoke.position.z =
                        Math.sin(i + countRender * 0.0002) * ((smoke as any).myZ - (smoke as any).myZ * 0.6);
                    countRender += 0.1;
                });
            } else {
                particleSpeed = MIN_SPEED;
                eventListenerSet = false;
                speedUp = false;
            }

            renderer.render(scene, camera);
            countRender += 1;
            requestAnimationFrame(animate);
        };
        animate();
    }
};
