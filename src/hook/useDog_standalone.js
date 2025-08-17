import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useSelector } from "react-redux";

const useDog_standalone = () => {
  const divRef = useRef(null); // container div
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const controlsRef = useRef(null);
  const actionsRef = useRef({});
  const clockRef = useRef(new THREE.Clock());
  const currentAudioRef = useRef(null);

  const dog_animation =
    useSelector((state) => state.dogDetail.dog_animation) || "";

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!divRef.current) return; // wait for div

    const width = divRef.current.clientWidth || 400;
    const height = divRef.current.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    divRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controls.update();
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 1.5));

    const loader = new GLTFLoader();
    loader.load(
      "/model/baby-dog_glb/source/babydog-v1.glb",
      (gltf) => {
        if (!modelRef.current) {
          modelRef.current = gltf.scene;
          modelRef.current.scale.set(4, 4, 4);
          modelRef.current.position.y = -1.2;
          scene.add(modelRef.current);

          controls.target.set(0, -0.5, 0);
          controls.update();

          if (gltf.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(modelRef.current);

            gltf.animations.forEach((clip) => {
              actionsRef.current[clip.name] = mixerRef.current.clipAction(clip);
            });

            if (actionsRef.current["standing"]) {
              actionsRef.current["standing"].play();
            } else {
              mixerRef.current.clipAction(gltf.animations[0]).play();
            }
          }
        }
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (divRef.current) divRef.current.removeChild(renderer.domElement);
      modelRef.current = null;
      mixerRef.current = null;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const handlePlayAudio = (text) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (muted) return;

    if (!window.puter || !puter.ai?.txt2speech) {
      console.error("Puter.js text-to-speech not found");
      return;
    }

    puter.ai
      .txt2speech(text, {
        voice: "Joanna",
        engine: "neural",
        language: "en-US",
      })
      .then((audio) => {
        currentAudioRef.current = audio;
        audio.play().catch((err) => console.error("Playback blocked:", err));
        audio.onended = () => {
          currentAudioRef.current = null;
        };
      })
      .catch((err) => console.error("TTS error:", err));
  };

  const playAnimation = (name, onFinished) => {
    if (!actionsRef.current[name]) {
      console.warn(`Animation ${name} not found`);
      return;
    }

    Object.values(actionsRef.current).forEach((action) => action.stop());
    const action = actionsRef.current[name];
    action.reset();

    if (name === "standing") {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    action.play();

    if (mixerRef.current && name !== "standing") {
      const finishedHandler = (e) => {
        if (e.action === action) {
          mixerRef.current.removeEventListener("finished", finishedHandler);
          if (onFinished) onFinished();
        }
      };
      mixerRef.current.addEventListener("finished", finishedHandler);
    }
  };

  useEffect(() => {
    if (!dog_animation || !actionsRef.current[dog_animation]) return;
    playAnimation(dog_animation, () => {
      if (actionsRef.current["standing"]) playAnimation("standing");
    });
  }, [dog_animation]);

  const toggleMute = () => {
    setMuted((prev) => {
      const newMute = !prev;
      if (newMute && currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      return newMute;
    });
  };

  return {
    divRef,
    playAnimation,
    handlePlayAudio,
    muted,
    toggleMute,
  };
};

export default useDog_standalone;
