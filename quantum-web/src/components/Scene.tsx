"use client";

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Metaballs from './Metaballs';
import QuantumText from './QuantumText';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        
        {/* Luces sutiles */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        
        {/* Entorno PBR */}
        <Environment preset="city" />

        {/* Componentes Core */}
        <Metaballs />
        <QuantumText />

        {/* Post-Procesamiento (Tubería Analítica) */}
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.2} 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.005, 0.005)} 
            radialModulation={true}
            modulationOffset={0.5}
          />
        </EffectComposer>

      </Canvas>
    </div>
  );
}
