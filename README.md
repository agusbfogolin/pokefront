# Pokémon Frontera · Prototipo 0.22

Fangame experimental de las 1025 especies de las generaciones 1–9: exploración libre, crecimiento individual y combate en arena 3D con sprites 2D, energía/stamina, estados y cambio de compañero. Todas las especies comparten 480 puntos base de combate; IV, naturaleza, entrenamiento, habilidades y decisiones definen el resultado.

Hay **nueve regiones generacionales, 405 mapas, 81 ciudades y 81 interiores de gimnasio**. La generación del inicial determina el comienzo: Bulbasaur, Charmander, Squirtle o Pikachu llevan a Kanto; Chikorita, Cyndaquil o Totodile a Johto, y así hasta Paldea. Cada región cuenta con 45 mapas y nueve gimnasios. Completar sus nueve medallas abre la generación anterior y siguiente; el atlas permite elegir el viaje y volver a regiones visitadas. El equipo, los PS, la mochila y las habilidades permanecen. Las ciudades son diseños originales del fangame, no réplicas de las ciudades de los juegos oficiales. Las rutas y cuevas generan claros, ramificaciones y circuitos a partir de la semilla. Volcanes con lava y basalto, cordilleras con riscos, desiertos con cactus, selvas con lianas y helechos, pantanos con agua y juncos, arboledas, hielo y columnas bloquean realmente el paso según el bioma; puentes y senderos conectan las salidas. Hay campamentos y ruinas en los claros. El mapa local revela el terreno explorado. Las postas permiten viajar entre ciudades ya visitadas. Ivo es una némesis persistente: el primer duelo es una práctica guiada, y después regresa en cuatro capítulos con el inicial contrapuesto, evoluciones y hasta cuatro compañeros. Los entrenadores de ruta siguen usando equipos de hasta tres Pokémon. En rutas y cuevas, te desafían automáticamente al verte de frente; el terreno sólido bloquea la visión. Los entrenadores vencidos solo repiten el combate si les pides una revancha. La especie rival se anuncia al comenzar la pelea, también cuando el entrenador cambia de Pokémon. Para intentar escapar de un salvaje primero debes quitarle al menos un 10 % de vida. Puedes intentar escapar con el botón de huida o R; la probabilidad mejora al alejarte, con tu velocidad y tras fallos previos. Un fallo requiere esperar 3,5 segundos. Escapar no concede premios ni penaliza el dinero. Los salvajes siguen camuflados por tipo, con menos encuentros, y cada zona exterior tiene solo dos Poké Balls de objetos persistentes. Al recogerlas se muestra el icono, el nombre y la cantidad durante cinco segundos, dentro del juego y también en pantalla completa.

Incluye **83 objetos de Pokémon** con nombres e iconos locales, mochila, objetos equipados, tiendas y Pokédólares. Los PS de cada Pokémon se conservan al ganar, perder, capturar, escapar, guardar y recargar; se muestran en exploración, Equipo y Mochila. Las pociones, bayas curativas y Revivir funcionan también fuera de combate. Subir de nivel o aumentar la vida máxima no cura. El centro recupera todo el equipo; una derrota total devuelve al equipo a la última ciudad sin curarlo. La primera victoria contra un entrenador paga más que una revancha; los centros recuperan gratis y los salvajes dan entrenamiento. Las partidas antiguas conservan colección, stats, árboles y Medalla Brote y conservan su mapa actual en Kanto; completarlo abre Johto.
HTML, CSS y JavaScript sin dependencias de ejecución. Los sprites y datos se incluyen localmente.

Los edificios tienen fachadas diferenciadas: tejados, chimeneas, columnas, toldos, vitrales y emblemas. Los 81 gimnasios tienen interiores caminables de 30 × 32 casillas, decorados según su tipo. Cada laberinto incluye tres entrenadores con equipos del tipo del gimnasio; ganar abre una reja hasta llegar al líder. Las victorias se guardan y los PS se mantienen: puedes volver al centro sin repetir los duelos. Las medallas antiguas conservan el acceso al líder. Dentro no hay salvajes, pesca ni técnicas de campo.

## Eventos legendarios

