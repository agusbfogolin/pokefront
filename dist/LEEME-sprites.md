# Sprites de Pokémon Frontera · 0.16

Incluye las 1025 especies nacionales (#001–#1025) de las generaciones 1–9. Los 151 Pokémon de Kanto y Misdreavus (#200) conservan exactamente sus hojas y metadatos originales. Se añaden 832 especies con hojas de SpriteCollab: 984 especies PMD en total. Se seleccionan seis estados por especie: Idle, Walk, Attack, Shoot, Hurt y Sleep, con tiempos, anclajes y orientaciones originales. Algunas poses faltantes usan otra animación disponible; el manifiesto registra la adaptación. Las 41 especies sin hojas PMD utilizables conservan su imagen frontal de PokéAPI y movimiento por código. Su lista está en `assets/sprite-coverage.json`.

Formas usadas para ampliar la cobertura: Pyroar hembra (sin Attack/Sleep propios), Falinks con un líder Brass y cinco Trooper, Gimmighoul Andante y Miraidon en modo limitado. Los recursos de ambos integrantes de Falinks se conservan en `assets/870/` y `assets/870/leader/`, con sus créditos respectivos. Los demás sprites frontales nacionales se conservan como recursos alternativos.

Fuente: https://sprites.pmdcollab.org/
Repositorio: https://github.com/PMDCollab/SpriteCollab

Las carpetas `assets/<número>/` contienen hojas PNG, hojas de sombra, XML original y `credits.txt`. Se conservan colores, resolución y transparencia. El XML también enumera animaciones que no se descargaron.

`assets/sprites_manifest.json` indica las animaciones seleccionadas, dimensiones, duraciones por frame, direcciones, límites del contenido visible y anclajes. `assets/sprites.js` contiene los mismos datos para el juego.

Las filas originales siguen el orden Sur, Sureste, Este, Noreste, Norte, Noroeste, Oeste y Suroeste. Los frames se ordenan horizontalmente. El anclaje se obtiene del píxel blanco de las hojas de sombra.

Créditos: CHUNSOFT y los artistas comunitarios indicados por especie en `assets/credits.json`, los archivos `credits.txt` y `assets/credit_names.txt`. Se incluye la atribución original sin reemplazarla por un crédito genérico.

Consultar `assets/SPRITECOLLAB_LICENSE.md`. Las contribuciones comunitarias requieren atribución y uso no comercial. Los sprites oficiales y la propiedad intelectual Pokémon conservan los derechos de sus respectivos titulares.

Los datos de 1025 especies, evoluciones y movimientos compatibles se incluyen desde PokéAPI. Sus reglas se adaptan a esta arena en tiempo real. Cada especie comparte el mismo presupuesto base de combate de 480 puntos, conservando su estilo. El renderer usa sprites 2D en perspectiva y carga las hojas cuando son necesarias.

## Objetos incluidos desde la versión 0.7

83 objetos verificados en los CSV oficiales de PokéAPI, con ID y nombre español. El registro está en `assets/items-source.json`; los iconos originales provienen de https://github.com/PokeAPI/sprites/tree/master/sprites/items. Los precios y efectos de la demo se adaptan en `economy.js`. Cordón Unión utiliza un icono original dibujado por código, indicado en el registro, porque la fuente no dispone de ese sprite. `tools/fetch_items.py` reconstruye el catálogo y sus recursos. Pokémon pertenece a sus respectivos titulares.

## Movimientos de campo · 0.11

`assets/field-moves.js` contiene compatibilidad de Corte, Vuelo, Surf, Fuerza, Destello, Golpe Roca, Cascada, Excavar y Teletransporte de todas las generaciones, conservando los permisos de Frontera. `assets/field-moves-source.json` registra IDs, CSV de PokéAPI y adaptaciones de Frontera. Los dibujos de obstáculos y efectos se generan por código en `field-art.js`.
