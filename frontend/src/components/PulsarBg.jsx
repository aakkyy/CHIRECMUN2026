/**
 * PulsarBg.jsx
 * Physically-accurate Vela Pulsar simulation using React Three Fiber.
 *
 * What's modelled:
 *  - Rotating neutron star (pulsing emissive glow ~2.2 Hz)
 *  - Dipole magnetic field lines (actual r = L·sin²θ math, rotating with star)
 *  - Two EM beams along tilted magnetic axis (cone geometry, brighten when facing camera)
 *  - Relativistic particle jets along rotation axis (knots moving outward)
 *  - Pulsar wind nebula (inner + outer torus perpendicular to jets)
 *  - Shock wavefronts expanding from the magnetosphere
 *  - Supernova remnant gas clouds
 *  - 7000 background stars
 *  - Sparkles for pulsar wind particles
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, AdaptiveDpr, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ── physical constants (visual scale) ─────── */
const TILT      = Math.PI / 5.5        // ~33° – magnetic axis tilt from rotation axis
const ROT_HZ    = 0.65                 // visual rotation rate (real Vela = 11 Hz)
const ROT_SPEED = ROT_HZ * Math.PI * 2 // rad / sec
const BEAM_LEN  = 4.8
const BEAM_RAD  = BEAM_LEN * Math.tan(Math.PI / 11) // ~16° half-angle cone

/* ══════════════════════════════════════════════
   NEUTRON STAR
   Pulsing white-blue sphere with magnetosphere glow
   ══════════════════════════════════════════════ */
function NeutronStar() {
  const coreRef  = useRef()
  const glowRef  = useRef()
  const haloRef  = useRef()
  const lightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // 2.2 Hz pulse
    const p = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2.2)
    // slower secondary breath
    const b = 0.5 + 0.5 * Math.sin(t * 0.6)

    if (coreRef.current)  coreRef.current.material.emissiveIntensity = 3.5 + 3.5 * p
    if (glowRef.current)  {
      glowRef.current.material.opacity = 0.09 + 0.14 * p
      glowRef.current.scale.setScalar(1 + 0.18 * p)
    }
    if (haloRef.current)  {
      haloRef.current.material.opacity = 0.04 + 0.04 * b
      haloRef.current.scale.setScalar(1 + 0.05 * b)
    }
    if (lightRef.current) lightRef.current.intensity = 5 + 5 * p
  })

  return (
    <group>
      <pointLight ref={lightRef} color="#a8d8ff" intensity={7} distance={16} decay={1.6} />

      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color="#ddf0ff"
          emissive="#56CCF2"
          emissiveIntensity={4}
          roughness={0.05}
          metalness={1}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial
          color="#56CCF2"
          transparent opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer magnetosphere halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.1, 20, 20]} />
        <meshBasicMaterial
          color="#2266aa"
          transparent opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════
   MAGNETIC FIELD LINES
   Dipole geometry: r = L · sin²(θ)
   Rotates rigidly with the star; axis tilted by TILT
   ══════════════════════════════════════════════ */
function FieldLine({ points, opacity }) {
  const obj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color: '#56CCF2',
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geo, mat)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <primitive object={obj} />
}