**94 eventos originales para todos los legendarios y singulares marcados en el catálogo**, repartidos entre las nueve regiones. Menú → Leyendas abre el diario, con filtro regional, búsqueda, requisitos, dos pistas y coordenadas de los tres objetivos. Seguir una leyenda muestra su próximo destino en exploración. El profesor y la guardabosques también abren el diario. Inscripciones y santuarios se dibujan como monumentos de runas y aparecen en el mapa local cuando se descubre su zona.

Cada evento requiere 3, 5, 7 o 9 medallas **de su región**, dos inscripciones en biomas diferentes y una prueba en el santuario de una cueva. Hay rituales de sellos en orden, núcleos de carga y laberintos de 5 × 5; admiten botones táctiles y el laberinto también acepta flechas. Las pistas explican la solución. Las pruebas pueden repetirse gratis, y una solución aprobada se conserva.

Las rutas normales y la pesca no generan legendarios. Invocar requiere estar junto al santuario. La captura se intenta durante la batalla con 20 % de PS o menos (Master Ball conserva su excepción). No se permite reclutar un legendario debilitado desde el resultado. Cada evento admite una captura por partida. Perder, escapar, debilitar al rival o recargar en combate exige salir de su cueva y volver a entrar; conserva pistas, solución e IV del individuo. Los PS del equipo se mantienen. Una reserva persistente detecta encuentros interrumpidos al recargar. Las capturas antiguas se mantienen y completan el evento correspondiente al actualizar/importar.

Son historias y rituales originales de Frontera; los santuarios usan los mapas actuales, sin reproducir los eventos de los juegos oficiales. Ejemplos: Articuno en «El canto del glaciar», Zapdos en «La central silenciosa», Mewtwo en «El laboratorio sellado», Celebi en «El bosque fuera del tiempo» y Giratina en «El espejo del otro mundo».

## Movimientos y aprendizaje

El catálogo incluye **970 movimientos y variantes oficiales registradas**: 919 de la serie principal en PokéAPI, 18 oscuros de Colosseum/XD y 33 Gigamax obtenidos de Pokémon Showdown. Se conservan nueve modos de arena heredados (979 definiciones de ejecución). Todos tienen tipos, clases de daño y metadatos. Hay hasta cuatro técnicas normales por Pokémon, libremente combinables entre sus movimientos aprendidos. Las 568 especies terminales (incluidas las que no evolucionan) tienen un quinto espacio, con una definitiva de uso único por Pokémon y batalla; cambiar de compañero o Transformar no recupera el uso. Se restablece en una batalla nueva. La definitiva puede usar una técnica aprendida con potencia o duración aumentada. Ditto repite Transformación porque su catálogo nativo contiene una sola técnica.

Habilidades → Pokémon muestra todas las técnicas compatibles, con búsqueda, filtro por tipo y páginas, y permite consultar el catálogo completo. La compatibilidad reúne los movimientos de versiones oficiales y los heredados de etapas anteriores. **173 movimientos especiales o exclusivos de otras formas se muestran para consulta**, sin asignarlos a especies incompatibles: 53 Z, 19 Dinamax, 33 Gigamax, 18 oscuros y 50 de formas/eventos/sistemas particulares. Gigamax conserva los nombres ingleses de la fuente. El catálogo completo no implica que todas las transformaciones o condiciones especiales de los juegos oficiales estén implementadas. La arena adapta potencias variables, utilidades y estados; admite precisión, drenaje, retroceso, recuperación, cambios de stats, clima, terreno y zonas peligrosas.

Los 28 iniciales comienzan en nivel 5 con los movimientos por nivel de sus juegos de debut: dos en las generaciones 1–5 y 8, y tres en 6, 7 y 9. Pikachu usa Amarillo. Las 84 especies de estas familias tienen tablas de nivel propias; no reciben técnicas avanzadas para completar cuatro espacios. Las nuevas requieren Disciplina, nivel y una **prueba de memoria de cinco flechas**: 3,2 s para memorizar y 15 s para repetir por teclado o botones. Aprender consume un punto únicamente al aprobar. Fallar, abandonar, cerrar o recargar bloquea ese movimiento hasta el siguiente nivel. El bloqueo se guarda antes de comenzar y persiste al evolucionar; los demás movimientos siguen disponibles. Al nivel 100 no hay un nivel siguiente para reintentar. Aprobar llena el siguiente espacio libre; con cuatro técnicas se elige qué reemplazar. La evolución conserva la selección y habilita la definitiva en la última etapa. Los iniciales antiguos sin uso ni mejoras se corrigen; los movimientos ya entrenados de partidas en curso se conservan. Guardar, importar o evolucionar no rellena espacios vacíos ni modifica los PS.

