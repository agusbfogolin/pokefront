# Pokémon Frontera

Prototipo 0.22 · Fangame experimental · 12 de octubre de 2026

## Experiencia

Explora desde arriba, investiga señales sutiles y decide si combatir. La especie se anuncia al entrar en la arena. La pelea se juega en una arena 3D con sprites 2D, movimiento en profundidad, hasta cuatro técnicas equipadas y una definitiva en las formas finales, estados y cambio de Pokémon. El apuntado y el golpe básico cercano son automáticos.

La generación del inicial elige el punto de partida: Kanto para generación 1, Johto para Chikorita y los demás iniciales de generación 2, y así hasta Paldea. Cada región tiene su propia ciudad inicial, con laboratorio y servicios. Ciudad Brote es el inicio de Kanto. El profesor Ciprés está junto al laboratorio, al noroeste; Vera y su gimnasio al noreste; el centro de descanso al sur. Brote conecta las ocho regiones exteriores. Cada región tiene nueve gimnasios; reunir sus nueve medallas abre las regiones de la generación anterior y siguiente. Dentro de cada región, los caminos principales se recorren sin medallas y las técnicas de campo habilitan pasos adicionales.

## Ciudad y objetivos

| Lugar | Interacción y recompensa |
|---|---|
| Laboratorio | Ciprés explica los rastros y entrega 5 Poké Balls y 3 bayas una sola vez. |
| Investigación | Revelar tres tipos distintos, sin obligación de combatir. Al volver al profesor: 4 puntos de entrenamiento y 5 Poké Balls, una sola vez. |
| Centro | Descanso gratuito: recupera los PS de todo el equipo y revive a los debilitados; los objetos se compran en la tienda. |
| Gimnasio Brote | Vera usa Onix nivel 9. Primera victoria: Medalla Brote, ₽ 1.720, Piedra Lunar y 4 puntos adicionales a los de una victoria normal. |
| Academia del entrenador | Barrio noroeste. Abre el árbol general: vínculo, cartografía y coordinación. |
| Casa de especialidades | Barrio noreste. Abre el árbol por tipo, compartido por los compañeros de ese tipo. |
| Dojo | Barrio sureste. Abre el desarrollo de cada Pokémon y el aprendizaje de técnicas. |
| Mercado | Barrio suroeste. Compra y venta de objetos con Pokédólares; el catálogo se amplía con medallas. |
| Guardabosques Lía | Salida norte. Abre el atlas y explica la ecología regional. |
| Posta | Viaje gratuito desde una ciudad a otra que ya se haya visitado. |
| Rival Ivo | Presente en cada ciudad, con equipo y nivel propios de la región. |
| Revancha | Da experiencia y un premio reducido; no repite medalla, piedra ni Master Ball. |

La ciudad ocupa 1472 × 1216 unidades, unas 3,6 veces su superficie anterior, con 13 edificios y ocho puntos de interacción. Hay calles entre los barrios, parques, bancos y señales hacia las regiones. Los edificios, plaza, fuente y personajes se dibujan mediante pixel art original en Canvas. El laboratorio y centro usan diálogos de interacción; el gimnasio tiene un interior caminable con laberinto, tres duelos previos y la sala del líder. No hay interiores caminables del laboratorio ni de las casas.

## Eventos legendarios

**94 eventos originales para todos los legendarios y singulares marcados en el catálogo**, repartidos entre las nueve regiones. Menú → Leyendas abre el diario, con filtro regional, búsqueda, requisitos, dos pistas y coordenadas de los tres objetivos. Seguir una leyenda muestra su próximo destino en exploración. El profesor y la guardabosques también abren el diario. Inscripciones y santuarios se dibujan como monumentos de runas y aparecen en el mapa local cuando se descubre su zona.

Cada evento requiere 3, 5, 7 o 9 medallas **de su región**, dos inscripciones en biomas diferentes y una prueba en el santuario de una cueva. Hay rituales de sellos en orden, núcleos de carga y laberintos de 5 × 5; admiten botones táctiles y el laberinto también acepta flechas. Las pistas explican la solución. Las pruebas pueden repetirse gratis, y una solución aprobada se conserva.

Las rutas normales y la pesca no generan legendarios. Invocar requiere estar junto al santuario. La captura se intenta durante la batalla con 20 % de PS o menos (Master Ball conserva su excepción). No se permite reclutar un legendario debilitado desde el resultado. Cada evento admite una captura por partida. Perder, escapar, debilitar al rival o recargar en combate exige salir de su cueva y volver a entrar; conserva pistas, solución e IV del individuo. Los PS del equipo se mantienen. Una reserva persistente detecta encuentros interrumpidos al recargar. Las capturas antiguas se mantienen y completan el evento correspondiente al actualizar/importar.

Son historias y rituales originales de Frontera; los santuarios usan los mapas actuales, sin reproducir los eventos de los juegos oficiales. Ejemplos: Articuno en «El canto del glaciar», Zapdos en «La central silenciosa», Mewtwo en «El laboratorio sellado», Celebi en «El bosque fuera del tiempo» y Giratina en «El espejo del otro mundo».

## Eventos únicos, Ultraentes, Paradoja e iniciales

El motor de santuarios ahora cubre **152 eventos**: 94 leyendas y míticos, 10 Ultraentes (Alola), 20 Paradoja (Paldea) y los 28 iniciales. Los Ultraentes y los Paradoja necesitan las medallas locales indicadas (5–9) más dos pistas y una prueba. Los iniciales que **no elegiste** vuelven como evento cuando reúnes la mitad de las medallas (41 de 81); el que elegiste nunca aparece. Ninguno de ellos (ni Naganadel ni las familias evolutivas de los iniciales) aparece ya en estado salvaje: la Pokédex indica «Solo por evento».

**Fallos y reaparición.** Derrotar al Pokémon sin capturarlo, escapar, perder o cerrar el juego en pleno combate cuenta como fallo. Las leyendas tienen **una segunda oportunidad** (salir de la cueva y volver a entrar); si falla otra vez se pierden para siempre y el diario las marca como perdidas. Para el resto de los eventos, cada fallo **reduce a la mitad** la probabilidad de reaparecer (100 → 50 → 25 → 12,5 → 6,25 %, mínimo); nunca se pierden del todo.

