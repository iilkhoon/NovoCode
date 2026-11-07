"use client";
import { useEffect, useRef } from "react";

/* Shared 3D simplex noise (Ashima / Ian McEwan, MIT). */
const SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

/* Liquid-bronze wave background: palette drifts bronze → sapphire with scroll. */
const WAVE_FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uTime; uniform vec2 uResolution; uniform vec2 uMouse; uniform float uScroll;
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  float aspect = uResolution.x / uResolution.y;
  float time = uTime * 0.08;
  float scroll = uScroll;
  float scrollDeform = scroll * 5.0;
  vec2 w = uv;
  w.x += sin(uv.y * 2.5 + time * 0.2 + scrollDeform) * 0.35;
  w.y += cos(uv.x * 2.5 - time * 0.15 - scrollDeform * 0.8) * 0.35;
  w.x += sin(uv.y * 1.2 - time * 0.1 - scrollDeform * 1.5) * 0.25;
  w.y += cos(uv.x * 1.2 + time * 0.18 + scrollDeform * 1.2) * 0.25;
  w += vec2(scroll * 0.04, -scroll * 0.02) + vec2(uMouse.x * aspect * 0.05, uMouse.y * 0.05);
  vec2 d1 = vec2(cos(0.6), sin(0.6)), d2 = vec2(cos(-0.7), sin(-0.7)), d3 = vec2(cos(1.2), sin(1.2));
  float w1 = sin(dot(w, d1) * 2.4 + time);
  float w2 = cos(dot(w, d2) * 3.2 - time * 1.4 + w1 * 0.4);
  float w3 = sin(dot(w, d3) * 4.0 + time * 1.8 + w2 * 0.5);
  float f = w1 * 0.5 + w2 * 0.35 + w3 * 0.15;
  float crest = pow(max(0.0, 1.0 - abs(f - 0.1)), 2.5) * 0.5 + pow(max(0.0, 1.0 - abs(f - 0.15)), 8.0) * 0.9;
  float t = smoothstep(0.0, 1.0, scroll);
  vec3 sh = mix(vec3(0.0010, 0.0006, 0.0004), vec3(0.0004, 0.0006, 0.0012), t);
  vec3 a  = mix(vec3(0.085, 0.040, 0.015), vec3(0.015, 0.035, 0.065), t);
  vec3 b  = mix(vec3(0.050, 0.022, 0.008), vec3(0.008, 0.020, 0.045), t);
  vec3 cr = mix(vec3(0.45, 0.30, 0.18), vec3(0.18, 0.35, 0.55), t);
  vec3 col = sh;
  col = mix(col, b, smoothstep(-0.6, 0.2, f));
  col = mix(col, a, smoothstep(0.0, 0.8, f));
  col += cr * crest * 1.4;
  col *= 1.0 - dot(uv, uv) * 0.12;
  gl_FragColor = vec4(col * 0.55, 1.0);
}`;

type Stop = { p: number; v: number };
function sample(stops: Stop[], p: number) {
  if (p <= stops[0].p) return stops[0].v;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      return a.v + (b.v - a.v) * t * t * (3 - 2 * t);
    }
  }
  return stops[stops.length - 1].v;
}

/*
 * Placement is declared by the sections themselves: <section data-stage="left|right|far|center">.
 * "left"/"right" = where the FORM sits (copy goes on the other side); "far" = small, behind wide content.
 */
const PLACEMENT: Record<string, { side: number; radius: number; y: number }> = {
  hero: { side: 1, radius: 4.6, y: 0 },
  right: { side: 1.5, radius: 7, y: 0 },
  left: { side: -1.5, radius: 7, y: 0 },
  far: { side: 1.55, radius: 12, y: -0.9 },
  center: { side: 0, radius: 8.5, y: -1.35 },
};
const AMP: Stop[] = [{ p: 0, v: 0.1 }, { p: 0.3, v: 0.22 }, { p: 0.6, v: 0.18 }, { p: 1, v: 0.07 }];
const FREQ: Stop[] = [{ p: 0, v: 1.05 }, { p: 0.3, v: 1.45 }, { p: 0.6, v: 1.7 }, { p: 1, v: 1.0 }];
const TWIST: Stop[] = [{ p: 0, v: 0.0 }, { p: 0.3, v: 1.3 }, { p: 0.6, v: -0.9 }, { p: 1, v: 0 }];

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const canvas = canvasRef.current;
      if (disposed || !canvas) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
      } catch {
        canvas.style.display = "none";
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#000000");
      scene.fog = new THREE.FogExp2("#000000", 0.035);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.35;

      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.4, 4.1);
      scene.add(camera);

      // ---- background wave plane, glued to the camera ----
      const waveUniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2() },
        uScroll: { value: 0 },
      };
      const wave = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.ShaderMaterial({
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: WAVE_FRAG,
          uniforms: waveUniforms,
          depthWrite: false,
          depthTest: false,
          fog: false,
        })
      );
      wave.position.z = -12;
      wave.renderOrder = -10;
      camera.add(wave);

      // ---- lights (chiaroscuro) ----
      scene.add(new THREE.AmbientLight("#ffffff", 0.08));
      const key = new THREE.SpotLight("#ffffff", 60, 0, Math.PI / 4, 0.9, 1.2);
      key.position.set(4, 6, 3);
      scene.add(key);
      const rim = new THREE.DirectionalLight("#cfe4ff", 3.2);
      rim.position.set(-5, 3, -4);
      scene.add(rim);
      const fill = new THREE.DirectionalLight("#ffe6cc", 0.5);
      fill.position.set(-2, -4, 2);
      scene.add(fill);

      // ---- the molten form ----
      const form = new THREE.Group();
      scene.add(form);
      const formUniforms = { uTime: { value: 0 }, uAmp: { value: 0.13 }, uFreq: { value: 1.5 }, uTwist: { value: 0 } };
      const mat = new THREE.MeshPhysicalMaterial({ color: "#b47a4c", metalness: 0.95, roughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.4 });
      mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, formUniforms);
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
            uniform float uTime; uniform float uAmp; uniform float uFreq; uniform float uTwist;
            ${SNOISE}
            vec3 twistY(vec3 p, float k){ float a = p.y * k; float c = cos(a), s = sin(a); return vec3(c*p.x - s*p.z, p.y, s*p.x + c*p.z); }
            vec3 deform(vec3 p){
              vec3 q = twistY(p, uTwist);
              float n = snoise(q * uFreq + vec3(0.0, uTime * 0.22, uTime * 0.12));
              float n2 = snoise(q * uFreq * 1.7 - vec3(uTime * 0.15));
              return q + normalize(p) * (n * uAmp + n2 * uAmp * 0.1);
            }`
          )
          .replace(
            "#include <beginnormal_vertex>",
            `vec3 pos0 = position;
            vec3 tang = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
            vec3 bitan = normalize(cross(normal, tang));
            float eps = 0.012;
            vec3 dp = deform(pos0);
            vec3 dt = deform(pos0 + tang * eps) - dp;
            vec3 db = deform(pos0 + bitan * eps) - dp;
            vec3 objectNormal = normalize(cross(dt, db));
            #ifdef USE_TANGENT
              vec3 objectTangent = vec3( tangent.xyz );
            #endif`
          )
          .replace("#include <begin_vertex>", `vec3 transformed = dp;`);
      };
      const formMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, mobile ? 40 : 64), mat);
      form.add(formMesh);

      // orbit rings + a small travelling bead
      const ringMat = new THREE.MeshBasicMaterial({ color: "#e6b78f", transparent: true, opacity: 0.45, fog: false });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.0045, 6, 220), ringMat);
      ring1.rotation.set(1.25, 0.15, 0.4);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.003, 6, 260), ringMat.clone());
      (ring2.material as import("three").MeshBasicMaterial).opacity = 0.25;
      ring2.rotation.set(1.6, -0.5, -0.2);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: "#ffd9b0", fog: false }));
      ring1.add(bead);
      form.add(ring1, ring2);

      // ---- forge sparks ----
      const SPARKS = mobile ? 260 : 450;
      const sTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 16;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.25, "rgba(255,255,255,0.85)");
        g.addColorStop(0.6, "rgba(255,255,255,0.3)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(c);
      })();
      const sPos = new Float32Array(SPARKS * 3), sCol = new Float32Array(SPARKS * 3);
      const sData: { vx: number; vy: number; vz: number; sw: number; sr: number; ph: number }[] = [];
      for (let i = 0; i < SPARKS; i++) {
        sPos.set([(Math.random() - 0.5) * 6.5, (Math.random() - 0.5) * 5 - 0.5, (Math.random() - 0.5) * 6.5], i * 3);
        if (Math.random() < 0.6) sCol.set([1, 0.4 + Math.random() * 0.15, 0.05 + Math.random() * 0.1], i * 3);
        else sCol.set([0.55 + Math.random() * 0.15, 0.82 + Math.random() * 0.12, 1], i * 3);
        sData.push({ vx: (Math.random() - 0.5) * 0.4, vy: 0.15 + Math.random() * 0.3, vz: (Math.random() - 0.5) * 0.4, sw: 0.5 + Math.random() * 1.5, sr: 0.05 + Math.random() * 0.15, ph: Math.random() * Math.PI * 2 });
      }
      const sGeo = new THREE.BufferGeometry();
      sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      sGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
      const sparks = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, map: sTex })
      );
      scene.add(sparks);

      // ---- sizing / input ----
      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        waveUniforms.uResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      };
      resize();
      window.addEventListener("resize", resize);
      let mx = 0, my = 0, tmx = 0, tmy = 0;
      const onMove = (e: PointerEvent) => {
        tmx = (e.clientX / window.innerWidth) * 2 - 1;
        tmy = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // ---- loop ----
      const clock = new THREE.Clock();
      const target = new THREE.Vector3();
      const camGoal = new THREE.Vector3();
      let cur = 0;
      let entry = 0;
      let sideCur = 1, radiusCur = 4.5, yCur = 0;
      let sections: HTMLElement[] = [];
      const collect = () => (sections = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]")));
      collect();
      const mo = new MutationObserver(collect);
      mo.observe(document.body, { childList: true, subtree: true });
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const goal = max > 0 ? window.scrollY / max : 0;
        cur = reduce ? goal : cur + (goal - cur) * Math.min(1, dt * 2.2);
        const velocity = Math.abs(goal - cur);
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;
        entry = Math.min(1, entry + dt / 1.6);
        const e = 1 - Math.pow(1 - entry, 3);

        // form
        formUniforms.uTime.value = reduce ? t * 0.3 : t;
        formUniforms.uAmp.value = sample(AMP, cur);
        formUniforms.uFreq.value = sample(FREQ, cur);
        formUniforms.uTwist.value = sample(TWIST, cur);
        form.position.y = -1.4 * (1 - e) - 0.05;
        form.scale.setScalar(0.85 + 0.15 * e);
        form.rotation.y = mx * 0.25 + t * 0.05;
        form.rotation.x = my * 0.15;
        ring1.rotation.z += dt * 0.12;
        ring2.rotation.z -= dt * 0.07;
        const a = t * 0.6;
        bead.position.set(Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0);

        // sparks: faster + more turbulent while the page is moving
        const speed = 1 + velocity * 9;
        const turb = velocity * 0.8;
        for (let i = 0; i < SPARKS; i++) {
          const k = i * 3, d = sData[i];
          sPos[k] += d.vx * dt * speed;
          sPos[k + 1] += d.vy * dt * speed;
          sPos[k + 2] += d.vz * dt * speed;
          const sway = d.sr * (1 + turb * 4);
          sPos[k] += Math.sin(t * d.sw + d.ph) * sway * dt;
          sPos[k + 2] += Math.cos(t * d.sw + d.ph) * sway * dt;
          if (sPos[k + 1] > 3 || Math.abs(sPos[k]) > 3.5 || Math.abs(sPos[k + 2]) > 3.5) {
            sPos[k + 1] = -2.5;
            sPos[k] = (Math.random() - 0.5) * 3;
            sPos[k + 2] = (Math.random() - 0.5) * 3;
          }
        }
        sGeo.attributes.position.needsUpdate = true;

        // camera: full orbit over the page, swinging the form clear of the copy
        const phi = cur * Math.PI * 2;
        const lift = Math.sin(cur * Math.PI);
        const mid = window.innerHeight * 0.5;
        const sec = sections.find((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= mid && r.bottom >= mid;
        });
        const place = PLACEMENT[sec?.dataset.stage ?? "far"] ?? PLACEMENT.far;
        const k = reduce ? 1 : Math.min(1, dt * 1.6);
        sideCur += (place.side - sideCur) * k;
        radiusCur += (place.radius - radiusCur) * k;
        yCur += (place.y - yCur) * k;
        const radius = radiusCur * (mobile ? 2 : 1);
        camGoal.set(radius * Math.sin(phi), 0.35 + lift * 0.8, radius * Math.cos(phi));
        camera.position.copy(camGoal); // cur is already smoothed — stay on the orbit, never cut through the form
        // offset the look-at in camera space so the form lands ~quarter-screen from the edge
        const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
        const side = mobile ? 0 : -sideCur * radius * halfW * 0.5;
        target.set(side, -0.15 + yCur + (mobile ? -2.1 : 0), 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), phi);
        camera.lookAt(target);

        waveUniforms.uTime.value = t;
        waveUniforms.uScroll.value = cur;
        waveUniforms.uMouse.value.set(mx, -my);

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        mo.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        scene.traverse((o) => {
          const m = o as import("three").Mesh;
          m.geometry?.dispose();
          const mm = m.material as import("three").Material | undefined;
          mm?.dispose();
        });
        sTex.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 block h-lvh w-screen" />;
}