## Árboles progresivos y debilidades

Las debilidades simples causan ×1,6 de daño y las dobles ×2,2. Los dos tipos del objetivo se combinan antes de aplicar el factor; una debilidad y una resistencia se compensan. Las resistencias y el factor de inmunidad conservan la adaptación anterior.

Cada árbol pasa de 5 opciones iniciales a 9 en la segunda etapa y 17 en la tercera. Hay 48 habilidades nuevas y 68 nodos en total entre los cuatro árboles. Entrenador se amplía a 300 y 900 XP; cada tipo, a 180 y 600 XP. Pokémon y cada ataque aprendido siguen la etapa evolutiva de la familia. Una familia de tres etapas requiere evolucionar; una de dos abre la tercera capa al alcanzar nivel 40 en su forma final; sin evolución, las capas se abren al nivel 20 y 40.

La elección de camino sigue siendo permanente. Después de las habilidades base hay dos nuevas bifurcaciones excluyentes; cada una exige su habilidad anterior. Los árboles conservan inversiones, experiencia, movimientos y PS al evolucionar y al actualizar partidas. Las mejoras afectan daño, estados, precisión, críticos, alcance, preparación, recargas, costes, vida máxima, recuperación, embestida, velocidad, bayas, práctica y cambios de equipo.

## Combate y recuperación

Las técnicas cuerpo a cuerpo y de embestida acercan al Pokémon hasta 210 unidades hacia el rival y golpean en un arco frontal más amplio. El avance conserva el coste y la preparación, no da invulnerabilidad y puede esquivarse. Esquivar, cambiar, escapar o terminar el combate cancela la embestida.

En movimiento no se regenera energía y la stamina se recupera al 50 %. Al detenerse vuelve la recuperación completa; se conserva la espera de 1,25 s después de gastar recursos. Se comprueba el desplazamiento real, incluidas diagonales, esquiva y embestida. En reserva se mantiene la recuperación lenta habitual.

## Ejecutar

Desde esta carpeta, con Python instalado:

```bash
python -m http.server 8080 --directory dist
```

Abrir `http://localhost:8080`. El guardado depende del navegador y del origen. Las partidas anteriores se conservan; exportar permite trasladarlas.

## Controles

- Exploración: WASD o flechas para mover; E para investigar o hablar.
- Combate: WASD o las cuatro flechas para mover, 1/2/3/4 para las técnicas, 5 para la definitiva y Espacio para esquivar. Apuntado y golpe básico automáticos.
- Q o Cambiar permite cambiar de compañero durante la pelea. R intenta escapar; C captura un Pokémon salvaje debilitado; B usa una medicina útil de la mochila. V cambia la Poké Ball sin mouse; el selector junto a Capturar también permite elegirla. En celular, el mando virtual controla el movimiento y los botones de la derecha las habilidades y la esquiva. Se admite uso simultáneo con dos dedos.
- Pantalla completa: F o botón junto a Pausa; Salir o Esc vuelve a la página. Hay un modo inmersivo alternativo si el navegador no permite fullscreen nativo. En PC se ocultan el mando táctil y los botones grandes. En pantalla completa la arena usa todo el espacio bajo la barra superior y conserva indicadores compactos de técnicas. Los controles táctiles se muestran al usar una pantalla táctil o un lápiz.
- Habilidades: Menú → Habilidades (M, 5). Cuatro pestañas con puntos y requisitos separados. Pokémon permite aprender técnicas compatibles; Ataques permite mejorar y equipar cuatro técnicas libres y una definitiva en las formas finales. Cada árbol tiene una raíz común y dos caminos excluyentes: invertir en una rama bloquea la otra. La elección se conserva al evolucionar. Las partidas anteriores que tenían ambas ramas recuperan esos puntos y mantienen raíz, XP y técnicas aprendidas.
- Mapa: alterna mapa local y atlas de 405 zonas, organizado por generación. Interactuar junto a una salida cambia de mapa. En ciudades puedes viajar a otra ya visitada; en cuevas, Cuerda Huida permite regresar. La Pokédex indica los hábitats de cada especie.
- Mochila: usa pociones y Revivir dentro o fuera de la pelea; fuera de ella equipa objetos, usa vitaminas, Caramelos Raros, repelentes, bicicleta y cañas. Tienda permite comprar y vender con Pokédólares.
- Ciudad: profesor al noroeste de la plaza, gimnasio al noreste y centro al sur; academia en el barrio noroeste, casa de tipos al noreste, mercado al suroeste y dojo al sureste. Lía está en la salida norte. Puedes explorar libremente; las nueve medallas de cada región habilitan el viaje generacional.