**Escondites con técnicas de campo.** 17 Pokémon exclusivos (Shuckle, Carbink, Dwebble, Glimmet, Kangaskhan, Nosepass, Stonjourner, Heracross, Munchlax, Komala, Farfetch'd, Scyther, Dunsparce, Sableye, Gible, Feebas y Dratini) salen de una fracción determinista de casillas al usar Golpe Roca, Fuerza, **Golpe Cabeza** (nueva técnica, medalla de Altos, árboles con marca ámbar), Corte, Destello, Surf o Cascada, siempre en su región. Cada casilla dispara una sola vez; la captura cierra la especie para siempre.

**Mini-eventos canónicos.** 13 historias (Beedrill, Chansey, Tentacruel, Gyarados rojo, Zubat, Poochyena, Combee, Starly, Venipede, Fletchling, Wimpod, Wooloo y Tandemaus) se arman con 10 % cada vez que entras en su ruta (con al menos una medalla local). Se disparan al entrar, al pisar hierba alta, al pescar, al usar Surf, Destello o Golpe Cabeza. Son oleadas de equipos de entrenador (no capturables, sin curación entre oleadas) y un jefe de IV altos con captura a 15–20 % de PS que **no admite Master Ball**. Es la única forma de conseguir ese ejemplar. Perder, escapar o derrotar al jefe sin capturarlo divide por dos la probabilidad de que vuelva a aparecer.

## Campaña corta (3 medallas)

Al comenzar, el menú de bienvenida ofrece **Campaña corta · 3 medallas por región** (opción por defecto) o la campaña completa de 9. En la corta, cualquiera de las tres medallas locales completa la región y abre la frontera siguiente; los demás gimnasios siguen disponibles como extra. Los requisitos de leyendas y eventos escalan con el ritmo (9/7/5/3 medallas locales pasan a 3/3/2/1) y la mitad de las medallas para los iniciales baja de 41 a 14. Las etapas del rival Ivo llegan con 1, 2 y 3 medallas. Se puede cambiar de ritmo en mitad de la partida sin cerrar fronteras ya abiertas. Las partidas antiguas siguen como campaña completa. `node tools/verify_pace.mjs` lo comprueba.

**Campaña personalizada.** La tercera opción de «Duración» permite elegir **qué regiones** forman la aventura (la de tu inicial siempre cuenta) y **cuántos gimnasios** (1–9) exige cada una. Al completar una región se abren sus vecinas *dentro de tu selección*, aunque no sean contiguas en el mapa (se viaja desde el atlas o la ciudad). Las regiones fuera de la campaña quedan cerradas y marcadas «Fuera de tu campaña». Los requisitos de leyendas y la mitad de medallas de los iniciales escalan con la selección. Se puede cambiar o ajustar en mitad de la partida desde el atlas («Personalizar campaña») sin cerrar fronteras ya abiertas.

## Encuentros camuflados

No se muestran sprites de los Pokémon salvajes en el mundo. Se muestran rastros pequeños, de menor opacidad a distancia, que se resaltan al acercarse. Su forma comunica el tipo; la identidad aparece solamente al comenzar el combate. El diálogo de investigación conserva el tipo y el hábitat, con un retrato desconocido. Los equipos de los entrenadores se revelan un Pokémon a la vez al entrar en la arena. El compañero del jugador sí permanece visible.

| Tipo | Señal | Ejemplos que puede esconder |
|---|---|---|
| Planta | Hoja | Bulbasaur, Oddish, Bellsprout |
| Fuego | Llama | Charmander, Vulpix, Growlithe |
| Agua | Gota | Squirtle, Psyduck, Poliwag |
| Eléctrico | Chispa | Pikachu, Magnemite, Voltorb |
| Normal | Huellas | Rattata, Meowth, Eevee |
| Lucha | Puño | Mankey, Machop, Machoke |
| Roca | Piedras | Geodude, Onix, Graveler |
| Fantasma | Espiral | Gastly, Haunter, Gengar |
| Veneno | Burbujas | Ekans, Oddish, Gastly |
| Bicho | Caparazón con patas | Caterpie, Weedle, Pinsir |
| Volador | Pluma | Pidgey, Spearow, Farfetch’d |
| Tierra | Relieve | Sandshrew, Diglett, Cubone |
| Psíquico | Ojo | Abra, Drowzee, Mew |
| Hielo | Cristal | Jynx, Lapras, Articuno |
| Dragón | Colmillos | Dratini, Dragonair, Dragonite |
| Acero | Tuerca | Magnemite, Magneton |
| Hada | Estrella | Clefairy, Jigglypuff, Mr. Mime |

La especie se elige entre las familias de la región y las formas disponibles a ese nivel. Luego se muestra una señal de uno de sus tipos. Dos rastros Agua en regiones distintas pueden representar familias diferentes: Squirtle en la ribera y Staryu en la costa. El nivel limita las formas evolucionadas. Una señal Planta puede esconder Bulbasaur u Oddish en zonas tempranas, y Venusaur en zonas de nivel alto.

La misma semilla, mapa, visita y coordenadas conservan señal, especie, IV y naturaleza. Cerrar el diálogo no vuelve a sortear al ejemplar. Al salir y regresar al mapa, los salvajes se renuevan; la geometría y los objetos recogidos se conservan. Cada chunk de 8 × 8 casillas tiene un 22 % de probabilidad de proponer un rastro, que solo aparece en salas o caminos transitables. Las ciudades no tienen salvajes.

## Crecimiento con azar controlado

Todas las especies tienen el mismo presupuesto base de combate: **480 puntos**. Los datos oficiales definen el reparto y el estilo de cada Pokémon, pero se adaptan para que ninguna especie quede descartada por su suma base. Magikarp mantiene una identidad veloz, Onix defensiva y Chansey resistente; los legendarios comparten el mismo presupuesto. Evolucionar es una elección de tipos, habilidades y reparto, sin aumentar el presupuesto total.

Se parte de `80 + 0,7 × (base oficial − media de la especie)` en cada estadística, se limita cada valor entre 45 y 125 y se redistribuye el sobrante hasta sumar 480. Se usan estos valores adaptados como B en las fórmulas siguientes. La suma por sí sola no garantiza una victoria: las afinidades, alcance y decisiones siguen importando.

Los IV de 0–31 y la naturaleza generan diferencias individuales; los EV permiten especializar libremente. Los datos oficiales de las 1025 especies de las nueve generaciones están almacenados en el proyecto desde [PokéAPI](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv), sin consultas de red durante la partida.

Para nivel L, base B, IV y EV:

```text
PS = floor((2 × B + IV + floor(EV / 4)) × L / 100) + L + 10
Otra = floor((floor((2 × B + IV + floor(EV / 4)) × L / 100) + 5) × naturaleza)
```

La naturaleza aplica 1,1 a una estadística y 0,9 a otra; las neutras no cambian nada. Los PS no reciben ese modificador. IV y naturaleza se conservan al entrenar, cargar o evolucionar.

Cada victoria da cuatro puntos de entrenamiento. Cada punto añade hasta cuatro EV: máximo 252 por estadística y 510 entre todas. La experiencia usa una curva adaptada a sesiones cortas, hasta nivel 100. Están disponibles las evoluciones entre las 1025 especies, incluidas las de familias que continúan en generaciones posteriores. Se respetan los requisitos de nivel de esta demo; las evoluciones por piedra consumen la piedra compatible, y las de intercambio se adaptan a Cordón Unión. Los 3 fragmentos de partidas antiguas siguen siendo una alternativa válida. Eevee tiene sus ocho ramas. Se conservan los umbrales anteriores de Kanto; los métodos especiales posteriores se adaptan a nivel o fragmentos, sin reproducir todas las condiciones de los juegos de turnos.

## Árboles de habilidades

Cuatro pestañas en Habilidades permiten consultar requisitos, rangos, puntos disponibles y efectos. Cada árbol tiene una raíz, dos ramas de tres rangos y dos especializaciones finales. Cada rango cuesta 1 punto; las especializaciones finales requieren dos rangos de su rama y cuestan 2. La raíz es común y las dos ramas son excluyentes: el primer rango de una rama bloquea la opuesta, incluidas sus especializaciones. El máximo invertible en cada árbol es 6 puntos (raíz + tres rangos + final), además del aprendizaje de técnicas del Pokémon. No se usan los puntos de entrenamiento de EV. Todas las especies acceden al mismo árbol de desarrollo y a las mismas mejoras de dominio; las técnicas mantienen su identidad y compatibilidad.

| Árbol | Experiencia y puntos | Mejoras |
|---|---|---|
| Entrenador general | 2 puntos iniciales; 1 cada 150 XP. Victoria/captura: 50 XP; región nueva: 40; tipo investigado por primera vez: 15. | Vínculo +5 % XP para el activo; Cartografía +3 % velocidad de exploración por rango; Coordinación −0,4 s entre cambios por rango; Rastreo amplía la interacción de 64 a 80; Primeros auxilios sube la curación de bayas a 36 %. |
| Especialidad por tipo | Un registro separado para cada uno de los 18 tipos presentes. Primer rastro de ese tipo: 20 XP; participante en una victoria: 30 XP repartidos entre sus tipos. 1 punto al obtener XP y 1 más cada 90 XP. | Afinidad +5 % regeneración de energía; Técnica elemental +3 % daño de movimientos de ese tipo por rango; Resistencia −3 % daño recibido por rango; Especialista +8 % duración de estados del tipo; Reservas −8 % coste de energía. |
| Cada Pokémon | 2 puntos iniciales; 40 XP por victoria en la que participa; 1 punto cada 80 XP. | Disciplina +5 % regeneración de energía y habilita aprender; Impulso +2 % daño por rango; Temple +2 % PS de arena por rango; Instinto −8 % recarga de esquiva; Respiración +8 % regeneración de stamina. |
| Cada técnica aprendida | 1 punto inicial; 15 XP + 10 por cada uso resuelto en una victoria, hasta 30 usos; 1 punto cada 75 XP. | Dominio −3 % recarga; Potencia/control +4 % daño y +5 % duración de estados por rango; Fluidez −3 % coste de stamina por rango; Proyección +10 % alcance o duración de mejoras propias; Ritmo −8 % recarga. |

Los porcentajes por rango se suman dentro de la habilidad; los factores de árboles distintos se multiplican. En Pokémon con dos tipos, regeneración, reducción de daño y coste de energía del entrenador se promedian para evitar duplicar la ventaja. La técnica elemental solo mejora movimientos de un tipo propio de la especie; conocer un ataque de cobertura no concede esa especialidad.

La pestaña Pokémon muestra todas las técnicas compatibles con la especie, sus niveles mínimos registrados y filtros de búsqueda. Aprender requiere Disciplina, un punto y superar la prueba de memoria de cinco flechas. El punto se gasta solo al aprobar; fallar o abandonar bloquea esa técnica hasta el siguiente nivel. El bloqueo persiste al guardar y evolucionar. En Ataques se equipan hasta cuatro técnicas libremente entre las aprendidas, sin repeticiones en los espacios regulares cuando el catálogo lo permite. Ditto repite Transformación. Las formas finales y especies sin evolución tienen un quinto espacio de definitiva, de un uso por Pokémon y batalla. Cualquier técnica aprendida puede mejorarse aunque esté sin equipar.

Las mejoras de Transformación se trasladan a las técnicas copiadas durante la pelea; sus usos dan práctica al árbol de Transformación. Ditto no aprende permanentemente los movimientos del rival ni copia sus mejoras. El desarrollo del propio Ditto y sus estadísticas se conservan.

Los cambios se guardan inmediatamente. Durante una pelea se puede consultar el menú, que pausa la simulación; comprar habilidades, aprender y equipar requieren terminarla. Los participantes, incluso si terminaron en reserva, obtienen desarrollo; los ataques cancelados antes de resolverse no dan práctica. Las recompensas se aplican una sola vez y las derrotas no dan XP de habilidad. Evolucionar conserva todos los árboles, técnicas aprendidas, puntos y selección equipada. La etapa final desbloquea una definitiva compatible.

Las partidas con árboles antiguos que invirtieron en ambas ramas recuperan todos los puntos de esas dos ramas. Se conservan la raíz, XP, técnicas aprendidas, gasto de aprendizaje y equipo. Los árboles con un único camino mantienen su elección.

## Movimientos de campo

Las nueve técnicas se abren desde Menú → Movimientos de campo o H. Corte, Fuerza y Golpe Roca también se usan con E junto al obstáculo; Surf desde la orilla, y Cascada desde el agua en una aproximación vertical. Los árboles pequeños y las dos clases de roca tienen dibujos distintivos. Vuelo muestra únicamente ciudades visitadas. Los Pokémon compatibles se consultan en los CSV oficiales de PokéAPI en todas las generaciones, con IDs y fuente en `assets/field-moves-source.json`; no se deduce compatibilidad solo por su tipo.

| Técnica | Resultado | Medalla regional |
|---|---|---|
| Corte | Elimina un árbol pequeño marcado | Hoja |
| Vuelo | Desde el exterior, lleva a una ciudad visitada | Faro |
| Surf | Permite atravesar agua; termina al alcanzar tierra | Cauce |
| Fuerza | Desplaza una roca pesada una casilla, sin ocupar barreras, personajes, salidas ni tesoros | Duna |
| Destello | Quita la oscuridad de la cueva actual hasta salir | Brote |
| Golpe Roca | Elimina una roca agrietada | Niebla |
| Cascada | Cruza un salto vertical mientras navegas | Ascua |
| Excavar | Vuelve a la entrada exterior de la cueva | Ninguna |
| Teletransporte | Desde el exterior, vuelve al último centro donde descansaste | Ninguna |

La asignación de medallas es propia de Frontera. Un compañero compatible de la colección usa la técnica sin aprenderla en los cuatro espacios de batalla; no hay consumo de PP ni uso durante el combate. Se conserva la función de campo documentada en [la guía oficial de Pokémon](https://diamondpearl.pokemon.com/en-ca/trainersguide/fundamentals/sinnoh/) y en el manual de Nintendo de Pokémon Diamante. Los caminos abiertos, rocas desplazadas y último centro persisten por mapa. Surf conserva usuario y posición en el guardado. Al cambiar de mapa se restablecen Surf y Destello. La geometría original de la semilla permanece estable y todos los caminos previamente transitables se conservan.

Diez pruebas de campo comprueban estos permisos, colisiones, destinos, contextos y guardados. El harness Canvas/DOM verifica también el menú, H, E, Corte, Surf, iluminación, Excavar, Vuelo y la limpieza de la caché de colisiones al desembarcar. Se revisaron renders de esos cambios; queda pendiente la revisión de disposición en un navegador real.

## Arena 3D y ritmo de combate

La arena tiene coordenadas X/Z, colisiones circulares y cámara en perspectiva. El suelo, límites y pilares se proyectan desde puntos tridimensionales. Los sprites siguen siendo imágenes 2D orientadas al rival, ordenadas por profundidad y con escala según su distancia a la cámara. No se utilizan modelos 3D de Pokémon.

Se puede rodear, retroceder y esquivar hacia el fondo. Proyectiles y ataques comprueban la profundidad: coincidir en la pantalla horizontal no basta para recibir daño. La IA se aproxima más despacio, mantiene una distancia adecuada al kit, alterna desplazamientos laterales y retroceso, y deja intervalos entre decisiones. El empuje al recibir daño es pequeño y existe una ventana breve de protección para evitar cadenas de golpes sin salida. Una esquiva sin dirección busca una salida lateral cuando retroceder llevaría al borde.

La vida de arena es PS × 6, ajustada por Temple. El daño usa las estadísticas físicas o especiales, tipo, variación moderada y un factor de balance para ampliar el tiempo de reacción. Las técnicas tienen aviso previo mediante zonas en el suelo; los ataques de zona fijan la posición anunciada, por lo que se pueden evitar moviéndose.

Los personajes de ciudad, cuatro clases de entrenador y los líderes usan 22 siluetas originales y paletas por generación en `npc-art.js`: pelo, ropa sombreada, gorros, gafas, mochilas y accesorios según su función. Sus cuatro vistas mantienen la orientación de la visión de los entrenadores. El parpadeo discreto se desactiva con movimiento reducido.

## Intentar escapar

El botón Intentar escapar o R realiza una tirada de huida en combates salvajes, contra entrenadores y gimnasios. En encuentros salvajes, incluidos los de pesca, el rival debe tener 90 % de vida o menos: debes quitarle al menos un 10 % antes del intento. El botón permanece deshabilitado y explica el requisito mientras el salvaje tenga más vida; R también lo respeta. Contra entrenadores y gimnasios no se exige este daño previo. La probabilidad usa velocidad relativa, distancia, vida del rival y fallos previos; está limitada entre 12 % y 92 %. Contra un entrenador es algo menor; la parálisis también la reduce. Un fallo permite seguir combatiendo y requiere 3,5 segundos antes del siguiente intento. La recarga y los intentos son del combate y se conservan al cambiar de compañero. La presentación, el sueño, un Pokémon debilitado, la elección forzada y el resultado final bloquean la huida. Pausa y menús detienen la simulación.

Escapar devuelve al mismo lugar de exploración, sin dinero, premios, experiencia, medallas o marca de victoria. Los objetos utilizados sí permanecen consumidos. El entrenador no repite el desafío hasta salir de su campo de visión y volver a entrar.

## Fin de batalla

Al resolverse victoria, derrota o captura, se detienen los ataques y desplazamientos. Se limpian proyectiles y temblor, se deja reposar a los sprites y aparece un rótulo pequeño de “Combate terminado” con un oscurecimiento leve. Tras 1,15 segundos se muestran las recompensas mediante una entrada de 0,22 segundos, sin destellos ni celebración grande. Con preferencia de movimiento reducido, la espera se acorta a 0,18 segundos y el diálogo no se anima. No se pueden gastar bayas, repetir captura o retirarse durante esa transición. Las recompensas se entregan una sola vez.

## Ataques de contacto

Las técnicas cuerpo a cuerpo y de embestida incluyen un avance corto hacia el objetivo (hasta 210 unidades), con un salto visual discreto y sin invulnerabilidad. El arco frontal abarca unos 168 grados, con un alcance mínimo de 183 unidades para técnicas aprendidas. La trayectoria queda fijada al activar el ataque, de modo que el rival puede apartarse; no se añade seguimiento automático. El golpe básico automático conserva su alcance y área. Esquivar, cambiar de compañero, debilitarse, escapar y terminar el combate cancelan el avance.

## Energía y stamina

La energía es una reserva de 0–100 que se consume con técnicas, golpe básico y esquiva. Determina la capacidad de stamina: `máximo = 40 + 0,6 × energía`. Con energía 100 hay 100 de capacidad; con energía 20 hay 52. La regeneración de stamina también cae al bajar la energía: `6 + 0,1 × energía` por segundo, con ajustes de estados y reserva.

La stamina paga las acciones. La esquiva cuesta 18; las cuatro técnicas cuestan normalmente 12, 21, 18 y 20; la definitiva 32; el golpe básico 5. Los costes y recargas figuran en los botones. Tras 1,25 s sin gastar recursos comienza la recuperación. Caminar no requiere stamina y no pierde velocidad por agotamiento, de modo que siempre existe la posibilidad de alejarse para recuperarse. Mientras hay desplazamiento real, la energía no se regenera y la stamina se recupera al 50 %. Al detenerse vuelve la recuperación completa. Parálisis y lentitud sí reducen la velocidad.

Las medicinas de la mochila tienen una recarga de 8 s por compañero. Cada baya posee su efecto propio: Aranja cura 10 PS base ×6, Zidra 25 % de vida, Ziuela cura estados y Zanama recupera 15 de energía. Primeros auxilios mejora la curación de las bayas. Las bayas equipadas se consumen automáticamente al cumplirse su condición.

## Movimientos y estados

Los kits de las 1025 especies usan movimientos cuyo nombre, tipo y compatibilidad se verificaron en los datos de [PokéAPI](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv). La selección es compatible con al menos una versión histórica, incluyendo movimientos heredados de etapas anteriores; no reproduce una generación ni sus niveles de aprendizaje completos. Alcance, coste, recarga, duración y potencias se adaptan al tiempo real. Unown, Smeargle, Cosmog y Cosmoem, con repertorios canónicos mínimos, usan modos ofensivos y defensivos del mismo movimiento compatible. Los dos ataques se basan en potencias de arena 55 y 75, ajustadas por alcance cercano o drenaje. Un ataque originalmente débil puede ser útil sin quedar condicionado por su potencia en el juego de turnos.

Caterpie usa seda para frenar y Picadura para recuperar una parte de la vida; los capullos tienen técnicas ofensivas y defensivas. Magikarp tiene Placaje, Azote (más fuerte con poca vida) y Salpicadura adaptada como impulso de ataque y stamina. Ditto comienza con Transformación; las otras dos casillas se habilitan al copiar. Copia las cuatro técnicas y los tipos del rival, conserva sus propios stats y PS y no transforma permanentemente la criatura guardada. Si ambos son Ditto sin transformar, conserva su forma y el golpe básico permite resolver la pelea. Regeneración recupera hasta un 14 % de vida en 7 segundos, con recarga de 10 segundos.

| Especie | Ejemplo de kit y función |
|---|---|
| Bulbasaur | Látigo Cepa cercano, Hoja Afilada en abanico y Drenadoras. |
| Charmander | Ascuas, Arañazo y Pantallahumo para reducir precisión. |
| Squirtle | Pistola Agua, Placaje y Refugio defensivo. |
| Pikachu | Impactrueno dirigido, Ataque Rápido y Onda Trueno. |
| Gastly | Lengüetazo, Bola Sombra e Hipnosis. |
| Haunter | Bola Sombra, Come Sueños e Hipnosis; Come Sueños exige un rival dormido. |
| Onix | Lanzarrocas, Tumba Rocas sobre una zona anunciada y Chirrido. |
| Eevee | Ataque Rápido, Mordisco y Ataque Arena. |

Hay ataques cercanos, avances, proyectiles rectos, abanicos, bombas con seguimiento, rayos, conos y zonas anunciadas. Se distinguen por alcance, preparación, dibujo, dirección, cobertura de tipo y efecto, además del nombre.

Veneno, quemadura y Drenadoras producen daño con el tiempo; Drenadoras devuelve parte de ese daño. Parálisis y lentitud reducen movimiento. Sueño dura dos segundos, permite cambiar de compañero y se rompe con daño tras una breve ventana. Después de expirar un estado principal existe protección temporal contra volver a recibir otro de inmediato. Quemadura reduce daño físico; confusión y menor precisión afectan ofensiva; otros movimientos alteran ataque, defensa o velocidad. Estos efectos se muestran con su tiempo restante en el HUD.

## Cambio de Pokémon

Q o el botón Cambiar abre el equipo y detiene la simulación mientras se elige. Se puede enviar cualquier compañero disponible. Cada uno conserva su vida, energía, stamina, recargas y estados durante esa pelea. En reserva recupera lentamente recursos; los estados siguen transcurriendo y el daño de veneno no desaparece al cambiar. No se rellenan recursos mediante cambios repetidos.

Hay seis segundos entre cambios voluntarios, reducibles hasta 4,8 s con Coordinación. El nuevo Pokémon aparece en la posición del anterior con una breve protección. Si el activo se debilita y quedan compañeros disponibles se exige elegir otro, sin esperar esa recarga. La derrota sucede al agotarse el equipo. Los PS actuales de cada Pokémon se conservan al ganar, perder, capturar o escapar y en el guardado, incluida la vida de los compañeros en reserva. Se muestran en exploración, Equipo y Mochila. Las pociones, bayas curativas y Revivir también se usan fuera de combate. Cambiar de mapa o abrir un menú no cura. Una derrota total devuelve al equipo a la última ciudad sin curarlo. Los niveles, EV de PS, Temple y evolución ajustan la vida máxima conservando los PS actuales exactos; un Pokémon a cero PS permanece debilitado. Las partidas antiguas inicializan sus PS una sola vez.

## Celular y pantalla completa

El botón junto a Pausa amplía el juego y permite salir. Usa la API nativa cuando está disponible; ante falta de soporte o rechazo, el juego ocupa el área visible de la página. En vertical conserva los controles bajo la arena; en horizontal los sitúa sobre los laterales de la arena y respeta las zonas seguras de la pantalla.

Un mando virtual a la izquierda controla las direcciones mediante desplazamiento del pulgar, con zona muerta y límite de recorrido. A la derecha están las cuatro técnicas, la definitiva cuando corresponde y Esquivar. Se puede mover en todas las direcciones y atacar con dos dedos. El botón Cambiar queda junto a Esquivar. Al soltar, cancelar el toque, pausar, abrir un diálogo o perder el foco, se detiene el movimiento. Los controles de teclado se conservan.

## Mapas conectados y continuidad

El mundo usa un grafo de 405 zonas distribuido en nueve regiones generacionales de 45 mapas, inspirado en la exploración de Diablo II: ciudades seguras, rutas con ramificaciones y cuevas con salas conectadas por corredores. Cada región tiene nueve ciudades, 18 rutas, nueve cuevas y nueve gimnasios. La topología de cada región es estable; la semilla genera las salas, caminos, tesoros y ejemplares de cada zona. No reproduce los mapas ni los actos de Diablo II. Las ciudades usan un plano construido para sus edificios y servicios.

Cada región tiene ciudad, ruta I, ruta II y cueva. Brote conecta las ocho regiones exteriores; sus rutas II forman además un anillo conectado. Las salidas físicas cambian de mapa al interactuar; nunca hay que atravesar un borde invisible para continuar. Cada mapa posee límites y rangos de nivel propios, que no escalan con el jugador. Las cuevas comienzan entre nivel 38 y 50, así que entrar pronto implica peligro. Los caminos principales de todas las regiones son accesibles sin medallas.

| Ciudad | Líder y tipo | Nivel del último compañero | Medalla |
|---|---|---:|---|
| Ciudad Brote | Vera · Roca | 9 | Brote |
| Villa Umbría | Olmo · Planta | 15 | Hoja |
| Ciudad Rocío | Nerea · Agua | 20 | Cauce |
| Ciudad Bruma | Violeta · Veneno | 25 | Niebla |
| Villa Ocre | Dante · Tierra | 30 | Duna |
| Ciudad Ámbar | Ignacio · Fuego | 35 | Ascua |
| Puerto Nácar | Faro · Eléctrico | 40 | Faro |
| Ciudad Céfiro | Aura · Psíquico | 45 | Mente |
| Villa Escarcha | Salma · Hielo | 50 | Cristal |

Las ciudades exteriores tienen centro, tienda, gimnasio, casa de especialidades, viviendas, rival y posta. Cada ruta o cueva tiene dos entrenadores y **dos objetos recogibles una sola vez**. No reaparecen al entrar y salir; los entrenadores sí admiten revancha al hablarles. En rutas y cuevas, los entrenadores no vencidos miran hacia un acceso despejado y detectan al jugador dentro de un cono frontal de hasta cinco casillas. Árboles, riscos, rocas, ruinas y paredes bloquean la visión, incluso en esquinas diagonales. Al detectar al jugador muestran «!» durante 0,65 s y comienzan el combate automáticamente. Los menús y la pausa detienen la detección y el aviso. Tras retirarse, el mismo entrenador espera a que el jugador salga y vuelva a entrar en su campo de visión; tras vencerlo, solo acepta revanchas voluntarias. Los rivales son opcionales; los nueve gimnasios de una región habilitan sus fronteras generacionales. Los combates de entrenadores y gimnasios usan equipos: al caer uno envían el siguiente con una breve protección, mientras el jugador conserva sus recursos de esa pelea. Sus Pokémon no se capturan.

Mapa local y minimapa muestran lo descubierto, la posición y salidas conocidas. El atlas muestra las conexiones y ciudades visitadas; las postas solo funcionan desde una ciudad hacia otra conocida. Los repelentes ocultan rastros de nivel inferior al activo durante una distancia de pasos real. No borran entrenadores ni objetos. La bicicleta acelera un 35 % fuera de cuevas. Las cañas funcionan cerca de agua y producen un encuentro de una familia acuática regional; hay 12 s entre lanzamientos. Cuerda Huida sale de una cueva hacia la última ciudad visitada.

Las partidas anteriores conservan colección, stats, entrenamiento, árboles, regalos del profesor y Medalla Brote. Se añade inventario convirtiendo sus Poké Balls y bayas existentes; empiezan en Ciudad Brote, porque las coordenadas del mundo anterior no representan los nuevos mapas. El dinero inicial de una partida migrada es ₽ 1.500 más ₽ 75 por victoria guardada, hasta 20. Misdreavus (#200), disponible en la primera demo, permanece válido si ya fue capturado; no aparece en la Pokédex ni en los encuentros nuevos.

Exportar e importar conserva mapas visitados, niebla, dinero, inventario, equipamiento, mejoras de PP y premios únicos, además de los datos anteriores. Una aventura nueva reemplaza la partida local. La vida durante el combate no persiste entre peleas; los objetos consumidos y el dinero sí se guardan.

## Pokédólares y objetos

Se implementan 83 objetos existentes en Pokémon, con nombres españoles e IDs verificados en [PokéAPI](https://pokeapi.co/docs/v2/#items-section) y sprites de [PokeAPI/sprites](https://github.com/PokeAPI/sprites/tree/master/sprites/items). Es una selección funcional; no incluye el catálogo completo de todas las generaciones. Los valores y algunos efectos se adaptan al combate en tiempo real. `assets/items-source.json` registra la fuente y `economy.js` las reglas efectivas de esta demo.

| Grupo | Ejemplos y función |
|---|---|
| Poké Balls | Poké Ball, Super Ball, Ultra Ball y Master Ball; eficacia creciente. |
| Medicinas | Pociones, Restaurar Todo, curas de estados, Revivir y Máximo Revivir. Los PS de curación fija se multiplican por 6 como la vida de arena. |
| Energía y PP | Éter y Elixir recuperan energía del activo o del equipo. Más PP y PP Máximos mejoran una técnica aprendida: −2 % de stamina por mejora, máximo tres. |
| Bayas | Aranja, Zidra, Ziuela, Meloc, Zreza, Atania, Safre, Perasi y Zanama; se usan o equipan para activación automática. |
| Entrenamiento | Caramelo Raro sube un nivel; seis vitaminas añaden hasta 10 EV, con los límites 252 por stat y 510 totales. No alteran IV ni naturaleza. |
| Evolución | Piedras Fuego, Agua, Trueno, Hoja y Lunar, y Cordón Unión para las evoluciones de intercambio. |
| Equipados | Potenciadores de tipo +10 %; Restos recupera 0,6 % PS/s; Campana Concha cura un octavo del daño directo; Garra Rápida reduce 5 % la recarga. Un objeto por ejemplar. |
| Combate | Ataque X, Defensa X, Especial X, Defensa Especial X, Velocidad X, Directo y Protección Especial: mejoras durante 15 s. |
| Viaje | Tres repelentes, Cuerda Huida, Mapa, Bicicleta y tres cañas. Los objetos clave no se consumen ni revenden. |
| Tesoros | Pepita, Perla, Perla Grande, Polvoestelar y Trozo Estrella: venta por Pokédólares. |

Empiezas con ₽ 1.500, 8 Poké Balls, 3 pociones, 3 bayas Zidra, Mapa y Caña Vieja. El profesor conserva sus dos regalos únicos. El centro es gratuito; cada pelea empieza con los PS que cada Pokémon conservó de la anterior. El centro no repone suministros. Esto permite entrenar y combatir aun sin dinero, y reserva el gasto para capturas, medicina y mejoras. Los salvajes dan XP y entrenamiento, sin dinero ni Poké Balls de regalo.

| Regla económica | Valor |
|---|---|
| Entrenador, primera victoria | ₽ 250 + 20 × nivel máximo + 60 × compañeros del rival. |
| Entrenador, revancha | 20 % del primer premio, mínimo ₽ 60. |
| Gimnasio, primera victoria | ₽ 1.000 + 80 × nivel máximo; medalla, piedra y 4 puntos EV extra una vez. |
| Gimnasio, revancha | 10 % del primer premio, mínimo ₽ 60. |
| Derrota | Gastos de regreso: 8 % del dinero, máximo ₽ 500. Regreso a la última ciudad; se conservan compañeros y objetos. |
| Nueve medallas | Una Master Ball; premio único. |
| Compra y venta | Precio común entre ciudades. Reventa normal al 35 %; tesoros con valor fijo. Sin beneficio por comprar y revender. |
| Desbloqueo de tiendas | Tiendas locales básicas; Shopping Rocío con plantas Azul, Plata y Oro abiertas por tarjetas encontradas. Las medallas no sustituyen tarjetas. |

La Poké Ball cuesta ₽ 200; Poción ₽ 300; Super Ball ₽ 600; Ultra Ball ₽ 1.200. Comprar medicinas requiere elegir entre aguantar una pelea, capturar o ahorrar para entrenamiento. Las revanchas de entrenadores y gimnasios mantienen una fuente lenta y renovable de dinero; los capítulos de Ivo pagan una sola vez; no son un premio único ni están limitadas por día. Hay límites de inventario y validación de cantidades, propiedad de objetos clave y saldo.

Capturar exige 35 % de vida o menos salvo Master Ball. Super Ball y Ultra Ball mejoran la probabilidad sin convertirse en captura garantizada. La Master Ball no falla y no se compra. Se conserva la opción de reclutar un salvaje derrotado gastando una Ball desde el resultado: es una adaptación propia de esta demo. Medicinas sin efecto no se consumen; equipar devuelve el objeto anterior. Las bayas automáticas consumidas permanecen consumidas incluso al retirarse.

## Ecología regional

| Región | Dirección | Familias y hallazgos característicos |
|---|---|---|
| Campiña Clara | Centro | Bulbasaur, Pidgey, Rattata, Pikachu, Nidoran, Meowth, Eevee y otros compañeros de pradera. Las familias evolucionadas también tienen hábitats exteriores. |
| Bosque Umbrío | Noroeste | Caterpie, Weedle, Oddish, Paras, Venonat, Bellsprout y sus familias. Mew es raro. |
| Ribera Musgo | Oeste | Squirtle, Psyduck, Poliwag, Slowpoke, Goldeen y Dratini. Agua dulce. |
| Pantano Bruma | Suroeste | Ekans, Grimer, Gastly, Drowzee, Koffing y sus familias. |
| Dunas Ocre | Sur | Sandshrew, Diglett, Mankey, Machop, Geodude, Cubone, Rhyhorn y luchadores. |
| Cráter Ámbar | Sureste | Charmander, Vulpix, Growlithe, Ponyta, Magmar y Flareon. Moltres es raro. |
| Costa Nácar | Este | Seel, Shellder, Horsea, Staryu, fósiles y sus familias. Agua marina. |
| Altos del Viento | Norte | Abra, Magnemite, Voltorb, Electabuzz, Pidgey, Zubat y familias eléctricas/psíquicas. Zapdos y Mewtwo son raros. |
| Cumbres de Escarcha | Noreste | Seel, Jynx, Lapras, Lickitung y otras especies resistentes. Articuno es raro. |

No son listas exhaustivas: algunas familias viven en más de una región. Los conjuntos completos están en `REGIONS` de `core.js`, y cada ficha de Pokédex indica todos los hábitats de la especie. La variedad depende de la región, del rango de nivel del mapa, de la visita y de la semilla. Se comprobó que todas las especies aparecen realmente en el mundo generado, además de figurar en los conjuntos.

## Generaciones y paisajes

La ciudad de inicio y la familia de encuentros dependen de la generación del inicial. El atlas muestra Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar y Paldea. Son versiones procedurales originales: ciudades y líderes propios, sin reproducir los mapas oficiales. Completar nueve gimnasios abre las generaciones adyacentes; viajar conserva exactamente los PS, equipo y progreso. El rango de viaje añade ocho niveles por región nueva, hasta nivel 100. Las partidas previas permanecen en su mapa de Kanto.

Cada región permite explorar volcanes con lava y basalto, montañas con riscos, desiertos con cactus, selvas densas con palmeras, lianas y helechos, y pantanos con agua y juncos. Se generan barreras reales, claros y caminos conectados, incluyendo puentes sobre el agua o la lava. Los mapas de selva tienen un suelo y una vegetación diferenciados del bosque.

## Sprites y arquitectura

984 especies con hojas de [SpriteCollab / PMDCollab](https://sprites.pmdcollab.org/), incluidas 832 incorporaciones de generaciones 2–9. Kanto y Misdreavus conservan sus imágenes y metadatos exactamente. Se seleccionan Idle, Walk, Attack, Shoot, Hurt y Sleep, conservando PNG, sombras, XML y créditos. El renderer usa las duraciones, ocho direcciones y anclajes extraídos de las sombras. Las poses ausentes se adaptan con animaciones disponibles registradas en el manifiesto. Quedan 41 especies con imagen frontal de PokéAPI y movimiento por Canvas; `assets/sprite-coverage.json` enumera los casos. Falinks combina un Brass y cinco Trooper; Pyroar usa la forma hembra, Gimmighoul la forma Andante y Miraidon el modo limitado. Los sprites se cargan bajo demanda, incluyendo ambos componentes de Falinks. La Pokédex muestra 18 retratos por página y las especies grandes se ajustan al contenido visible.

Sprites originales: CHUNSOFT y contribuciones comunitarias atribuidas por especie. Los registros completos están en `assets/credits.json` y `assets/credit_names.txt`. Se incluye la licencia del repositorio: las contribuciones comunitarias exigen atribución y uso no comercial. Esto no concede derechos sobre la propiedad intelectual Pokémon.

`core.js` contiene estadísticas, kits, ciudad y ecología regional; `progression.js` los árboles y recompensas; `skills-ui.js` sus menús; `campaign.js` los mapas y entrenadores; `economy.js` el dinero e inventario; `adventure-ui.js` mochila, tienda y mapas; `combat.js` la simulación 3D, estados, recursos y equipo; `arena-art.js` la arena en perspectiva; `world-art.js` los escenarios y rastros; `game.js` conecta Canvas, controles, diálogos y guardado. Los ZIP de sprites y proyecto se regeneran con `tools/build_downloads.py`.

## Pokédex

La Pokédex muestra los números #001–#1025, permite buscar por número o nombre y filtrar por tipo. Señala las especies capturadas y sus regiones de aparición. Las especies legendarias o míticas aparecen con menor probabilidad a partir del nivel 45 en regiones compatibles; las formas evolucionadas respetan sus umbrales. Cada entrada tiene sprites, datos, kit y al menos un hábitat real. No hay consultas a PokéAPI ni a SpriteCollab durante la partida: los recursos se sirven desde el proyecto.

## Verificación y límites

Se comprobaron estadísticas y continuidad, variedad de rastros, caminos de la ciudad y migración; también perspectiva, movimiento diagonal, colisiones en profundidad, recuperación de energía/stamina, costes, protección tras impactos, escape junto al borde, estados, técnicas defensivas, cambio de equipo, debilitamiento y captura. Pasaron 35 comprobaciones de comportamiento, 13 de progresión/ecología y 14 de campaña/economía, incluyendo compatibilidad de aprendizaje para las 151 especies y el compañero heredado, requisitos, límites de puntos, efectos reales, práctica de ataques, Transformación, continuidad al evolucionar y aparición real de los 151 en sus regiones. Se simularon peleas completas para revisar valores finitos y acotados y viabilidad de los controles simplificados. En una prueba adicional de ejemplares entrenados (IV 31, naturaleza ofensiva, EV en ofensiva y vida), las 151 especies terminaron un combate contra Rattata de igual nivel: 150 ganaron; Haunter perdió dejando al rival con un 2 % de vida. Caterpie, Metapod, Weedle, Kakuna, Magikarp y Ditto ganaron. Esto evalúa un escenario de entrenamiento, no la igualdad entre todos los enfrentamientos. Son escenarios de prueba, no una evaluación completa del equilibrio de todas las especies.

La regresión original de campaña recorre los 36 mapas exteriores de Kanto con 12 semillas para comprobar salidas, NPC y tesoros accesibles. Muestrea 600 visitas por mapa para comprobar hábitats, niveles, menor densidad y aparición efectiva de las 151 especies. Revisa continuidad, equipos de los nueve gimnasios, recompensas únicas, compras/ventas, medicina, equipamiento, piedras, PP y exploración.

El harness Canvas/DOM comprobó compras y ventas con botones reales, inventario, objetos equipados, curación, equipos del rival, gimnasios/revanchas, dinero, derrota, captura por selector, salidas, viajes entre ciudades, cuevas, niebla y persistencia de tesoros; también los cuatro menús de árboles, compras y requisitos, aprendizaje/equipamiento, bloqueo de compras en batalla, nuevos barrios, mercado, atlas y descubrimiento sin recompensas repetidas; también fullscreen y mando táctil, diálogos de ciudad, investigación, encuentros, botones y teclado, cambio desde celular y Q, elección forzada al debilitarse, descanso, gimnasio, recompensas, guardado y regreso al mundo. Se inspeccionaron renders del suelo 3D, sprites y gimnasio. No se verificó la página completa en un navegador real ni en un dispositivo táctil.

Para continuar: ajustar el equilibrio por especie con partidas reales, añadir misiones y ajustar rangos de nivel, frecuencia de encuentros y precios con partidas reales. El presupuesto comparable es una base de diseño; no sustituye pruebas de enfrentamientos entre todas las especies y estrategias. No hay crianza ni multijugador.

Los dos objetos de cada ruta o cueva se dibujan como Poké Balls rojas y blancas. Recoger una muestra el icono, nombre y cantidad durante cinco segundos en el área de juego, también en pantalla completa. La ubicación, contenido e identidad del objeto se conservan.

La verificación generacional comprueba 28 iniciales, las 1025 especies y sus archivos locales, 405 mapas conectados, 81 gimnasios, nueve campañas completas, fronteras adyacentes, viajes de retorno, evolución, PS exactos y migración. El harness Canvas/DOM comprueba también la selección de Johto y Paldea y el atlas generacional. No sustituye una revisión responsive en navegador o dispositivo real.


## Catálogo completo y prueba de aprendizaje (0.15)

970 movimientos y variantes registrados (937 IDs PokéAPI + 33 Gigamax de Showdown), con 979 definiciones de arena al conservar nueve variantes heredadas. Hasta cuatro técnicas equipadas y un quinto espacio en las 568 especies terminales; su uso se consume al activar la definitiva, aunque sea interrumpida o falle. Cambiar o Transformar conserva el uso; otra batalla lo restablece. La compatibilidad se verifica por especie y herencia, con todos los métodos y versiones. Hay 173 especiales o exclusivos de otras formas catalogados para consulta. Los efectos se adaptan al combate en tiempo real, no simulan íntegramente las condiciones de todos los juegos.

Para aprender: Disciplina, nivel indicado y un punto, que solo se gasta al superar una secuencia de cinco flechas. Vista previa de 3,2 s y 15 s para responder, con teclado/flechas/WASD o botones táctiles. Un error, tiempo agotado, abandono, cierre o recarga bloquea esa técnica hasta subir un nivel. Se guarda el bloqueo al comenzar. Conserva su nivel de bloqueo al evolucionar y no impide intentar otras técnicas. Un fallo al nivel 100 no tiene un nivel siguiente para repetir. Los iniciales comienzan con sus dos o tres técnicas de nivel 5, según su juego de debut. Aprender otras requiere nivel y minijuego; aprobar ocupa el siguiente espacio libre. Al llegar a cuatro se elige qué reemplazar. La evolución conserva las técnicas y habilita una definitiva conocida en la última etapa. Los iniciales anteriores sin uso ni mejoras se corrigen; las partidas en curso conservan sus movimientos entrenados y PS. Guardar o importar nunca rellena los espacios vacíos.


## Árboles progresivos y daño por tipo (0.20)

Debilidad simple ×1,6; doble ×2,2. Se combinan los tipos antes de aplicar el multiplicador. El factor de resistencia y de inmunidad conserva la adaptación del prototipo.

Cada árbol tiene 17 nodos: 5 de base, 4 de especialización y 8 de desarrollo avanzado. Las cuatro clases (Entrenador, Tipos, Pokémon y Ataques) tienen un camino inicial excluyente y nuevas elecciones excluyentes en las capas siguientes. Cada habilidad avanzada requiere su nodo anterior; completar una especialización hasta rango 2 permite elegir su desarrollo final.

Entrenador desbloquea capas a 300/900 XP, y Tipos a 180/600 XP. Pokémon y Ataques siguen las etapas 1/2/3 de su familia. Familias de dos etapas completan la tercera capa al nivel 40 en la forma final; especies sin evolución la abren a los niveles 20/40. Las familias de tres etapas mantienen el requisito de evolución incluso al nivel 100.

Las 48 habilidades nuevas tienen efectos en las funciones del juego: daño, estados, crítico, precisión, alcance, costes, preparación, recargas, energía/stamina, PS máximos, movimiento y embestida, cambios, curación con bayas, experiencia y práctica. Las inversiones previas se conservan. Comprar vida máxima no cura ni revive. Guardar, importar y evolucionar conservan las decisiones y los ataques aprendidos. Las capas de la interfaz se pueden desplegar para inspeccionar habilidades futuras; el acceso también se comprueba en la simulación, no solo en los botones.


## Inicio y economía de exploración (0.21)

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