function MagneticFieldLines() {
  const groupRef = useRef()

  const lines = useMemo(() => {
    const result = []
    // L = equatorial distance of field line (in star radii-ish)
    const Ls  = [0.65, 1.05, 1.55, 2.10]
    const ops = [0.60, 0.42, 0.26, 0.14]
    const PHI = 9  // azimuthal lines per shell

    Ls.forEach((L, li) => {
      for (let pi = 0; pi < PHI; pi++) {
        const phi    = (pi / PHI) * Math.PI * 2
        const pts    = []

        for (let k = 0; k <= 90; k++) {
          const theta = (k / 90) * Math.PI
          if (theta < 0.03 || theta > Math.PI - 0.03) continue
          const r = L * Math.sin(theta) ** 2
          if (r < 0.13) continue  // clip inside star

          pts.push(new THREE.Vector3(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.cos(theta),
            r * Math.sin(theta) * Math.sin(phi),
          ))
        }

        if (pts.length > 3) result.push({ pts, op: ops[li] })
      }
    })
    return result
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * ROT_SPEED
    groupRef.current.rotation.z = TILT
  })

  return (
    <group ref={groupRef}>
      {lines.map((l, i) => (
        <FieldLine key={i} points={l.pts} opacity={l.op} />
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════
   PULSAR BEAMS
   Two opposing cones along the magnetic axis.
   Opacity peaks when cone axis points at camera (the "lighthouse" flash).
   ══════════════════════════════════════════════ */
function PulsarBeams() {
  const groupRef = useRef()
  const beam1Ref = useRef()
  const beam2Ref = useRef()
  const flashRef = useRef()
  const camVec   = useRef(new THREE.Vector3())
  const axisVec  = useRef(new THREE.Vector3())

  useFrame(({ clock, camera }) => {
    const t   = clock.getElapsedTime()
    const rot = t * ROT_SPEED

    if (groupRef.current) {
      groupRef.current.rotation.y = rot
    }

    // Direction of magnetic axis in world space
    camVec.current.copy(camera.position).normalize()
    axisVec.current.set(
      Math.sin(TILT) * Math.sin(rot),
      Math.cos(TILT),
      Math.sin(TILT) * Math.cos(rot),
    )
    const dot = camVec.current.dot(axisVec.current)

    // Beams brighten as they sweep toward the camera
    if (beam1Ref.current) beam1Ref.current.material.opacity = 0.18 + 0.62 * Math.max(0, dot)
    if (beam2Ref.current) beam2Ref.current.material.opacity = 0.18 + 0.62 * Math.max(0, -dot)

    // Flash when beam is nearly aimed at camera
    const flash = Math.max(0, (Math.abs(dot) - 0.60) / 0.40) ** 2
    if (flashRef.current) {
      flashRef.current.material.opacity = flash * 0.75
      flashRef.current.scale.setScalar(0.8 + flash * 0.6)
    }
  })

  const coneArgs = [BEAM_RAD, BEAM_LEN, 48, 1, true]

  return (
    <group ref={groupRef} rotation={[0, 0, TILT]}>

      {/* North magnetic pole beam (aim: +Y in magnetic frame) */}
      <mesh ref={beam1Ref} position={[0, BEAM_LEN / 2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={coneArgs} />
        <meshBasicMaterial
          color="#56CCF2"
          transparent opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* South magnetic pole beam (aim: -Y in magnetic frame) */}
      <mesh ref={beam2Ref} position={[0, -BEAM_LEN / 2, 0]}>
        <coneGeometry args={coneArgs} />
        <meshBasicMaterial
          color="#56CCF2"
          transparent opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bright core along beam axis */}
      <mesh position={[0, BEAM_LEN * 0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[BEAM_RAD * 0.18, BEAM_LEN * 0.5, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -BEAM_LEN * 0.25, 0]}>
        <coneGeometry args={[BEAM_RAD * 0.18, BEAM_LEN * 0.5, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Camera-facing lighthouse flash */}
      <mesh ref={flashRef}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════
   JET PARTICLES
   Relativistic particles traveling outward along the
   rotation axis. Knots: blobs of compressed plasma.
   ══════════════════════════════════════════════ */
function JetParticles() {
  const COUNT   = 500
  const JET_MAX = 4.8
  const ref     = useRef()

  const { phases, initArr } = useMemo(() => {
    const phases  = Float32Array.from({ length: COUNT }, () => Math.random())
    const initArr = new Float32Array(COUNT * 3) // all zero; updated in useFrame
    return { phases, initArr }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t   = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < COUNT; i++) {
      const dir  = i < COUNT / 2 ? 1 : -1
      const ph   = (phases[i] + t * 0.30) % 1.0
      const ang  = phases[i] * Math.PI * 2 * 11
      const spr  = 0.07 * Math.sqrt(ph) * (1 - ph * 0.6)

      pos[i * 3]     = Math.cos(ang) * spr
      pos[i * 3 + 1] = dir * ph * JET_MAX
      pos[i * 3 + 2] = Math.sin(ang) * spr
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={initArr}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#88e0ff"
        size={0.055}
        transparent opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ══════════════════════════════════════════════
   SHOCK RINGS
   Electromagnetic wavefronts expanding from the
   magnetosphere (similar to what Chandra X-ray shows)
   ══════════════════════════════════════════════ */
function ShockRing({ offset }) {
  const ref   = useRef()
  const MAX_R = 6.0

  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = (clock.getElapsedTime() * 0.20 + offset) % 1.0
    ref.current.scale.setScalar(0.2 + p * MAX_R)
    ref.current.material.opacity = Math.pow(1 - p, 2.2) * 0.22
  })

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.012, 8, 100]} />
      <meshBasicMaterial
        color="#56CCF2"
        transparent opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function ShockRings() {
  return (
    <>
      {[0, 0.25, 0.50, 0.75].map(o => (
        <ShockRing key={o} offset={o} />
      ))}
    </>
  )
}

/* ══════════════════════════════════════════════
   PULSAR WIND NEBULA TORUS
   Compressed wind forms a torus perpendicular to jets.
   ══════════════════════════════════════════════ */
function PulsarWindTorus() {
  const outerRef = useRef()
  const innerRef = useRef()
  const midRef   = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (outerRef.current) outerRef.current.material.opacity = 0.14 + 0.07 * Math.sin(t * 0.85)
    if (innerRef.current) innerRef.current.material.opacity = 0.20 + 0.09 * Math.sin(t * 1.25 + 1.1)
    if (midRef.current)   midRef.current.material.opacity   = 0.10 + 0.05 * Math.sin(t * 0.55 + 2.3)
  })

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={outerRef}>
        <torusGeometry args={[2.1, 0.17, 20, 140]} />
        <meshBasicMaterial color="#56CCF2" transparent opacity={0.16}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={midRef}>
        <torusGeometry args={[1.65, 0.11, 16, 120]} />
        <meshBasicMaterial color="#80d8ff" transparent opacity={0.12}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.25, 0.09, 14, 100]} />
        <meshBasicMaterial color="#aaeeff" transparent opacity={0.22}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════
   SUPERNOVA REMNANT
   Diffuse glowing gas from the original explosion
   ══════════════════════════════════════════════ */
function SNRCloud() {
  const groupRef = useRef()

  const clouds = useMemo(() => [
    { p: [-2.9, -2.0, -1.8], r: 3.7, c: '#6a2506', op: 0.058 },
    { p: [ 3.2,  1.3, -2.5], r: 3.3, c: '#2d1155', op: 0.050 },
    { p: [-1.5,  3.0,  1.5], r: 3.0, c: '#0b1e44', op: 0.054 },
    { p: [ 2.0, -2.8,  2.4], r: 3.4, c: '#4e1505', op: 0.050 },
    { p: [-3.8,  0.8,  2.2], r: 2.6, c: '#180938', op: 0.042 },
    { p: [ 0.5,  3.5, -2.0], r: 2.8, c: '#3a0e04', op: 0.045 },
  ], [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.007
    groupRef.current.rotation.x = t * 0.004
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.p}>
          <sphereGeometry args={[c.r, 8, 8]} />
          <meshBasicMaterial
            color={c.c}
            transparent opacity={c.op}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════
   SCENE
   ══════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.025} />

      {/* 7000 background stars */}
      <Stars radius={140} depth={75} count={7000} factor={3.8} saturation={0.15} fade speed={0.35} />

      {/* Pulsar wind particle shimmer */}
      <Sparkles count={100} scale={7} size={1.8} speed={0.18} opacity={0.30} color="#56CCF2" />
      <Sparkles count={40}  scale={3} size={0.9} speed={0.30} opacity={0.40} color="#ffffff" />

      <SNRCloud />
      <ShockRings />
      <PulsarWindTorus />
      <JetParticles />
      <MagneticFieldLines />
      <PulsarBeams />
      <NeutronStar />
    </>
  )
}

/* ══════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════ */
export default function PulsarBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [4.5, 2.8, 9.5], fov: 52 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#02020a' }}
        dpr={[1, 1.5]}
      >
        <AdaptiveDpr pixelRatio={[1, 1.5]} />
        <Scene />
      </Canvas>
    </div>
  )
}