Menú (M) reúne Pokémon, Mochila, Pokédex, Mapa, Habilidades, Postas de viaje, Leyendas y Movimientos de campo; también incluye Importar/Exportar, Sonido y Sprites/diseño, accesibles dentro de pantalla completa. Los ataques, esquiva y cambio de combate solo aparecen en la arena.

Al entrar, el menú de bienvenida permite continuar, importar o crear una aventura y elegir entrenador o entrenadora. Puedes cambiar el aspecto desde Inicio; las partidas anteriores conservan su progreso.

## Técnicas de campo

Abre Menú → Movimientos de campo o pulsa H. Junto al obstáculo, E o Interactuar usa la técnica indicada. Hace falta un Pokémon compatible en la colección y la medalla del distrito equivalente de cualquier región; no ocupa los cuatro espacios de combate. La compatibilidad se verifica con los datos de compatibilidad de todas las generaciones de PokéAPI. La asignación de medallas y el uso sin ocupar el kit son adaptaciones de Frontera.

| Técnica | Función | Medalla de Frontera |
|---|---|---|
| Corte | Abre árboles pequeños | Hoja |
| Vuelo | Viaja desde el exterior a ciudades visitadas | Faro |
| Surf | Entra al agua; desembarca al volver a tierra | Cauce |
| Fuerza | Empuja una roca pesada una casilla libre | Duna |
| Destello | Ilumina la cueva actual hasta salir | Brote |
| Golpe Roca | Elimina rocas agrietadas | Niebla |
| Cascada | Cruza un salto de agua vertical usando Surf | Ascua |
| Excavar | Sale de una cueva por su entrada exterior | Sin medalla |
| Teletransporte | Vuelve al último centro donde descansaste, desde el exterior | Sin medalla |

Los pasos abiertos, las rocas movidas y el último centro se guardan. La partida puede recargarse mientras usas Surf. Los caminos principales siguen transitables a pie.

## Archivos

