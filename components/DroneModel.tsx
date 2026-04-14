"use client";

import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls, Environment, ContactShadows, Float, Center, Bounds, ScrollControls, useScroll } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const DRONE_KEYFRAMES = [
    {
        scroll: 0,
        position: [5, 0, 0],
        rotation: [Math.PI / 10, -Math.PI / 4, 0],
        scale: 16.0
    },
    {
        scroll: 0.25,
        position: [-6, 0, 0],
        rotation: [0, Math.PI / 4, 0],
        scale: 16.0
    },
    {
        scroll: 0.5,
        position: [0, 2, 0],
        rotation: [Math.PI / 6, 0, 0],
        scale: 12.0
    },
    {
        scroll: 0.75,
        position: [8, -1, 0],
        rotation: [0, -Math.PI / 2, 0],
        scale: 12.0
    },
    {
        scroll: 1.0,
        position: [-6, 3, 0],
        rotation: [Math.PI / 6, -Math.PI / 2, 0],
        scale: 16.0
    }
];

function Model() {
    const materials = useLoader(MTLLoader, '/Drone-Design/Drone_obj.mtl');
    const obj = useLoader(OBJLoader, '/Drone-Design/Drone_obj.obj', (loader: any) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const group = useRef<THREE.Group>(null);

    useFrame((state: any) => {
        if (!group.current) return;

        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(1, Math.max(0, scrollY / (maxScroll || 1)));

        // Find current keyframe segment
        let startIdx = 0;
        for (let i = 0; i < DRONE_KEYFRAMES.length - 1; i++) {
            if (scrollProgress >= DRONE_KEYFRAMES[i].scroll && scrollProgress <= DRONE_KEYFRAMES[i + 1].scroll) {
                startIdx = i;
                break;
            }
        }

        const startState = DRONE_KEYFRAMES[startIdx];
        const endState = DRONE_KEYFRAMES[startIdx + 1];

        // Local progress within the segment
        const segmentProgress = (scrollProgress - startState.scroll) / (endState.scroll - startState.scroll);

        // Base floating effect
        const floatY = Math.sin(state.clock.elapsedTime) * 0.15;

        // Interpolate Position
        group.current.position.set(
            THREE.MathUtils.lerp(startState.position[0], endState.position[0], segmentProgress),
            THREE.MathUtils.lerp(startState.position[1], endState.position[1], segmentProgress) + floatY,
            THREE.MathUtils.lerp(startState.position[2], endState.position[2], segmentProgress)
        );

        // Interpolate Rotation
        group.current.rotation.set(
            THREE.MathUtils.lerp(startState.rotation[0], endState.rotation[0], segmentProgress),
            THREE.MathUtils.lerp(startState.rotation[1], endState.rotation[1], segmentProgress),
            THREE.MathUtils.lerp(startState.rotation[2], endState.rotation[2], segmentProgress)
        );

        // Interpolate Scale
        const currentScale = THREE.MathUtils.lerp(startState.scale, endState.scale, segmentProgress);
        group.current.scale.setScalar(currentScale);
    });

    return (
        <group ref={group}>
            <Center>
                <primitive object={obj} />
            </Center>
        </group>
    );
}

export default function DroneModel() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={2.5} color="#cce0ff" />
                <directionalLight position={[10, 10, 10]} intensity={10} color="#ffffff" />
                <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={15} color="#00e5ff" />
                <spotLight position={[10, -10, 10]} angle={0.5} penumbra={0.5} intensity={10} color="#0077ff" />

                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows resolution={1024} scale={30} blur={2.5} opacity={0.5} far={15} color="#000000" />
                </Suspense>
            </Canvas>
        </div>
    );
}
