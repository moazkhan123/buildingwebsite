import React, { Suspense, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";
import { colors } from "@/theme/colors";

interface Avatar3DProps {
  avatarUrl: string;
  speaking: boolean;
  /** Mutable 0..1 target mouth-openness, nudged by the TTS word-boundary callback in ConversationScreen. */
  mouthPulseRef: React.MutableRefObject<number>;
}

/**
 * Ready Player Me avatars exported with the ARKit blendshape set expose morph
 * targets like "mouthOpen"/"viseme_aa" and "eyeBlinkLeft/Right". We don't have
 * phoneme-level viseme data (that needs a service like Rhubarb Lip Sync), so
 * lip movement is approximated: the mouth opens on each word-boundary pulse
 * from expo-speech and eases back to closed, which reads as natural speech
 * motion at conversational distance.
 */
function AvatarModel({
  url,
  mouthPulseRef,
  speaking,
}: {
  url: string;
  mouthPulseRef: React.MutableRefObject<number>;
  speaking: boolean;
}) {
  const gltf = useGLTF(url) as unknown as { scene: THREE.Group };
  const scene = gltf.scene;
  const headMeshRef = useRef<THREE.Mesh | null>(null);
  const currentMouthRef = useRef(0);
  const blinkClockRef = useRef(0);
  const nextBlinkAtRef = useRef(2 + Math.random() * 3);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary) {
        if ("mouthOpen" in mesh.morphTargetDictionary || "viseme_aa" in mesh.morphTargetDictionary) {
          headMeshRef.current = mesh;
        }
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    const mesh = headMeshRef.current;
    scene.rotation.y = Math.sin(Date.now() / 2000) * 0.03;
    scene.position.y = -1.55 + Math.sin(Date.now() / 1500) * 0.01;

    if (!mesh?.morphTargetDictionary || !mesh.morphTargetInfluences) return;

    const target = speaking ? mouthPulseRef.current : 0;
    currentMouthRef.current += (target - currentMouthRef.current) * Math.min(1, delta * 10);
    const mouthKey = "mouthOpen" in mesh.morphTargetDictionary ? "mouthOpen" : "viseme_aa";
    const mouthIndex = mesh.morphTargetDictionary[mouthKey];
    if (mouthIndex !== undefined) {
      mesh.morphTargetInfluences[mouthIndex] = currentMouthRef.current;
    }

    blinkClockRef.current += delta;
    if (blinkClockRef.current >= nextBlinkAtRef.current) {
      blinkClockRef.current = 0;
      nextBlinkAtRef.current = 2.5 + Math.random() * 3;
    }
    const blinkValue = blinkClockRef.current < 0.12 ? Math.sin((blinkClockRef.current / 0.12) * Math.PI) : 0;
    for (const key of ["eyeBlinkLeft", "eyeBlinkRight"]) {
      const idx = mesh.morphTargetDictionary[key];
      if (idx !== undefined) mesh.morphTargetInfluences[idx] = blinkValue;
    }
  });

  return <primitive object={scene} scale={1.4} position={[0, -1.55, 0]} />;
}

class AvatarErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function Avatar3D({ avatarUrl, speaking, mouthPulseRef }: Avatar3DProps) {
  const [loadError, setLoadError] = useState(false);

  if (!avatarUrl) {
    return <AvatarPlaceholder reason="no-url" />;
  }
  if (loadError) {
    return <AvatarPlaceholder reason="load-error" />;
  }

  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 2.2], fov: 30 }} style={styles.canvas}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 2, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <AvatarErrorBoundary onError={() => setLoadError(true)}>
            <AvatarModel url={avatarUrl} mouthPulseRef={mouthPulseRef} speaking={speaking} />
          </AvatarErrorBoundary>
        </Suspense>
      </Canvas>
    </View>
  );
}

function AvatarPlaceholder({ reason }: { reason: "no-url" | "load-error" }) {
  return (
    <View style={[styles.container, styles.placeholder]}>
      <Text style={styles.placeholderEmoji}>🙂</Text>
      <Text style={styles.placeholderText}>
        {reason === "no-url"
          ? "Add a Ready Player Me avatar URL in Settings to see your 3D tutor."
          : "Couldn't load the 3D avatar. Check the URL and your connection."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
  },
  canvas: {
    flex: 1,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    color: colors.textMuted,
    textAlign: "center",
  },
});