- `dist/index.html`, `style.css`, `game-menu.css`: interfaz, menú de aventura y controles según exploración o combate.
- `dist/core.js`: stats, entrenamiento, ciudad y generación procedural.
- `dist/progression.js`: puntos, árboles, técnicas aprendidas/equipadas, maestría, recompensas y migración.
- `dist/keyboard-ui.js`: modos de entrada PC/táctil, foco, Tab y flechas, atajos numéricos, cancelación y diálogos dentro de fullscreen.
- `dist/learning-ui.js`: prueba táctil y de teclado, temporizador, resultados y cancelación persistente.
- `tools/fetch_starter_moves.py`: incorpora las tablas por nivel de los iniciales y sus evoluciones desde PokéAPI; ejecutar al final de los importadores.
- `dist/skill-trees.css`: árbol de dos caminos con capas desplegables y bifurcaciones adaptadas al celular.
- `tools/verify_skill_branches.mjs`: habilidades nuevas, costes, efectos, bifurcaciones, evolución, niveles, XP, guardados y daño por tipo.
- `tools/verify_melee.mjs`: embestidas, arcos, esquiva, cancelación y recuperación según movimiento.
- `tools/verify_starters.mjs`: iniciales, espacios vacíos, niveles, prueba, reemplazos, evolución, captura, PS y migración.
- `tools/fetch_all_moves.py`: catálogo completo, metadatos, cuatro kits, niveles, compatibilidad y definitivas. Ejecutar **después de** `fetch_generations.py`.
- `tools/verify_moves.mjs`: ejecución de todo el catálogo, cuatro/cinco espacios, minijuego, bloqueos, migración, definitiva, cambio y Transformación.
- `dist/skills-ui.js`: menús y caminos excluyentes de habilidades.
- `dist/field.js`, `field-ui.js`, `field-art.js`: permisos, obstáculos persistentes, navegación, menú y render de técnicas de campo.
- `dist/gyms.js`, `gym-art.js`: interiores, laberintos, duelos previos, rejas, guía y requisitos para el líder.
- `dist/building-art.js`: fachadas y techos pixel art por servicio y región.
- `dist/generations.js`: generación del inicial, nueve regiones, familias Pokémon, mapas propios, fronteras, dificultad y continuidad.
- `dist/campaign.js`: terreno procedural por bioma, caminos conectados, ciudades, gimnasios, rivales, encuentros, niebla y migración.
- `dist/terrain-art.js`: riscos, vegetación, puentes, hielo, lava, ruinas y campamentos en pixel art.
- `dist/economy.js`: 83 objetos, compras, ventas, dinero, premios, equipamiento, consumo y evolución por objetos.
- `dist/adventure-ui.js`: mochila, tiendas, minimapa, mapa local y atlas.
- `dist/legends.js`, `legends-ui.js`, `legends.css`: catálogo de 94 eventos, objetivos físicos, rituales, diario, seguimiento, captura única, reintentos y migración.
- `tools/verify_legends.mjs`: cobertura del catálogo, 846 objetivos en tres semillas, gates regionales, tres rituales, reintentos, IV, PS, captura y validación.
- `dist/combat.js`: coordenadas X/Z, energía, stamina, estados, IA, captura y equipo durante la pelea.
- `dist/arena-art.js`: proyección de suelo 3D, sprites en perspectiva y efectos de ataques.
- `dist/world-art.js`: ciudad, arena y señales por tipo dibujados por código.
- `dist/trainer-art.js`: entrenador y entrenadora pixel art en ocho direcciones, caminar por distancia real y parpadeo discreto.
- `dist/npc-art.js`: 22 diseños originales para personajes de ciudad, entrenadores y líderes, cuatro orientaciones y parpadeo.
- `dist/welcome-art.js`: paisaje original del menú de bienvenida.
- `dist/game.js`: Canvas, diálogos, recompensas, controles y guardado.
- `dist/assets/`: sprites, datos base y créditos por especie.
- `dist/diseno.md`: reglas y adaptaciones de este prototipo.
- `tools/fetch_national_sprites.py`: importa las hojas PMD nacionales después de `fetch_generations.py`, con caché, formas alternativas, créditos y auditoría; conserva Kanto y #200.
- `tools/verify_sprites.mjs`: valida los 1025 registros y PNG, compara el renderer heredado y dibuja retratos y ocho direcciones.
- `tools/fetch_sprites.py`: descarga seleccionada de SpriteCollab; requiere Pillow y conexión a GitHub.
- `tools/fetch_moves.py`: obtiene nombres y tipos de movimientos y verifica los kits de las 151 especies y del compañero heredado Misdreavus contra PokéAPI.
- `tools/fetch_field_moves.py`: conserva el importador original FRLG; la ampliación nacional se genera con `fetch_generations.py`.
- `tools/verify_field.mjs`: medallas, compatibilidad, colisiones, pasos abiertos, navegación y continuidad de partidas.
- `tools/fetch_items.py`: verifica 83 objetos en PokéAPI, descarga nombres e iconos y registra créditos.
- `tools/fetch_species.py`: importador original de Kanto.
- `tools/fetch_generations.py`: amplía a 1025 especies, evoluciones, kits compatibles, técnicas de campo y sprites locales de las nueve generaciones. Ejecutarlo después de los importadores originales para reconstruir el catálogo nacional.
- `tools/verify_generations.mjs`: todos los iniciales, 405 mapas, especies, combate, hábitats, medallas, fronteras, PS y partidas anteriores.
- `tools/build_downloads.py`: reconstruye los ZIP descargables con Python.
- `tools/verify.mjs`: pruebas de comportamiento; requiere Node 24 o posterior.
- `tools/verify_progression.mjs`: requisitos, puntos, técnicas, efectos de combate, evolución, guardado y ecología regional.
- `tools/verify_escape.mjs`: probabilidades de huida, fallos y recarga, bloqueos, cambios de equipo y ausencia de premios o penalizaciones.
- `tools/verify_trainers.mjs`: visión direccional, alcance, cobertura de obstáculos, ciudades seguras y supresión de revanchas automáticas.
- `tools/verify_terrain.mjs`: barreras, conectividad de todo el suelo transitable, puentes, colisiones, llegadas y reubicación de partidas antiguas en 324 zonas generadas.
- `tools/verify_campaign.mjs`: conexiones y accesibilidad, densidad, aparición de los 151, continuidad, equipos rivales, economía y efectos de los objetos.
- `tools/balance_check.mjs`: simula las 151 especies entrenadas contra Rattata de igual nivel; requiere Node. Es una prueba de viabilidad, no una clasificación competitiva.
- `tools/render_catalog.mjs`: genera una hoja de revisión con los 151 retratos; requiere el mismo módulo Canvas.
- `tools/render_qa.mjs`: harness Canvas/DOM, sin navegador. Requiere `@napi-rs/canvas`; se puede indicar su ruta con `CANVAS_MODULE` y la carpeta de capturas con `QA_DIR`.

