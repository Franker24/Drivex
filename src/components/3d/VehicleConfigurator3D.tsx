import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface VehicleConfigurator3DProps {
  paintColor: string; // Hex color string, e.g., '#e5c188'
  wheelStyle: string; // Wheel style name/type
  interiorColor?: string; // Optional interior trim
}

export default function VehicleConfigurator3D({ paintColor, wheelStyle }: VehicleConfigurator3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backdropTheme, setBackdropTheme] = useState('studio-noir');
  
  // Keep refs for updates
  const carBodyMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rimsMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const mainSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const dirLightBlueRef = useRef<THREE.DirectionalLight | null>(null);
  const dirLightGoldRef = useRef<THREE.DirectionalLight | null>(null);
  const frontFillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setLoading(true);
    setError('');

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a');
    scene.fog = new THREE.FogExp2('#0a0a0a', 0.08);

    // --- 2. Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      40,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(4.2, 1.8, 5.5);

    // --- 3. Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    
    // Clear previous canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // --- 4. Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // prevent going below floor
    controls.minDistance = 3.2;
    controls.maxDistance = 8.5;
    controls.target.set(0, 0.4, 0);

    // --- 5. Cinematic Studio Lighting ---
    const ambientLight = new THREE.AmbientLight('#121212', 0.6);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Top Key Light
    const mainSpotLight = new THREE.SpotLight('#ffffff', 15, 12, Math.PI / 4, 0.5, 1);
    mainSpotLight.position.set(0, 6, 0);
    mainSpotLight.castShadow = true;
    mainSpotLight.shadow.mapSize.width = 1024;
    mainSpotLight.shadow.mapSize.height = 1024;
    mainSpotLight.shadow.bias = -0.0001;
    scene.add(mainSpotLight);
    mainSpotLightRef.current = mainSpotLight;

    // Cold Rim Light (Cyan/Blue)
    const dirLightBlue = new THREE.DirectionalLight('#00a2ff', 3.0);
    dirLightBlue.position.set(5, 3, -4);
    scene.add(dirLightBlue);
    dirLightBlueRef.current = dirLightBlue;

    // Warm Key Light (Gold/Orange)
    const dirLightGold = new THREE.DirectionalLight('#e5c188', 3.5);
    dirLightGold.position.set(-5, 2.5, 4);
    scene.add(dirLightGold);
    dirLightGoldRef.current = dirLightGold;

    // Front soft fill light
    const frontFillLight = new THREE.DirectionalLight('#ffffff', 1.5);
    frontFillLight.position.set(0, 2, 6);
    scene.add(frontFillLight);
    frontFillLightRef.current = frontFillLight;

    // --- 6. Showroom Floor (Reflective Grid) ---
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#080808',
      roughness: 0.25,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle grid pattern for details
    const gridHelper = new THREE.GridHelper(30, 30, '#e5c188', '#1a1a1a');
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;
    sceneRef.current = scene;

    // --- 7. Materials Setup ---
    // High-end clearcoat metallic paint
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03
    });
    carBodyMatRef.current = bodyMat;

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.02,
      metalness: 0.1,
      transmission: 1.0,
      transparent: true,
      opacity: 0.35,
      ior: 1.5
    });

    const isWheelDark = wheelStyle.toLowerCase().includes('dark') || wheelStyle.toLowerCase().includes('black');
    const rimsMat = new THREE.MeshStandardMaterial({
      color: isWheelDark ? '#1a1a1a' : '#d5d5d5',
      roughness: 0.18,
      metalness: 0.9
    });
    rimsMatRef.current = rimsMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.5,
      metalness: 0.7
    });

    // --- 8. Load Real glTF/GLB Model ---
    const loader = new GLTFLoader();
    
    // Configure Draco Loader using local decoders for offline reliability
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');
    loader.setDRACOLoader(dracoLoader);

    wheelsRef.current = [];

    loader.load(
      '/models/ferrari.glb',
      (gltf) => {
        const carModel = gltf.scene;

        // Center the model in the showroom canvas
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        
        // Center horizontally (X & Z) and place the bottom Y of the car exactly resting on the floor (y = 0.02)
        carModel.position.x = -center.x;
        carModel.position.z = -center.z;
        carModel.position.y = -box.min.y + 0.02; // Aligns the tires to rest exactly on the floor grid!

        // Traverse meshes to set shadow settings and update materials
        carModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Apply custom PBR materials based on mesh names
            if (mesh.name === 'body') {
              mesh.material = bodyMat;
            } else if (mesh.name === 'glass') {
              mesh.material = glassMat;
            } else if (mesh.name.toLowerCase().includes('rim')) {
              mesh.material = rimsMat;
            } else if (mesh.name.toLowerCase().includes('carbon') || mesh.name.toLowerCase().includes('spoiler')) {
              mesh.material = carbonMat;
            }
          }
        });

        // Store references to the 4 wheels for animation
        const wheelNames = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
        wheelNames.forEach((name) => {
          const wheel = carModel.getObjectByName(name);
          if (wheel) {
            wheelsRef.current.push(wheel);
          }
        });

        scene.add(carModel);
        setLoading(false);
      },
      (xhr) => {
        // Log progress if needed
        const pct = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading 3D model: ${pct.toFixed(0)}%`);
      },
      (err) => {
        console.error('Error loading glTF model', err);
        setError('Failed to load 3D asset. Check connection.');
        setLoading(false);
      }
    );

    // --- 9. Animation & Render loop ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Spin the wheels slowly to simulate idling/driving
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += 0.015;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update paint color dynamically
  useEffect(() => {
    if (carBodyMatRef.current) {
      carBodyMatRef.current.color.set(paintColor);
    }
  }, [paintColor]);

  // Update wheels style dynamically
  useEffect(() => {
    if (rimsMatRef.current) {
      const isDark = wheelStyle.toLowerCase().includes('dark') || wheelStyle.toLowerCase().includes('black');
      rimsMatRef.current.color.set(isDark ? '#121212' : '#d5d5d5');
      rimsMatRef.current.roughness = isDark ? 0.35 : 0.18;
    }
  }, [wheelStyle]);

  // Update lighting backdrop theme dynamically
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    switch (backdropTheme) {
      case 'studio-noir':
        scene.background = new THREE.Color('#0a0a0a');
        scene.fog = new THREE.FogExp2('#0a0a0a', 0.08);
        if (ambientLightRef.current) {
          ambientLightRef.current.color.set('#121212');
          ambientLightRef.current.intensity = 0.6;
        }
        if (mainSpotLightRef.current) {
          mainSpotLightRef.current.color.set('#ffffff');
          mainSpotLightRef.current.intensity = 15;
        }
        if (dirLightBlueRef.current) {
          dirLightBlueRef.current.color.set('#00a2ff');
          dirLightBlueRef.current.intensity = 3.0;
        }
        if (dirLightGoldRef.current) {
          dirLightGoldRef.current.color.set('#e5c188');
          dirLightGoldRef.current.intensity = 3.5;
        }
        if (frontFillLightRef.current) {
          frontFillLightRef.current.color.set('#ffffff');
          frontFillLightRef.current.intensity = 1.5;
        }
        break;
      case 'cyber-neon':
        scene.background = new THREE.Color('#030308');
        scene.fog = new THREE.FogExp2('#030308', 0.07);
        if (ambientLightRef.current) {
          ambientLightRef.current.color.set('#0a0515');
          ambientLightRef.current.intensity = 0.8;
        }
        if (mainSpotLightRef.current) {
          mainSpotLightRef.current.color.set('#00ffff');
          mainSpotLightRef.current.intensity = 12;
        }
        if (dirLightBlueRef.current) {
          dirLightBlueRef.current.color.set('#ff007f'); // Hot pink
          dirLightBlueRef.current.intensity = 5.0;
        }
        if (dirLightGoldRef.current) {
          dirLightGoldRef.current.color.set('#9d00ff'); // Neon purple
          dirLightGoldRef.current.intensity = 4.5;
        }
        if (frontFillLightRef.current) {
          frontFillLightRef.current.color.set('#00ffff');
          frontFillLightRef.current.intensity = 1.0;
        }
        break;
      case 'liquid-gold':
        scene.background = new THREE.Color('#0c0904');
        scene.fog = new THREE.FogExp2('#0c0904', 0.09);
        if (ambientLightRef.current) {
          ambientLightRef.current.color.set('#1a1205');
          ambientLightRef.current.intensity = 0.7;
        }
        if (mainSpotLightRef.current) {
          mainSpotLightRef.current.color.set('#ffb700');
          mainSpotLightRef.current.intensity = 20;
        }
        if (dirLightBlueRef.current) {
          dirLightBlueRef.current.color.set('#ffaa00');
          dirLightBlueRef.current.intensity = 4.0;
        }
        if (dirLightGoldRef.current) {
          dirLightGoldRef.current.color.set('#e5c188');
          dirLightGoldRef.current.intensity = 5.0;
        }
        if (frontFillLightRef.current) {
          frontFillLightRef.current.color.set('#ffe2a3');
          frontFillLightRef.current.intensity = 2.0;
        }
        break;
      case 'sunset-drive':
        scene.background = new THREE.Color('#0f0814');
        scene.fog = new THREE.FogExp2('#0f0814', 0.08);
        if (ambientLightRef.current) {
          ambientLightRef.current.color.set('#1c0a24');
          ambientLightRef.current.intensity = 0.7;
        }
        if (mainSpotLightRef.current) {
          mainSpotLightRef.current.color.set('#ff9966');
          mainSpotLightRef.current.intensity = 16;
        }
        if (dirLightBlueRef.current) {
          dirLightBlueRef.current.color.set('#ff5e62');
          dirLightBlueRef.current.intensity = 4.0;
        }
        if (dirLightGoldRef.current) {
          dirLightGoldRef.current.color.set('#a18cd1');
          dirLightGoldRef.current.intensity = 4.5;
        }
        if (frontFillLightRef.current) {
          frontFillLightRef.current.color.set('#fbc2eb');
          frontFillLightRef.current.intensity = 1.5;
        }
        break;
    }

    // Recreate grid lines with appropriate theme colors
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
    }
    
    let gridColor1 = '#e5c188';
    let gridColor2 = '#1a1a1a';
    if (backdropTheme === 'cyber-neon') {
      gridColor1 = '#ff007f';
      gridColor2 = '#00ffff';
    } else if (backdropTheme === 'liquid-gold') {
      gridColor1 = '#e5c188';
      gridColor2 = '#3a2b15';
    } else if (backdropTheme === 'sunset-drive') {
      gridColor1 = '#ff5e62';
      gridColor2 = '#2d1b4e';
    }

    const newGrid = new THREE.GridHelper(30, 30, gridColor1, gridColor2);
    newGrid.position.y = 0.005;
    scene.add(newGrid);
    gridHelperRef.current = newGrid;

  }, [backdropTheme]);

  const BACKDROPS = [
    { id: 'studio-noir', name: 'Studio Noir', icon: 'brightness_4' },
    { id: 'cyber-neon', name: 'Cyber Neon', icon: 'palette' },
    { id: 'liquid-gold', name: 'Liquid Gold', icon: 'filter_vintage' },
    { id: 'sunset-drive', name: 'Sunset Drive', icon: 'wb_twilight' }
  ];

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-inner group">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Backdrop Theme Toggles */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <span className="text-[7.5px] font-label-caps text-white/50 tracking-widest uppercase font-extrabold">Studio Backdrop</span>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-1 flex gap-1 shadow-2xl">
          {BACKDROPS.map((theme) => {
            const isActive = backdropTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setBackdropTheme(theme.id)}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 relative group/btn cursor-pointer ${
                  isActive 
                    ? 'bg-secondary-fixed-dim text-black shadow-lg font-bold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={theme.name}
              >
                <span className="material-symbols-outlined text-[16px]">{theme.icon}</span>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/90 text-white text-[8px] rounded border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200">
                  {theme.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0d0d0d]/90 flex flex-col items-center justify-center gap-4 text-white z-10">
          <span className="w-10 h-10 border-4 border-secondary-fixed-dim border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-label-caps tracking-widest text-secondary-fixed-dim font-bold uppercase">
            Loading Real 3D Showroom...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-[#0d0d0d]/95 flex flex-col items-center justify-center gap-4 text-white z-10 px-6 text-center">
          <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
          <p className="text-xs font-semibold text-white">{error}</p>
          <p className="text-[10px] text-white/50">Verify network connection or verify that models folder contains public/models/ferrari.glb</p>
        </div>
      )}

      {/* Overlay controls helper */}
      <div className="absolute bottom-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-label-caps tracking-wider text-white/70 flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-300">
        <span className="material-symbols-outlined text-[12px] text-secondary-fixed-dim">3d_rotation</span>
        <span>Drag to Orbit • Pinch/Scroll to Zoom</span>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-label-caps tracking-wider text-secondary-fixed-dim font-bold flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>3D GLB ACTIVE</span>
      </div>
    </div>
  );
}
