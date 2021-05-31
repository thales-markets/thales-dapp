import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

export const setupThreeJS = () => {
    let speedUp = false;
    let particleSpeed = 0.004;
    const heroHTML = document.getElementById('landing-hero');
    if (heroHTML) {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        const camera = new PerspectiveCamera(100, heroHTML?.clientWidth / heroHTML?.clientHeight, 1, 1000);
        camera.position.z = 400;
        renderer.setSize(heroHTML?.clientWidth, heroHTML?.clientHeight);
        scene.background = new THREE.Color(0x04045a);
        heroHTML.appendChild(renderer.domElement);

        const particle = new THREE.Object3D();

        scene.add(particle);

        const geometry = new THREE.TetrahedronGeometry(2, 0);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
        });

        for (let i = 0; i < 1000; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar(90 + Math.random() * 700);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            particle.add(mesh);
        }

        const ambientLight = new THREE.AmbientLight(0x999999);
        scene.add(ambientLight);

        const lights = [];
        lights[0] = new THREE.DirectionalLight(0xffffff, 1);
        lights[0].position.set(1, 0, 0);
        lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
        lights[1].position.set(0.75, 1, 0.5);
        lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
        lights[2].position.set(-0.75, -1, 0.5);
        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);
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
            requestAnimationFrame(animate);

            if (speedUp) {
                particleSpeed = particleSpeed + 0.005 > 0.2 ? 0.2 : particleSpeed + 0.005;
            } else {
                particleSpeed = particleSpeed - 0.005 < 0.004 ? 0.004 : particleSpeed - 0.005;
            }
            particle.rotation.x -= 0.004;
            particle.rotation.y -= particleSpeed;
            particle.rotation.z -= 0.004;
            renderer.clear();

            renderer.render(scene, camera);
        };
        animate();
    }
};