## Verificar

```bash
node tools/verify_legends.mjs
node tools/verify_skill_branches.mjs
node tools/verify_melee.mjs
node tools/verify_starters.mjs
node tools/verify_moves.mjs
node tools/verify.mjs
node tools/verify_generations.mjs
node tools/verify_health.mjs
node tools/verify_gyms.mjs
node tools/verify_progression.mjs
node tools/verify_field.mjs
node tools/verify_campaign.mjs
node tools/verify_story.mjs
node tools/verify_escape.mjs
node tools/verify_terrain.mjs
node tools/verify_trainers.mjs
node tools/balance_check.mjs
CANVAS_MODULE=/ruta/a/@napi-rs/canvas QA_DIR=/tmp/frontera-qa node tools/render_qa.mjs
python tools/build_downloads.py
```

El harness comprueba interacciones y render del juego. La disposición responsive y el uso táctil deben probarse en un navegador y un dispositivo reales.

## Créditos

Kanto y el Misdreavus heredado conservan exactamente sus hojas y metadatos. Se incorporaron 832 especies de generaciones 2–9 con hojas PMD: 984 especies en total, con poses y direcciones originales. Quedan 41 especies con imagen frontal de PokéAPI y movimiento por código. `dist/assets/sprite-coverage.json` enumera la cobertura y los alias de poses. Falinks se dibuja con un Brass y cinco Trooper; Pyroar usa la forma hembra, Gimmighoul la forma Andante y Miraidon su modo limitado. Se mantienen todos los créditos y PNG originales.

Sprites originales: CHUNSOFT y contribuciones comunitarias acreditadas por especie. Archivo: SpriteCollab / PMDCollab. Datos base y nombres de objetos: PokéAPI. Iconos de objetos: repositorio PokeAPI/sprites; Cordón Unión usa un icono original dibujado por código cuando la fuente no dispone de él. Pokémon pertenece a sus respectivos titulares. Las condiciones y registros completos se incluyen con los assets. Proyecto experimental sin fines comerciales.

## Inicio, economía y mapas (0.21)

Ciprés presenta los 28 iniciales juntos, sin filtro generacional ni explicación anticipada de las fronteras. La selección mantiene el origen regional del compañero. El regalo inicial se guarda una sola vez: 5 Poké Balls, 3 Pociones, 2 Bayas Aranja, Mapa y Caña Vieja. La práctica contra Ivo enseña a moverse, atacar, esquivar y recuperar recursos antes de ganar el duelo; no permite capturar ni escapar, no cuesta dinero y el profesor cura al equipo al terminar. El guardado continúa desde la entrega pendiente o desde el tutorial. Las partidas previas mantienen inventario, dinero, colección, PS y medallas y continúan directamente su campaña.

Los 243 mapas de rutas y cuevas pasan de 64 × 48 a 96 × 72 casillas: ambas dimensiones aumentan un 50 %, con claros y salidas más separados. Pueblos y gimnasios conservan su tamaño. Los bordes muestran vegetación, riscos, paredes o setos según el lugar, y los árboles cortables tienen una silueta mayor. El arco verde, los niveles y la etiqueta ENTRENAR identifican la salida local de menor nivel en cada ciudad; el mapa también la destaca.

Los dos objetos por mapa siguen siendo deterministas y no reaparecen. Debajo de nivel mínimo 15: 97 % básicos y 3 % suministros intermedios, sin tesoros. Entre 15–24: 94 % básicos, 5,5 % intermedios y 0,5 % valiosos. Desde 25: 92 %, 7 % y 1 %. Dentro de los valiosos, 85 % son Perla o Polvoestelar; Pepita solo representa 3 % de esa categoría (0,03 % total en zonas avanzadas).

