# 🎵 SUNO — Contexto Completo

> Documento de referencia para usar **Suno** (generador de música con IA) de forma efectiva.
> Optimizado para lectura en móvil. Compartible.
> Última actualización: mayo 2026 · Fuente: [help.suno.com](https://help.suno.com)

---

## ⚡ TL;DR

- **Qué es:** Suno crea canciones completas (música + voz) a partir de texto.
- **Dónde:** [suno.com/create](https://suno.com/create) · iOS · Android.
- **Modelo recomendado hoy:** **v5** o **v5.5** (mejor calidad y voces).
- **Modos:** *Simple* (describe y listo), *Custom* (control total con letra propia), *Sounds* (SFX y samples).
- **¿Hay MCP / API oficial?** ❌ **No.** Suno no tiene API pública oficial. Solo hay APIs no-oficiales de terceros (riesgo legal y de estabilidad).

---

## 📋 Índice

1. [¿Qué es Suno?](#qué-es-suno)
2. [Modelos disponibles](#modelos-disponibles)
3. [Modos de creación](#modos-de-creación)
4. [Cómo escribir un buen prompt](#cómo-escribir-un-buen-prompt)
5. [Glosario musical](#glosario-musical)
6. [Letras (lyrics)](#letras-lyrics)
7. [Personas y Voices](#personas-y-voices)
8. [Custom Models](#custom-models-v55)
9. [Editar canciones](#editar-canciones)
10. [Upload Audio](#upload-audio)
11. [Suno Sounds](#suno-sounds)
12. [Exclude (prompt negativo)](#exclude-prompt-negativo)
13. [Descargar y compartir](#descargar-y-compartir)
14. [Moderación y restricciones](#moderación-y-restricciones)
15. [API / MCP — estado real](#api--mcp-estado-real)
16. [Recetas listas](#recetas-listas)
17. [Prompts para DETENIDO RPG](#prompts-para-detenido-rpg)

---

## ¿Qué es Suno?

Suno es una IA generativa de música. Le das una descripción y/o una letra, y crea una canción completa (instrumentos + voz) en segundos.

- Empezó en Discord (2023), hoy es app web y móvil.
- Cada canción usa **créditos**. Plan free tiene créditos diarios limitados.
- Plan **Pro** y **Premier** desbloquean: WAV, Custom Models, Voices propias, Crop, Replace Section, Cover, audio de mayor duración.

---

## Modelos disponibles

### Línea de tiempo (sept 2025 en adelante)

- **v2** — Otoño 2023 · max 1:20 min · ❌ deprecado
- **v3** — Primavera 2024 · max 2:00 min · ❌ deprecado
- **v3.5** — Verano 2024 · max 4 min · estructura mejor
- **v4** — Nov 2024 · vocales más limpias, primera versión con Extend / Cover / Persona
- **v4.5** — May 2025 · hasta **8 min** en primera generación, mejor adherencia al prompt, mashups inteligentes
- **v4.5+** — Jul 2025 · Add Vocals / Add Instrumental
- **v5** — Sept 2025 · **calidad audio superior**, voces auténticas, 10× más rápido
- **v5.5** — 2026 · más expresivo + **Voices** (tu voz real), **Custom Models**, **My Taste**

### ¿Cuál elegir?

| Quiero... | Modelo |
|---|---|
| Mejor calidad general | **v5** o **v5.5** |
| Canción larga (hasta 8 min) | v4.5 / v5 / v5.5 |
| Mi propia voz en la canción | **v5.5** (requiere setup de Voice) |
| Solo experimentar gratis | v3.5 / v4 |

Cambias modelo en el dropdown **a la derecha de Custom mode** en [suno.com/create](https://suno.com/create).

---

## Modos de creación

### 🟢 Simple Mode (rápido)

1. Ve a [suno.com/create](https://suno.com/create).
2. Selecciona **Simple**.
3. Escribe una descripción: *"A synth pop song about having fun all night"*.
4. (Opcional) Click en el dado 🎲 para prompt aleatorio.
5. Click **Create**.

### 🟡 Custom Mode (control total)

Permite especificar:
- **Style of Music** — géneros, instrumentos, mood, BPM, época.
- **Lyrics** — escribe tú o usa **Write with Suno** (modelos: Classic o ReMi).
- **Title** — título del track.
- **Persona / Voice** — voz reutilizable.
- **Advanced Options** → **Exclude** (lo que NO quieres).

### 🟣 Sounds Mode (SFX / samples)

Para generar sonidos individuales (no canciones completas). Ver sección [Suno Sounds](#suno-sounds).

---

## Cómo escribir un buen prompt

### Fórmula básica

```
[Género] + [mood/emoción] + [instrumentos clave] + [BPM/tempo] + [época/estilo] + [detalle vocal]
```

### Ejemplos

- ✅ `Dark cinematic chiptune, slow piano arpeggio, melancholic Mexican noir mood, 90 BPM`
- ✅ `Aggressive courtroom RPG battle music, 16-bit JRPG style, dramatic strings, 140 BPM`
- ❌ `música chida` (demasiado vago)

### Reglas

1. **Sé específico pero conciso.** "Wind howling strong" > "the sound of a lot of wind".
2. **Mezcla géneros creativamente:** *"jazz-influenced hip-hop with soulful vocals"*.
3. **Usa términos musicales reales** (ver glosario abajo).
4. **Indica estructura cuando importe:** *"verse-chorus-verse with extended bridge"*.
5. **Apila efectos para atmósfera:** *"reverb-heavy ambient soundscape"*.
6. **Itera.** Las primeras 1-3 generaciones casi nunca son lo final.

---

## Glosario musical

> Términos que Suno entiende bien. Copia y pega en tus prompts.

### Tempo y ritmo

- **Tempo** — velocidad, en BPM.
- **Adagio** — lento (66-76 BPM).
- **Andante** — caminar moderado (76-108 BPM).
- **Allegro** — rápido y vivo (120-168 BPM).
- **Presto** — muy rápido (168-200 BPM).
- **Rubato** — tempo flexible y expresivo.
- **Syncopation** — énfasis en tiempos débiles.
- **Polyrhythm** — varios ritmos simultáneos.
- **Groove** — el "pocket" rítmico que te hace mover.
- **Downbeat / Upbeat** — tiempo fuerte / anticipación.

### Dinámicas

- **Crescendo / Diminuendo** — sube / baja gradual de volumen.
- **Forte (f) / Piano (p)** — fuerte / suave.
- **Fortissimo (ff) / Pianissimo (pp)** — muy fuerte / muy suave.
- **Staccato / Legato** — notas cortas / notas conectadas.
- **Vibrato / Tremolo** — variación de pitch / repetición rápida.

### Estructura de canción

- **Intro / Outro** — apertura / cierre.
- **Verse / Chorus / Bridge / Pre-Chorus** — verso / coro / puente / pre-coro.
- **Hook** — frase pegajosa.
- **Refrain** — línea repetida.
- **Break** — sección donde instrumentos paran.
- **Drop** — momento de máxima energía (EDM).
- **Coda** — sección final.

### Melodía y armonía

- **Major / Minor** — tonalidad brillante / oscura.
- **Chord progression** — secuencia de acordes.
- **Arpeggio** — notas de acorde en secuencia.
- **Counterpoint** — melodías independientes simultáneas.
- **Dissonance / Resolution** — tensión / liberación.

### Géneros

Blues · Jazz · Rock · Pop · Electronic/EDM · Hip-Hop · R&B · Country · Classical · Folk · Funk · Soul · Reggae · Metal · Ambient · Lo-fi · Chiptune · Synthwave · Trap · Drill · Bossa nova · Bolero · Ranchera · Norteño · Cumbia · Banda · Corrido tumbado.

### Texturas e instrumentación

- **Sparse** — pocos instrumentos, mucho espacio.
- **Dense** — muchas capas simultáneas.
- **Monophonic / Polyphonic** — una línea / varias.
- **Layering** — apilar sonidos.
- **Timbre** — color tonal del sonido.

### Técnicas vocales

- **Falsetto** — voz aguda, ligera.
- **Belt** — voz potente sostenida.
- **Melisma** — varias notas en una sílaba.
- **A cappella** — solo voz, sin instrumentos.
- **Call and response** — pregunta y respuesta.
- **Scat** — improvisación con sílabas (jazz).
- **Crooning** — voz íntima y suave.
- **Rapping** — letras rítmicas habladas.

### Producción y efectos

- **Reverb** — espacio (room, hall, cathedral).
- **Delay / Echo** — repeticiones.
- **Compression** — reduce dinámica.
- **Distortion** — sonido grueso/sucio.
- **Filter** — corta o realza frecuencias.
- **EQ** — balance frecuencial.
- **Panning** — posición estéreo.
- **Fade In/Out** — entradas y salidas.

### Avanzados

- **Modulation / Key Change** — cambio de tonalidad.
- **Time Signature** — 4/4, 3/4, 6/8, etc.
- **Cadence** — fórmula de resolución.
- **Ostinato** — patrón repetido.
- **Pedal Point** — nota sostenida bajo armonías cambiantes.

---

## Letras (lyrics)

### Tus propias letras

Pega tu letra en el campo **Lyrics** dentro de Custom Mode. Conservas el copyright de la letra.

### Etiquetas de estructura

Suno entiende marcadores en mayúsculas entre corchetes:

```
[Verse 1]
…letra…

[Chorus]
…letra…

[Bridge]
…letra…

[Outro]
…letra…
```

También sirven:
- `[Instrumental Break]`
- `[Guitar Solo]`
- `[Build-up]`
- `[Spoken Word]`
- `[Whispered]`
- `[Female vocals]` / `[Male vocals]`

### Write with Suno (generar letra con IA)

1. En Custom Mode, en el campo Lyrics: **Write with Suno**.
2. Describe el tema.
3. Elige modelo:
   - **Classic** — letras balanceadas.
   - **ReMi** ("ray me") — más arriesgadas, edgier, creativas.
4. Click **Write Lyrics**.

Puedes editar libremente lo que genere.

### Truco

Para instrumentales sin voz, activa **Instrumental** y deja Lyrics vacío. O usa `[Instrumental]` como única línea.

---

## Personas y Voices

### Persona (cualquier modelo)

Captura el "estilo" (voz + producción) de una de tus canciones para reusarlo.

**Crear:**
1. Encuentra una canción tuya en Library.
2. ⋯ (More Actions) → **Create > Make Persona**.
3. Nombre, avatar, descripción.
4. Por defecto es pública — toggle a privada si quieres.

**Usar:**
- En Custom Mode, busca el área **Personas** arriba del campo Lyrics.
- Selecciona la Persona → se autopopula Style of Music.

Atajo: [suno.com/me/personas](https://suno.com/me/personas)

### Voices (solo v5.5, +18 años)

Tu propia voz dentro de Suno. Reemplaza al cantante por defecto.

**Setup:**
1. **Add Voice** en Create.
2. Fuente: canción de tu library / grabar en vivo / subir archivo (15s a 4 min, mejor a cappella).
3. **Verificación:** Suno te pide leer una frase corta en voz alta (anti-suplantación).
4. Llenas perfil: skill level, imagen, nombre.
5. Confirmas que tienes derechos sobre la voz.

**Usar:**
1. Crea con Custom Mode.
2. Selecciona modelo **v5.5**.
3. Asegúrate de que tu Voice esté cargada.
4. Sube el slider de **Audio Influence** alto.
5. Create → 2 canciones con tu voz.

**Notas:**
- Voices reemplazó al botón Personas en Create (las Style Personas siguen disponibles dentro del menú Voices).
- Restricción geográfica en algunos países.
- Otros usuarios pueden hacer Remix/Cover de tus canciones con tu voz si las publicas y permites remixes.

---

## Custom Models (v5.5)

Solo **Pro / Premier**. Hasta **3 modelos** propios.

1. Sube **mínimo 6 canciones** tuyas (debes tener los derechos).
2. Hay **Bulk Upload** para batch.
3. Click **Create Custom Model**.
4. 2-5 minutos de procesamiento.
5. Aparece en el dropdown de modelos.

Tu Custom Model es **privado y no se puede compartir**.

---

## Editar canciones

### Extend (extender)

Cambia el final o alarga la canción.

1. ⋯ → **Remix/Edit > Extend**.
2. Arrastra la flecha blanca para elegir hasta dónde mantener.
3. Nueva letra/estilo opcional.
4. **Create**.
5. Una vez listo: ⋯ → **Create > Get Whole Song** para pegar el final nuevo al original.

### Crop (cortar inicio/fin)

Solo **Pro / Premier**, web desktop.

1. ⋯ → **Remix/Edit > Crop Song**.
2. Arrastra sobre la waveform para seleccionar lo que **conservas**.
3. **Crop Song**.

### Replace Section (reemplazar medio)

Solo **Pro / Premier**. Cambia secciones intermedias (letra, música).

1. ⋯ → **Edit > Replace Section**.
2. Selecciona el rango.
3. Edita letra a la izquierda.
4. **Recreate Section** → confirmas → 2 versiones.
5. Eliges → Suno crea **Whole Song** con el cambio.

### Cover

Solo **Pro / Premier** y **solo en canciones tuyas**. Beta.

1. ⋯ → **Create > Cover Song**.
2. Cambia **Style of Music**.
3. Mantiene la melodía, cambia el género/producción.

Primer batch gratis (0 créditos).

### Remaster

Limpia canciones viejas. Disponible para cualquier track tuyo.

1. ⋯ → **Create > Remaster**.
2. Genera 2 versiones remasterizadas.
3. Puedes remasterizar una remasterización (más variación).

> Remaster v4 fue deprecado en sept 2025.

### Reuse Prompt (rehacer con cambios)

1. ⋯ → **Reuse Prompt**.
2. Auto-llena style + lyrics del original.
3. Cambias lo que quieras (voz, letra, título, género) → Create.

---

## Upload Audio

Convierte cualquier sonido tuyo en música.

1. Tap **Create > Upload Audio** (centro arriba).
2. Importa archivo o graba en vivo:
   - Free: 6 a 60 segundos.
   - Pro/Premier: hasta 120 segundos.
3. Cambia título y arte si quieres.
4. Aceptas: tienes derechos sobre el material.
5. Listo: aparece en Library con tag **Uploaded**.
6. Usa **Extend** desde ese audio para construir una canción completa.

Ideal para: drum loops propios, melodías tarareadas, samples ambientes.

---

## Suno Sounds

Generador de **efectos de sonido individuales** y samples. En beta.

**Acceso:** Create → Custom → dropdown → **Sounds**.

### Cómo

1. Describe el sonido con detalle.
2. (Opcional) Advanced:
   - **Type:** *One Shot* (corto) o *Loop* (repetible).
   - **BPM** (útil para loops musicales).
   - **Key** (C major, A minor, etc.).
3. **Create** → 2 muestras.

### Ejemplos de prompts (funcionan bien)

**SFX / transiciones:**
- `cinematic whoosh transition sound`
- `digital glitch effect`
- `sci-fi teleport swoosh`
- `fast aggressive swish with bass`

**Ambientes:**
- `gentle rain on window ambiance`
- `busy city street`
- `forest with birds ambiance`
- `coffee shop ambiance`

**Foley / acción:**
- `footsteps on wooden floor`
- `heavy metal door slamming shut with echo`
- `thunder rumble`
- `ocean waves crashing on beach`

**Animales:**
- `lion roaring powerful deep`
- `dog barking medium-sized breed`

**Samples musicales:**
- `deep 808 kick drum one shot`
- `crisp hip hop snare drum`
- `tight clap sample`
- `bongo drums pattern loop`

### Tips

- Vocabulario reconocible: *whoosh, glitch, rumble, crash, ambiance*.
- Si sale lofi cuando querías ambiente, prueba *background chatter and clinking cups ambiance*.
- Si dura poco/mucho: agrega *"5 second long sound of..."*.
- *One Shot* para FX puros; *Loop* para colchones musicales.

---

## Exclude (prompt negativo)

Para decirle a Suno **lo que NO quieres**.

1. Custom Mode → **Advanced Options**.
2. En **Exclude** escribe lo que evitar: instrumentos, voces, géneros.
3. (Opcional) Marca 👍/👎 a los resultados para ayudar al modelo a aprender.

Ejemplo: si pides *"electronic dance"* pero no quieres saxofón, escribes `saxophone` en Exclude.

---

## Descargar y compartir

### Formatos

| Plan | Formatos disponibles |
|---|---|
| Free | MP3 (audio), M4A (video) |
| Pro / Premier | + **WAV** |

**Cómo:** Library → ⋯ junto a la canción → **Download Audio / Video**.

### Visibilidad

Por defecto **Link Only** (privada). Para que aparezca en tu perfil público o en el home de Suno:
- Library → ⋯ → toggle a **Public**.

### Compartir

- Link directo.
- Copiar a redes (botón share).
- Descargar y subir donde quieras.

---

## Moderación y restricciones

Pueden bloquear la generación si el prompt incluye:

- Nombres de artistas/personas conocidas.
- Términos con copyright o marcas registradas.
- Términos despectivos o difamatorios.
- Profanidad excesiva.
- Otros temas inapropiados.

Sanciones posibles:
- Bloqueo de generación.
- Pedido de cambiar a Link Only.
- Eliminación sin aviso.
- Cumplimiento DMCA si copyright owner reclama.

📧 Dudas: support@suno.com

---

## API / MCP — estado real

### ❌ NO hay API oficial

Suno **no publica una API pública oficial** (al menos hasta mayo 2026). Su prioridad sigue siendo la web/app consumer. Existen accesos beta para partners pero no es algo que cualquier dev pueda activar como con OpenAI.

### ❌ NO hay MCP de Suno

No existe un connector MCP oficial ni en el registro estándar de Claude.

### 🟡 APIs no-oficiales (terceros)

Existen reverse-engineers que envuelven la web de Suno en una API REST:

- **sunoapi.org** — provider comercial, base `https://api.sunoapi.org`, auth Bearer token, soporta v4 / v4.5 / v5 / v5.5.
- **gcui-art/suno-api** (GitHub) — open source self-hosted.
- **aimlapi.com** — middleware.

⚠️ **Riesgos reales:**
- Violan ToS de Suno → tu cuenta puede ser baneada.
- Inestables: Suno cambia su API privada y los terceros se rompen.
- Cuestiones legales sobre uso comercial.
- Sin SLA real.

### ✅ Para conectar Suno con Claude — opciones prácticas

1. **Manual (recomendado para uso personal):**
   - Generas la música en suno.com.
   - Descargas el MP3.
   - Lo agregas a tu proyecto.

2. **Vía API no-oficial (riesgo):**
   - Te suscribes a sunoapi.org u otro.
   - Levantas un servidor que use esa API.
   - Le pides a Claude que llame ese servidor con `fetch` (ya sea desde código o vía un MCP HTTP genérico).

3. **MCP custom (avanzado):**
   - Escribes tu propio servidor MCP que envuelve un provider no-oficial.
   - Lo conectas a Claude Code via `claude mcp add`.
   - Tendrás que mantenerlo conforme Suno cambia su backend.

> Si Suno publica una API oficial en el futuro, esto cambiará — vigila [suno.com/blog](https://suno.com/blog).

---

## Recetas listas

### Lo-fi para estudiar

```
Lo-fi hip hop, mellow piano, vinyl crackle, soft jazz drums, 75 BPM, rainy afternoon mood
[Instrumental]
```

### Synthwave 80s

```
Retro synthwave, gated reverb drums, analog synth lead, neon nights mood, 110 BPM, Stranger Things vibe
```

### Bolero romántico

```
Bolero clásico mexicano, guitarra acústica, requinto, trío vocal, ritmo lento, mood nostálgico
```

### Corrido tumbado

```
Corrido tumbado, requinto, tuba, batería trap, voz masculina con vibrato, 130 BPM, mood pesado calle
```

### Cinematic épico

```
Epic cinematic orchestral, soaring strings, brass swells, taiko drums, choir, crescendo into finale, 100 BPM
```

### Chiptune 8-bit aventura

```
Upbeat chiptune 8-bit adventure music, square wave lead, triangle bass, fast arpeggios, NES-style, 140 BPM
```

### Jazz noir detective

```
Slow jazz noir, walking double bass, muted trumpet, brushed drums, smoky piano, 70 BPM, 1940s detective mood
```

### EDM festival drop

```
Big room EDM, sidechained pluck, massive build-up, festival drop, 128 BPM, energetic
[Build-up]
[Drop]
```

---

## Prompts para DETENIDO RPG

> Si decides reemplazar la música procedural del juego con tracks de Suno.

### Carpeta destino: `assets/audio/music/`

Genera cada track en Suno con su prompt, descarga como MP3, guarda con ese nombre exacto.

#### `title.mp3` — Pantalla de título

```
Dark cinematic chiptune intro, slow noir piano arpeggio with 8-bit square lead,
melancholic Mexican legal drama mood, walking bass in A minor,
sparse high pads, 70 BPM, 1:30 length, loopable
[Instrumental]
```

#### `phase1_detencion.mp3` — Fase 1: Detención

```
Tense urban chiptune chase music, police siren motif in square wave,
fast 16th note arpeggios, driving kick on every beat, hi-hat sixteenths,
anxious A minor key, 132 BPM, 2:00 length, loopable
[Instrumental]
```

#### `phase2_interrogatorio.mp3` — Fase 2: Interrogatorio

```
Slow tense interrogation theme, deep ominous sawtooth bass,
ticking clock as filtered noise hits on every beat, sparse minor key pads,
claustrophobic mood in D minor, 60 BPM, 2:30 length, loopable
[Instrumental]
```

#### `phase3_fiscalia.mp3` — Fase 3: Fiscalía

```
Aggressive 16-bit JRPG courtroom battle music, dramatic square wave melody,
driving punchy bass, snare on 2 and 4, energetic kick pattern,
D minor key, 142 BPM, 2:30 length, loopable
[Instrumental]
```

#### `phase4_defensor.mp3` — Fase 4: Defensor Público

```
Thoughtful uncertain chiptune dialogue music, gentle triangle melody,
soft sustained chords, slight melancholy with sparks of hope,
C major to A minor, 92 BPM, 2:00 length, loopable
[Instrumental]
```

#### `phase5_juez.mp3` — Fase 5: Juez

```
Solemn ceremonial chiptune judgment music, deep organ-like sawtooth pad,
high celesta arpeggio sparse, slow grand chord progression,
C minor key, 58 BPM, 2:00 length, loopable
[Instrumental]
```

#### `ending_good.mp3` — Final bueno

```
Bittersweet victory chiptune, ascending square wave melody,
hint of Mexican folk in the chord changes, C major with melancholic touches,
100 BPM, 1:00 length
[Instrumental]
```

#### `ending_bad.mp3` — Final malo

```
Heavy descending chiptune, prison cell echo, slow sawtooth bass tolling,
distant noise tolling like a bell, A minor key, 52 BPM, 1:00 length
[Instrumental]
```

#### `ending_secret.mp3` — Final secreto

```
Mysterious twist reveal chiptune, glitchy unstable rhythm,
dissonant intervals, dark D# minor key, suspenseful,
116 BPM, 1:00 length
[Instrumental]
```

### Carpeta destino: `assets/audio/sfx/`

Usa **Suno Sounds** (One Shot, sin BPM/key) para SFX cortos:

| Archivo | Prompt sugerido |
|---|---|
| `click.mp3` | `short retro 8-bit menu button click blip sound effect` |
| `type.mp3` | `very short retro typewriter tick blip` |
| `siren.mp3` | `short police siren two-tone wail 1 second` |
| `gavel.mp3` | `judge gavel hitting wooden block sharp impact` |
| `handcuffs.mp3` | `metallic handcuffs closing click sharp sound` |
| `notif.mp3` | `gentle retro 8-bit notification chime two tones` |
| `phase_banner.mp3` | `dramatic chiptune stinger descending three notes` |
| `door_close.mp3` | `heavy metal cell door slamming shut with echo` |
| `glitch.mp3` | `digital glitch error short 8-bit distortion` |

> Después de descargar, mueve los archivos a la carpeta del juego en `C:\Users\grego\OneDrive\Escritorio\DETENIDO JUEGO RPG\assets\audio\`. El sistema de audio del juego ya está configurado para cargarlos automáticamente al detectarlos.

---

## 📌 Fuentes oficiales

- [Help Center de Suno](https://help.suno.com/en/)
- [Hacer música — categoría completa](https://help.suno.com/en/categories/550017-making-music)
- [Glosario musical](https://help.suno.com/en/articles/9010177)
- [Timeline de modelos](https://help.suno.com/en/articles/5782721)
- [Suno Sounds](https://help.suno.com/en/articles/10625537)
- [Voices](https://help.suno.com/en/articles/11362369)
- [Custom Models v5.5](https://help.suno.com/en/articles/11362497)
- [Suno Blog](https://suno.com/blog)
- [Terms of Service](https://suno.com/terms)
- [Community Guidelines](https://suno.com/community-guidelines)

---

*Documento compatible con móvil. Compártelo libremente.*
