"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function QuantumText() {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const uniforms = useRef({
    uTime: { value: 0 }
  });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
  });

  const onBeforeCompile = (shader: THREE.Shader) => {
    shader.uniforms.uTime = uniforms.current.uTime;

    // Inyectamos variables uniformes en el vertex shader
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      `
    );

    // Inyectamos la deformación ondulada (Wavy Text)
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      // Deformación trigonométrica basada en uTime y posición X
      float waveAmplitude = 0.2;
      float waveFrequency = 1.5;
      transformed.y += sin(position.x * waveFrequency + uTime * 2.0) * waveAmplitude;
      transformed.z += cos(position.x * waveFrequency + uTime * 2.0) * (waveAmplitude * 0.5);
      `
    );
  };

  return (
    <Text
      text="QUANTUM"
      fontSize={2.5}
      letterSpacing={0.1}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      position={[0, 0, 1]}
    >
      <meshBasicMaterial
        ref={materialRef}
        color="#ffffff"
        transparent
        opacity={0.9}
        onBeforeCompile={onBeforeCompile}
      />
    </Text>
  );
}
