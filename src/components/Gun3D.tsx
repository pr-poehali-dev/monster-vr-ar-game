import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Gun3DProps {
  firing: boolean;
  onFireComplete: () => void;
}

const Gun3D = ({ firing, onFireComplete }: Gun3DProps) => {
  const gunRef = useRef<THREE.Group>(null);
  const recoilRef = useRef(0);
  const fireTimeRef = useRef(0);

  useEffect(() => {
    if (firing) {
      fireTimeRef.current = Date.now();
    }
  }, [firing]);

  useFrame(() => {
    if (!gunRef.current) return;

    if (firing && Date.now() - fireTimeRef.current < 200) {
      recoilRef.current = Math.min(recoilRef.current + 0.15, 0.3);
      gunRef.current.position.z = recoilRef.current;
      gunRef.current.rotation.x = -recoilRef.current * 0.5;
    } else {
      if (recoilRef.current > 0) {
        recoilRef.current = Math.max(recoilRef.current - 0.08, 0);
        gunRef.current.position.z = recoilRef.current;
        gunRef.current.rotation.x = -recoilRef.current * 0.5;
      }
      if (firing && recoilRef.current === 0) {
        onFireComplete();
      }
    }

    gunRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.02;
  });

  return (
    <group ref={gunRef} position={[0.5, -0.6, -1]}>
      <group rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.15]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.2}
          />
        </mesh>

        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            metalness={0.8} 
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={1.0} 
            roughness={0.1}
          />
        </mesh>

        <mesh position={[-0.2, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.08, 0.12]} />
          <meshStandardMaterial 
            color="#8B4513" 
            metalness={0.1} 
            roughness={0.8}
          />
        </mesh>

        <mesh position={[0.1, -0.12, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.1]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0.42, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial 
            color={firing ? "#ff6600" : "#1a1a1a"} 
            emissive={firing ? "#ff3300" : "#000000"}
            emissiveIntensity={firing ? 2 : 0}
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>

        {firing && (
          <pointLight 
            position={[0.5, 0, 0]} 
            intensity={5} 
            distance={3} 
            color="#ff6600"
          />
        )}
      </group>
    </group>
  );
};

export default Gun3D;
