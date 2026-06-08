import Scene from '@/components/Scene';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 3D WebGL Layer */}
      <Scene />

      {/* HTML DOM Layer - Scrollable Content */}
      <div className="relative z-10">
        
        {/* Sección Hero (100vh) */}
        <section className="h-screen flex flex-col justify-end p-12 md:p-24 pb-24">
          <div className="max-w-2xl text-white mix-blend-difference">
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">
              Arquitectura Web<br/>de Vanguardia
            </h1>
            <p className="text-gray-400 text-lg uppercase tracking-[0.2em] font-mono">
              Basado en el manual técnico de élite
            </p>
          </div>
          <div className="absolute bottom-12 left-12 animate-bounce text-gray-500 font-mono text-sm tracking-widest">
            ↓ Scroll para explorar
          </div>
        </section>

        {/* Sección de Contenido (Espacio para scroll) */}
        <section className="min-h-screen bg-black/80 backdrop-blur-md border-t border-white/10 p-12 md:p-24 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto text-gray-300 font-light leading-relaxed">
            <div>
              <h2 className="text-3xl text-white mb-6 font-medium">Intersección Kinestésica</h2>
              <p className="mb-6">
                El desplazamiento que experimentas ahora mismo no es el nativo del navegador. Está intervenido matemáticamente por <strong>Lenis</strong>, recreando una amortiguación inercial perfecta que sincroniza el árbol DOM con el Viewport de WebGL en latencia sub-milisegundo.
              </p>
              <p>
                Esta capa HTML ("DOM") flota pasivamente sobre el motor de renderizado, permitiendo indexación SEO impecable sin sacrificar la interactividad profunda del fragment shader que opera de fondo.
              </p>
            </div>
            <div>
              <h2 className="text-3xl text-white mb-6 font-medium">Renderizado Procedural</h2>
              <p className="mb-6">
                Lo que observaste en la introducción no son modelos 3D exportados de Blender. Son funciones puras matemáticas de distancia con signo (SDF) esculpiendo el vacío espacio-temporal a través de <strong>Raymarching</strong>.
              </p>
              <p>
                Las fusiones orgánicas se logran interpolando gradientes de distancia, fundiendo gotas líquidas que refractan la luz simulando aberración cromática óptica. Esto es ingeniería pura en GLSL.
              </p>
            </div>
          </div>
        </section>

        <section className="h-[50vh] flex items-center justify-center bg-black">
          <h2 className="text-white text-5xl font-black tracking-tighter mix-blend-difference">
            VANGUARD
          </h2>
        </section>

      </div>
    </main>
  );
}
