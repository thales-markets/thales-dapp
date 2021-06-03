import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

const LOADER = new THREE.TextureLoader();

const PARTICLES_CNT = 3000;
const MIN_SPEED = 0.5;
const MAX_SPEED = 10;
const ACCELERATION = 0.1;
const CAM_POSITION = 400;
const STAR = LOADER.load('three/star.png');
const SMOKE = LOADER.load('three/smoke.png');
//const BACKGROUND = LOADER.load('background.png');

let speedUp = false;
const smoke_particles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial>[] = [];
let particleSpeed = MIN_SPEED;

export const setupThreeJS = () => {
    const heroHTML = document.getElementById('landing-hero');
    if (heroHTML) {
        const scene = new THREE.Scene();
        const color = 0xffffff; // white
        const near = 10;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
        const renderer = new THREE.WebGLRenderer();
        const camera = new PerspectiveCamera(100, heroHTML?.clientWidth / heroHTML?.clientHeight, 1, 1000);
        renderer.setClearColor('#04045a');
        camera.position.z = CAM_POSITION;
        renderer.setSize(heroHTML?.clientWidth, heroHTML?.clientHeight);
        heroHTML.appendChild(renderer.domElement);

        const smokeGeo = new THREE.PlaneBufferGeometry(86, 93);

        const smokeMaterial = new THREE.MeshLambertMaterial({
            map: SMOKE,
            transparent: true,
            opacity: 0.03,
        });

        for (let p = 0, l = 10000; p < l; p++) {
            const particle = new THREE.Mesh(smokeGeo, smokeMaterial);

            particle.position.set(
                (Math.random() - 0.5) * (Math.random() * 2000),
                (Math.random() - 0.5) * (Math.random() * 2000),
                CAM_POSITION - 500 + Math.random() * 400
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
            camera.aspect = heroHTML?.clientWidth / heroHTML?.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroHTML?.clientWidth, heroHTML?.clientHeight);
        };

        window.addEventListener('resize', onWindowResize, false);

        document.getElementById('use-app')?.addEventListener('mouseenter', () => {
            speedUp = true;
        });

        document.getElementById('use-app')?.addEventListener('mouseleave', () => {
            speedUp = false;
        });

        const animate = function () {
            for (let i = 0; i < PARTICLES_CNT; i++) {
                if (posArr[i * 3 + 2] >= CAM_POSITION) {
                    posArr[i * 3 + 2] = -300;
                }
                posArr[i * 3 + 2] += particleSpeed;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

            if (speedUp) {
                particleSpeed = particleSpeed + ACCELERATION > MAX_SPEED ? MAX_SPEED : particleSpeed + ACCELERATION;
            } else {
                particleSpeed = particleSpeed - ACCELERATION < MIN_SPEED ? MIN_SPEED : particleSpeed - ACCELERATION;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    }
};
