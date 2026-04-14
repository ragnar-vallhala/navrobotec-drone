"use client";

import { Canvas, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls, Environment, ContactShadows, Float, Center, Bounds } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

function Model() {
    const materials = useLoader(MTLLoader, '/Drone-Design/Drone_obj.mtl');
    const obj = useLoader(OBJLoader, '/Drone-Design/Drone_obj.obj', (loader: any) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    return (
        <Bounds fit clip observe margin={0.7}>
            <Center>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <primitive object={obj} />
                </Float>
            </Center>
        </Bounds>
    );
}

export default function DroneModel() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div style={{ position: 'fixed', right: '0vw', top: '-5%', width: '65vw', height: '90vh', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [5, 3, 7], fov: 45 }}>
                <ambientLight intensity={1.5} color="#cce0ff" />
                <directionalLight position={[10, 5, 10]} intensity={6} color="#ffffff" />
                <spotLight position={[-10, 5, 10]} angle={0.3} penumbra={1} intensity={10} color="#00e5ff" />
                <spotLight position={[10, -5, 10]} angle={0.5} penumbra={0.5} intensity={5} color="#0077ff" />

                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.6} far={10} color="#000000" />
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
        </div>
    );
}
