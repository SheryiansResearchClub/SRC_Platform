import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const ThreeContext = createContext(null)

export const useThree = () => useContext(ThreeContext)

export default function ThreeScene({ children }) {
  const mountRef = useRef(null)
  const rafRef = useRef(null)
  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.PerspectiveCamera(50, 1, 0.1, 1000))
  const rendererRef = useRef(null)
  const [renderer, setRenderer] = useState(null)
  const meshesRef = useRef(new Set())

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

  rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  rendererRef.current.setSize(width, height)
  rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // expose renderer to children via state so context updates when ready
  setRenderer(rendererRef.current)
  const canvas = rendererRef.current.domElement
  // Ensure the canvas covers the mount and doesn't block pointer events
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  mount.appendChild(canvas)

  const pixelFov = (distance = 5) => {
    const h = mount.clientHeight || window.innerHeight
    return 2 * Math.atan((h / 2) / distance) * (180 / Math.PI)
  }
  camera.aspect = width / height
  camera.fov = pixelFov(5)
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 5)

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      rendererRef.current.setSize(w, h)
      camera.aspect = w / h
      camera.fov = pixelFov(5)
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    const animate = (t) => {
      meshesRef.current.forEach((m) => {
        if (typeof m.update === 'function') m.update(t)
      })
      rendererRef.current.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      if (rendererRef.current) {
        mount.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [camera, scene])

  const registerMesh = (mesh) => {
    meshesRef.current.add(mesh)
    // MagicMesh from static site may be a THREE.Mesh subclass or expose object3d
    if (mesh.object3d) scene.add(mesh.object3d)
    else if (mesh instanceof THREE.Object3D) scene.add(mesh)
  }

  const unregisterMesh = (mesh) => {
    meshesRef.current.delete(mesh)
    if (mesh.object3d) scene.remove(mesh.object3d)
  }

  return (
    <ThreeContext.Provider value={{ registerMesh, unregisterMesh, scene, camera, renderer }}>
      <div ref={mountRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }} />
      {children}
    </ThreeContext.Provider>
  )
}

