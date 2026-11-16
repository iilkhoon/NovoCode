"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Living gradient — a WebGL "liquid light" in the brand colours (blue → violet → pink → orange).
 * Domain-warped noise flows slowly; it rises from the bottom and fades into the page so text
 * on top stays readable. Renders at reduced resolution (gradients don't need pixels), ~40fps,
 * pauses off-screen / in hidden tabs, freezes under reduced motion, and falls back to the
 * CSS aurora when WebGL is unavailable.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 bg;uniform float k;uniform float top;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.45;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=uv*vec2(r.x/r.y,1.)*.85;
  float s=t*.045;
  vec2 q=vec2(fbm(p+vec2(0.,s)),fbm(p+vec2(5.2,1.3)-s));
  vec2 w=vec2(fbm(p+2.6*q+vec2(1.7,9.2)+s*1.4),fbm(p+2.6*q+vec2(8.3,2.8)-s*1.1));
  float f=fbm(p+2.4*w);
  vec3 col=mix(c0,c1,smoothstep(.35,.65,q.x+.12*sin(s*3.)));
  col=mix(col,c2,smoothstep(.42,.68,w.y));
  col=mix(col,c3,smoothstep(.45,.72,f)*.9);
  col+=.07*smoothstep(.6,.85,f);
  float m=smoothstep(top,.0,uv.y-.05*sin(uv.x*3.+s*4.));
  col=mix(bg,col,clamp(m*k,0.,1.));
  gl_FragColor=vec4(col,1.);
}`;

const hex = (h: string) => {
  const v = h.trim().replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function GradientBackdrop({ className, intensity = 1, reach = 0.9, colors, bg: bgColor }: { className?: string; intensity?: number; reach?: number; colors?: [string, string, string, string]; bg?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return setFallback(true);

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFallback(true);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uR = u("r"), uT = u("t"), uBg = u("bg"), uK = u("k"), uTop = u("top");
    const uc = [u("c0"), u("c1"), u("c2"), u("c3")];

    const setColors = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      const pal = colors ?? (dark ? ["#2c4fd8", "#5b3df5", "#c2337a", "#e0703a"] : ["#5b8cff", "#7a5cff", "#ff6fa3", "#ffab6e"]);
      pal.forEach((c, i) => gl.uniform3fv(uc[i], hex(c)));
      const bg = bgColor ?? (getComputedStyle(document.documentElement).getPropertyValue("--color-wool") || (dark ? "#09090b" : "#f7f7f8"));
      gl.uniform3fv(uBg, hex(bg));
      gl.uniform1f(uK, intensity * (dark ? 0.85 : 1));
      gl.uniform1f(uTop, reach);
    };

    const SCALE = 0.4; // render at 40% — the blur is the look
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * SCALE));
      canvas.height = Math.max(2, Math.round(r.height * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
    };

    let t = 20 + Math.random() * 40, raf = 0, last = 0, visible = true;
    const draw = () => {
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    setColors();
    resize();
    draw();

    const ro = new ResizeObserver(() => (resize(), draw()));
    ro.observe(canvas);
    const mo = new MutationObserver(() => (setColors(), draw()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => (ro.disconnect(), mo.disconnect());

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 25) return;
      t += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
    };
  }, [intensity, reach, colors, bgColor]);

  if (fallback)
    return (
      <div aria-hidden className={cn("aurora", className)}>
        <i />
        <i />
        <i />
        <i />
      </div>
    );
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
