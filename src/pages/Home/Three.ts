import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

let init = false;
let eventListenerSet = false;
export const setupThreeJS = () => {
    if (!init) {
        init = true;
        const LOADER = new THREE.TextureLoader();
        const PARTICLES_CNT = 3000;
        const MIN_SPEED = 0.5;
        const MAX_SPEED = 10;
        const ACCELERATION = 0.1;
        const CAM_POSITION = 400;
        const STAR = LOADER.load(window.location.origin + '/three/star.png');
        const SMOKE = LOADER.load(window.location.origin + '/three/purple.jpeg');

        let speedUp = false;
        const smoke_particles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
        let particleSpeed = MIN_SPEED;
        const heroHTML = document.getElementById('root');

        const scene = new THREE.Scene();
        const color = 0x2d0947; // white
        const near = 10;
        const far = 1000;
        scene.fog = new THREE.Fog(color, near, far);
        const renderer = new THREE.WebGLRenderer();
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        renderer.setClearColor('#04045a');
        camera.position.z = CAM_POSITION;
        renderer.setSize(window.innerWidth, window.innerHeight);
        heroHTML?.appendChild(renderer.domElement);

        const smokeGeo = new THREE.PlaneBufferGeometry(2 * 86, 2 * 93);

        const smokeMaterial = new THREE.MeshBasicMaterial({
            map: SMOKE,
            transparent: true,
            opacity: 0.02,
        });

        for (let p = 0, l = 1000; p < l; p++) {
            const particle = new THREE.Mesh(smokeGeo, smokeMaterial);

            particle.position.set(
                (Math.random() - 0.5) * (Math.random() * 1500),
                (Math.random() - 0.5) * (Math.random() * 1500),
                CAM_POSITION - 300 + Math.random() * 400
            );
            scene.add(particle);
            smoke_particles.push(particle);
        }

        const particlesGeo = new THREE.BufferGeometry();
        const posArr = new Float32Array(PARTICLES_CNT * 3);
        const material = new THREE.PointsMaterial({
            size: 10,
            map: STAR,
            color: '04045a',
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

        const ambientLight = new THREE.AmbientLight(0x11e8bb);
        scene.add(ambientLight);

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize, false);

        const animate = function () {
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

            if (document.getElementById('landing-hero')) {
                if (speedUp) {
                    particleSpeed = particleSpeed + ACCELERATION > MAX_SPEED ? MAX_SPEED : particleSpeed + ACCELERATION;
                } else {
                    particleSpeed = particleSpeed - ACCELERATION < MIN_SPEED ? MIN_SPEED : particleSpeed - ACCELERATION;
                }
            } else {
                speedUp = false;
                particleSpeed = particleSpeed - ACCELERATION < MIN_SPEED ? MIN_SPEED : particleSpeed - ACCELERATION;
            }
            for (let i = 0; i < PARTICLES_CNT; i++) {
                if (posArr[i * 3 + 2] >= CAM_POSITION) {
                    posArr[i * 3 + 2] = -300;
                }
                posArr[i * 3 + 2] += particleSpeed;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    }
};
