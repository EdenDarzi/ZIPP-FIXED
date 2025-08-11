'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/theme-context';

interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function MetaballsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const metaballs = useRef<Metaball[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width = window.innerWidth * 0.8;
    const height = canvas.height = window.innerHeight * 0.6;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const numMetaballs = 25;
    metaballs.current = [];

    // Initialize metaballs
    for (let i = 0; i < numMetaballs; i++) {
      const radius = Math.random() * 40 + 15;
      metaballs.current.push({
        x: Math.random() * (width - 2 * radius) + radius,
        y: Math.random() * (height - 2 * radius) + radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: radius * 0.75
      });
    }

    const vertexShaderSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Check if we're in dark mode
    const isDark = document.documentElement.classList.contains('dark');
    
    const fragmentShaderSrc = `
      precision highp float;
      const float WIDTH = ${width.toFixed(1)};
      const float HEIGHT = ${height.toFixed(1)};
      uniform vec3 metaballs[${numMetaballs}];

      void main(){
        float x = gl_FragCoord.x;
        float y = gl_FragCoord.y;
        float sum = 0.0;
        
        for (int i = 0; i < ${numMetaballs}; i++) {
          vec3 metaball = metaballs[i];
          float dx = metaball.x - x;
          float dy = metaball.y - y;
          float radius = metaball.z;
          sum += (radius * radius) / (dx * dx + dy * dy);
        }

        if (sum >= 0.99) {
          ${isDark ? `
          // Dark mode colors - vibrant and bright
          vec3 color1 = vec3(0.8, 0.4, 1.0);   // Bright purple
          vec3 color2 = vec3(0.4, 0.6, 1.0);   // Bright blue  
          vec3 color3 = vec3(0.2, 0.9, 0.6);   // Bright green
          float alpha = 0.9;
          ` : `
          // Light mode colors - saturated and visible
          vec3 color1 = vec3(0.6, 0.2, 0.8);   // Deep purple
          vec3 color2 = vec3(0.2, 0.4, 0.9);   // Deep blue
          vec3 color3 = vec3(0.1, 0.7, 0.4);   // Deep green
          float alpha = 0.8;
          `}
          vec3 finalColor = mix(color1, mix(color2, color3, sin(x * 0.01 + y * 0.01) * 0.5 + 0.5), cos(x * 0.008) * 0.5 + 0.5);
          gl_FragColor = vec4(finalColor, alpha);
          return;
        }

        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    `;

    function compileShader(shaderSource: string, shaderType: number) {
      const shader = gl.createShader(shaderType);
      if (!shader) throw 'Failed to create shader';
      
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
      }
      return shader;
    }

    function getUniformLocation(program: WebGLProgram, name: string) {
      const uniformLocation = gl.getUniformLocation(program, name);
      if (uniformLocation === -1) {
        throw 'Can not find uniform ' + name + '.';
      }
      return uniformLocation;
    }

    function getAttribLocation(program: WebGLProgram, name: string) {
      const attributeLocation = gl.getAttribLocation(program, name);
      if (attributeLocation === -1) {
        throw 'Can not find attribute ' + name + '.';
      }
      return attributeLocation;
    }

    try {
      const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

      const program = gl.createProgram();
      if (!program) throw 'Failed to create program';
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      const vertexData = new Float32Array([
        -1.0,  1.0, // top left
        -1.0, -1.0, // bottom left
        1.0,  1.0, // top right
        1.0, -1.0, // bottom right
      ]);

      const vertexDataBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

      const positionHandle = getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionHandle);
      gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

      const metaballsHandle = getUniformLocation(program, 'metaballs');

      // Enable blending for transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      function loop() {
        // Update metaballs
        for (let i = 0; i < numMetaballs; i++) {
          const metaball = metaballs.current[i];
          metaball.x += metaball.vx;
          metaball.y += metaball.vy;

          if (metaball.x < metaball.r || metaball.x > width - metaball.r) metaball.vx *= -1;
          if (metaball.y < metaball.r || metaball.y > height - metaball.r) metaball.vy *= -1;
        }

        const dataToSendToGPU = new Float32Array(3 * numMetaballs);
        for (let i = 0; i < numMetaballs; i++) {
          const baseIndex = 3 * i;
          const mb = metaballs.current[i];
          dataToSendToGPU[baseIndex + 0] = mb.x;
          dataToSendToGPU[baseIndex + 1] = mb.y;
          dataToSendToGPU[baseIndex + 2] = mb.r;
        }

        gl.uniform3fv(metaballsHandle, dataToSendToGPU);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationRef.current = requestAnimationFrame(loop);
      }

      loop();
    } catch (error) {
      console.error('WebGL setup failed:', error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  // Check if we're in dark mode for styling
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${isDark ? 'opacity-70' : 'opacity-60'}`}
      style={{ 
        mixBlendMode: isDark ? 'normal' : 'normal'
      }}
    />
  );
}
