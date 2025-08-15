import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Dog = () => {
  const mountRef = useRef(null);
  const modelRef = useRef(null); // Track the loaded model
  const mixerRef = useRef(null); // Track animations
  const controlsRef = useRef(null); // Track OrbitControls

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 300);
    // renderer.domElement.style.position = "relative";
    renderer.domElement.style.top = "-140px";
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls
    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    controlsRef.current.enableDamping = true; // smooth movement
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.target.set(0, 3, 0); // focus point of camera
    controlsRef.current.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.5);
    scene.add(hemiLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      "/model/baby-dog_glb/source/babydog-v1.glb",
      (gltf) => {
        if (!modelRef.current) {
          modelRef.current = gltf.scene;
          const scale = 4;
          modelRef.current.scale.set(scale, scale, scale);
          // Translate the dog upward (Y axis)
          modelRef.current.position.y = 2; // adjust value until it looks centered

          scene.add(modelRef.current);

          // Update OrbitControls target to match
          controlsRef.current.target.set(0, 2, 0);
          controlsRef.current.update();

          // Set up animation mixer if there are animations
          if (gltf.animations && gltf.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(modelRef.current);

            gltf.animations.forEach((clip) => {
              mixerRef.current.clipAction(clip).play();
            });
          }
        }
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // Clock for animation timing
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Update controls
      controlsRef.current.update();

      // Log camera focus values
      // console.log("Camera position:", camera.position);
      // console.log("Camera target:", controlsRef.current.target);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      modelRef.current = null;
      mixerRef.current = null;
    };
  }, []);

  return (
    <div
      className="  w-full  h-[330px] py-5 mx-auto overflow-hidden"
      ref={mountRef}
    />
  );
};

export default Dog;
