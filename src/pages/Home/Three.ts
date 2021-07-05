import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

const LOADER = new THREE.TextureLoader();
const MIN_SPEED = 0.5;
const MAX_SPEED = 10;
const ACCELERATION = 0.1;
const CAM_POSITION = 400;
const STAR = LOADER.load(window.location.origin + '/three/star.png');
const SMOKE = LOADER.load(window.location.origin + '/three/smoke.png');
const PARTICLES_CNT = window.innerWidth > window.screen.height ? 5 * window.innerWidth : 5 * window.screen.height;
const SMOKE_SIZE = 200;
const SMOKE_CNT =
    window.innerWidth > window.screen.height
        ? (100 * window.innerWidth) / SMOKE_SIZE
        : (100 * window.screen.height) / SMOKE_SIZE;

let init = false;
let eventListenerSet = false;
let particleSpeed = MIN_SPEED;
let speedUp = false;
let countRender = 0;

const renderer = new THREE.WebGLRenderer();
const camera = new PerspectiveCamera(75, window.innerWidth / window.screen.height, 1, 1000);
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.screen.height;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.screen.height);
};

export const setupThreeJS = () => {
    if (!init) {
        init = true;
        const root: any = document.getElementById('root');

        const smoke_particles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];

        const scene = new THREE.Scene();
        const COLOR = 0x2d0947;
        const NEAR = 10;
        const FAR = 1000;
        scene.fog = new THREE.Fog(COLOR, NEAR, FAR);

        renderer.setClearColor('#04045a');
        camera.position.z = CAM_POSITION;
        renderer.setSize(window.innerWidth, window.screen.height);
        root?.appendChild(renderer.domElement);

        const smokeGeo = new THREE.PlaneBufferGeometry(SMOKE_SIZE, SMOKE_SIZE);

        const smokeMaterial = new THREE.MeshBasicMaterial({
            map: SMOKE,
            transparent: true,
            opacity: 0.07,
            blending: THREE.NormalBlending,
        });

        for (let p = 0, l = SMOKE_CNT; p < l; p++) {
            const smoke = new THREE.Mesh(smokeGeo, smokeMaterial);

            smoke.position.set(
                (Math.random() - 0.5) * 2 * (Math.random() * window.innerWidth),
                (Math.random() - 0.5) * 2 * (Math.random() * window.screen.height),
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
            color: '#f6f6fe',
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

        window.addEventListener('resize', onWindowResize, false);

        // let MAX_SCROLL: any;
        const animate = function () {
            if (document.getElementById('landing-hero')) {
                if (document.getElementById('animation-button')?.classList.contains('active')) {
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
                    // MAX_SCROLL = window.screen.height - window.screen.height;
                    // if (window.scrollY > (25 * MAX_SCROLL) / 100) {
                    //     particles.material.opacity = 1.55 - window.scrollY / MAX_SCROLL;
                    // } else {
                    //     particles.material.opacity = 1;
                    // }
                    if (speedUp) {
                        particleSpeed =
                            particleSpeed + ACCELERATION > MAX_SPEED ? MAX_SPEED : particleSpeed + ACCELERATION;
                    } else {
                        particleSpeed =
                            particleSpeed - ACCELERATION < MIN_SPEED ? MIN_SPEED : particleSpeed - ACCELERATION;
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
                    renderer.render(scene, camera);
                    countRender += 1;
                }
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
};

export const removeThreeJS = () => {
    particleSpeed = MIN_SPEED;
    eventListenerSet = false;
    speedUp = false;
    countRender = 0;
    init = false;
    window.removeEventListener('resize', onWindowResize);
    document.getElementById('root')?.removeChild(renderer.domElement);
};
