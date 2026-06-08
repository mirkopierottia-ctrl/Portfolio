"use client";

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

// Distancia a una esfera
float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

// Mínimo suavizado polinomial (smin) - Inigo Quilez
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Rotación 3D
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// Escena SDF (Raymarching)
float map(vec3 p) {
    vec3 p1 = p;
    vec3 p2 = p;
    vec3 p3 = p;

    // Movimiento orbital de las metaballs basado en uTime
    p1.xz *= rot(uTime * 0.5);
    p1.x += sin(uTime) * 1.5;
    
    // Metaball interactiva que sigue al cursor del mouse (uMouse va de -1 a 1 aprox)
    p2.xy -= uMouse * 3.0; 
    p2.z += cos(uTime * 0.8) * 0.5;

    p3.xy *= rot(-uTime * 0.4);
    p3.x += cos(uTime * 1.1) * 2.0;

    float sphere1 = sdSphere(p1, 1.2);
    float sphere2 = sdSphere(p2, 1.0);
    float sphere3 = sdSphere(p3, 0.8);
    float centralSphere = sdSphere(p, 1.5);

    // Fusión líquida orgánica
    float d = smin(centralSphere, sphere1, 0.8);
    d = smin(d, sphere2, 0.8);
    d = smin(d, sphere3, 0.8);

    return d;
}

// Calcular la normal aproximada de la superficie SDF
vec3 calcNormal(vec3 p) {
    const float eps = 0.001;
    const vec2 h = vec2(eps, 0);
    return normalize(vec3(
        map(p + h.xyy) - map(p - h.xyy),
        map(p + h.yxy) - map(p - h.yxy),
        map(p + h.yyx) - map(p - h.yyx)
    ));
}

void main() {
    // Normalizar coordenadas (NDC)
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    
    // Configuración de la cámara (Raymarching)
    vec3 ro = vec3(0.0, 0.0, 6.0); // Origen del rayo
    vec3 rd = normalize(vec3(uv, -1.0)); // Dirección del rayo

    float t = 0.0;
    float maxD = 20.0;
    int maxSteps = 100;
    
    vec3 col = vec3(0.0); // Fondo negro
    
    // Bucle iterativo de Raymarching
    for(int i = 0; i < maxSteps; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d < 0.001) {
            // ¡Impacto! Calculamos iluminación y refracción
            vec3 n = calcNormal(p);
            
            // Fresnel Effect para bordes
            float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
            
            // Aberración Cromática (Cristalización de la Luz simulada)
            // Desplazamos los canales RGB basados en la normal
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            float diff = max(dot(n, lightDir), 0.0);
            
            vec3 baseColor = vec3(0.1);
            vec3 crystalColor = vec3(
                smoothstep(0.0, 1.0, fresnel * 1.5),  // Red channel
                smoothstep(0.0, 1.0, fresnel * 1.0),  // Green channel
                smoothstep(0.0, 1.0, fresnel * 2.0)   // Blue channel
            );
            
            col = baseColor + crystalColor * 1.5 + diff * 0.2;
            break;
        }
        
        if(t > maxD) {
            break;
        }
        
        t += d;
    }

    // Viñeta (Vignette) para dar toque cinemático
    col *= 1.0 - 0.5 * length(uv);

    gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShader = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function Metaballs() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
      
      // Suavizar el movimiento del mouse (Lerp) para fluidez inercial
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x,
        (state.pointer.x * viewport.width) / 2,
        0.05
      );
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y,
        (state.pointer.y * viewport.height) / 2,
        0.05
      );
    }
  });

  return (
    <mesh>
      {/* Full screen plane to draw the Raymarched scene */}
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2() },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
        transparent={true}
      />
    </mesh>
  );
}