Las tiendas de ciudad venden Poké Balls, Pociones, curas de estado simples, Bayas Aranja, Repelentes y Cuerdas Huida. El Shopping Rocío está al noreste de Ciudad Rocío en cada región. Sus tres plantas se abren con tarjetas encontradas físicamente: Azul permite suministros intermedios; Plata añade equipamiento, piedras y productos superiores; Oro habilita entrenamiento y productos finales. La tarjeta superior permite también las plantas inferiores. Las medallas no sustituyen tarjetas. Cada tarjeta se registra una sola vez y sirve en todos los shopping. Su ubicación pertenece a la aventura y se mantiene por semilla.

Ivo reaparece tras 1, 3, 6 y 9 medallas de la región de origen. Conserva la familia contrapuesta al inicial original y suma cobertura y evoluciones; cada capítulo paga su primera victoria, sin dinero por revancha. El encuentro inicial de cada capítulo abre su charla automáticamente al volver a una ciudad. Las victorias y las presentaciones quedan guardadas.

`node tools/verify_story.mjs` comprueba los 28 comienzos, tutorial y derrota segura, regalos únicos, tarjetas físicas/guardado, compras por planta, 20.000 objetos por tipo de zona, dimensiones/salidas, separación con eventos legendarios, capítulos de Ivo y migración. `render_qa.mjs` cubre también los diálogos, botones y marcadores de estas funciones. Las comprobaciones de Canvas/DOM no sustituyen una revisión responsive en navegador o celular real.

## Teclado y pantalla completa (0.22)

En PC, el mando, la cruceta y las tarjetas grandes de ataques están ocultos; se ven indicadores compactos del estado de las técnicas. La pantalla completa oculta también la franja inferior de botones y estado. F alterna pantalla completa, K pausa, M abre el menú y V cambia la Ball para capturar con C. Se mantienen movimiento, 1–5, Espacio, Q, B y R. El uso de teclado selecciona modo PC incluso en una tableta; tocar o usar lápiz vuelve a mostrar los controles táctiles.

Todos los diálogos comparten navegación: flechas eligen por posición visual, Enter/Espacio activan, Tab/Mayús+Tab recorren los controles y Esc respeta la acción de volver o cancelar de cada diálogo. Los botones muestran atajos 1–9. Inicio/Fin salta al primer/último control y AvPág/RePág avanza ocho posiciones. Entrar a un diálogo enfoca una acción útil; las compras y árboles que se redibujan recuperan el foco del mismo control. Los campos de búsqueda y selectores conservan su comportamiento nativo. Las teclas modificadas con Ctrl/Alt/Meta siguen disponibles para el navegador. Los diálogos se colocan dentro del elemento de fullscreen antes de abrirse y regresan a su lugar al cerrarse.

Las flechas/WASD de la prueba de memoria y las flechas del laberinto legendario conservan sus funciones. Esc no permite omitir los regalos obligatorios ni el cambio tras un debilitamiento. Mantener Enter no repite compras. El menú de aventura incluye importación/exportación, sonido y recursos, además de las pantallas de gestión, para llegar a esas funciones desde fullscreen.

La verificación Canvas/DOM cubre el viaje completo por teclado: nuevo starter, entrega, práctica, resultados, encuentro, captura, cambio obligado, compra con foco persistente, árboles y sus etapas, prueba de memoria, Pokédex y búsquedas, atlas, leyendas, movimientos de campo y ayuda. Incluye entrada táctil, fullscreen nativo simulado, ubicación previa de los diálogos, cancelación y atajos del navegador. Para ejecutar solo ese recorrido: `QA_KEYBOARD_ONLY=1 QA_DIR=/tmp/frontera-keyboard-qa node tools/render_qa.mjs`. No sustituye una revisión del diseño en navegador real.

## Descargas (0.22)

`tools/build_downloads.py` reconstruye los ZIP completos y sus partes de hasta 20 MiB. `dist/descargas.html` verifica y reúne las partes para guardar un único ZIP. El proyecto descargado contiene todos los archivos del juego; para reconstruir sus propias descargas, ejecutar el importador de paquetes. `node tools/build_site.mjs` prepara `dist/client/` para publicar, conservando XML y sombras originales en el código y los ZIP. El juego desplegado sirve las hojas necesarias para jugar; el JSON de animaciones también está en el ZIP de recursos.
