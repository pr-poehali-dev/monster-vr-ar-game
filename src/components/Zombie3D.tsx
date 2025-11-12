import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Zombie3DProps {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  onHit?: () => void;
}

const Zombie3D = ({ position, health, maxHealth }: Zombie3DProps) => {
  const zombieRef = useRef<THREE.Group>(null);
  const limbsRef = useRef<{ 
    leftArm: THREE.Group | null;
    rightArm: THREE.Group | null;
    leftLeg: THREE.Group | null;
    rightLeg: THREE.Group | null;
  }>({
    leftArm: null,
    rightArm: null,
    leftLeg: null,
    rightLeg: null
  });

  useFrame((state) => {
    if (!zombieRef.current) return;

    const time = state.clock.getElapsedTime();
    
    zombieRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
    zombieRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;

    if (limbsRef.current.leftArm) {
      limbsRef.current.leftArm.rotation.x = Math.sin(time * 2) * 0.5 + 0.3;
    }
    if (limbsRef.current.rightArm) {
      limbsRef.current.rightArm.rotation.x = Math.sin(time * 2 + Math.PI) * 0.5 + 0.3;
    }
    if (limbsRef.current.leftLeg) {
      limbsRef.current.leftLeg.rotation.x = Math.sin(time * 2.5) * 0.4;
    }
    if (limbsRef.current.rightLeg) {
      limbsRef.current.rightLeg.rotation.x = Math.sin(time * 2.5 + Math.PI) * 0.4;
    }
  });

  const healthPercent = (health / maxHealth) * 100;
  const zombieColor = healthPercent > 50 ? "#3d5a3d" : healthPercent > 25 ? "#5a4d3d" : "#5a3d3d";

  return (
    <group ref={zombieRef} position={position}>
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4]} />
          <meshStandardMaterial 
            color={zombieColor}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={zombieColor}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        <mesh position={[-0.15, 0.7, 0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh position={[0.15, 0.7, 0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh position={[0, 0.5, 0.25]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshStandardMaterial 
            color="#2a2a2a"
            roughness={0.8}
          />
        </mesh>

        <group 
          ref={(el) => limbsRef.current.leftArm = el}
          position={[-0.35, 0.2, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial 
              color={zombieColor}
              roughness={0.9}
            />
          </mesh>
        </group>

        <group 
          ref={(el) => limbsRef.current.rightArm = el}
          position={[0.35, 0.2, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial 
              color={zombieColor}
              roughness={0.9}
            />
          </mesh>
        </group>

        <group 
          ref={(el) => limbsRef.current.leftLeg = el}
          position={[-0.15, -0.5, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.6, 0.18]} />
            <meshStandardMaterial 
              color="#2a4a2a"}
              roughness={0.9}
            />
          </mesh>
        </group>

        <group 
          ref={(el) => limbsRef.current.rightLeg = el}
          position={[0.15, -0.5, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.6, 0.18]} />
            <meshStandardMaterial 
              color="#2a4a2a"
              roughness={0.9}
            />
          </mesh>
        </group>
      </group>

      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#222222" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0.01]}>
        <planeGeometry args={[healthPercent / 100, 0.08]} />
        <meshBasicMaterial 
          color={healthPercent > 50 ? "#00ff00" : healthPercent > 25 ? "#ffaa00" : "#ff0000"} 
        />
      </mesh>

      <pointLight 
        position={[0, 0.8, 0.3]} 
        intensity={0.5} 
        distance={2} 
        color="#ff0000"
      />
    </group>
  );
};

export default Zombie3D;
