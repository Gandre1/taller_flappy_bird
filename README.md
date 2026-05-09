
# Flappy Bird Game

Un juego estilo Flappy Bird implementado usando HTML5 Canvas, CSS y JavaScript puro.

## Capturas de pantalla

![FlappyBird (1)](capturas/FlappyBird%20(1).png)

![FlappyBird (2)](capturas/FlappyBird%20(2).png)

![FlappyBird (3)](capturas/FlappyBird%20(3).png)

## Estructura del proyecto

flappy-bird-game/
├── index.html              # Archivo HTML principal con el elemento canvas
├── css/
│   └── style.css          # Diseño responsive y estilos
├── js/
│   ├── config.js          # Configuración y ajustes del juego
│   ├── game.js            # Motor principal del juego y punto de entrada
│   ├── bird.js            # Física y controles del pájaro
│   ├── pipe.js            # Generación y administración de tuberías
│   ├── collision.js       # Sistema de detección de colisiones
│   ├── renderer.js        # Renderizado en canvas e interfaz
│   ├── score.js           # Control de puntuación y persistencia
│   ├── input.js           # Manejo de entrada (teclado, mouse, táctil)
│   ├── state.js           # Gestión de estados del juego
│   ├── sound.js           # Efectos de sonido (opcional)
│   └── test-setup.js      # Verificación de configuración
├── assets/
│   ├── images/            # Sprites e imágenes del juego
│   └── sounds/            # Efectos de sonido
├── package.json           # Dependencias y scripts
└── babel.config.js        # Configuración de Babel para pruebas

## Características

- **Renderizado con HTML5 Canvas**: Animación fluida a 60 FPS usando `requestAnimationFrame`
- **Diseño Responsive**: Se adapta a distintos tamaños de pantalla y dispositivos
- **Motor de Física**: Gravedad y salto realistas
- **Detección de Colisiones**: Detección eficiente por cajas
- **Sistema de Puntuación**: Guarda puntuación actual y récord con persistencia en `localStorage`
- **Manejo de Entrada**: Soporta teclado (ESPACIO), click del mouse y entrada táctil
- **Estados del Juego**: START, PLAYING y GAME_OVER con transiciones correctas
- **Sonidos**: Sistema opcional con degradación elegante
- **Arquitectura Modular**: Separación limpia de responsabilidades con interfaces bien definidas

## Requisitos cumplidos

Esta implementación cumple con los siguientes requisitos de la especificación:

### Requisito 1: Inicialización y estructura del juego
- ✓ Usa `requestAnimationFrame` para el ciclo principal
- ✓ Separa HTML, CSS y JavaScript en archivos distintos
- ✓ Usa HTML5 Canvas para el renderizado del juego
- ✓ Implementa diseño responsive básico para móviles

### Requisito 10: Calidad y estructura del código
- ✓ Sigue buenas prácticas y estándares de JavaScript
- ✓ Usa nombres de variables y funciones significativos
- ✓ Incluye comentarios apropiados para lógica compleja
- ✓ Separa responsabilidades en módulos lógicos
- ✓ Maneja errores de forma adecuada

## Cómo empezar

### Requisitos previos
- Node.js y npm instalados

### Instalación
1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install

### Ejecutar el juego

1. Inicia el servidor de desarrollo:

   ```bash
   npm start
   ```
2. Abre tu navegador en `http://localhost:3000`
3. El juego se inicializará automáticamente

### Controles

* **ESPACIO**: Hace saltar al pájaro
* **CLICK DEL MOUSE**: Hace saltar al pájaro
* **TOUCH**: Hace saltar al pájaro en dispositivos móviles
* **R o ENTER**: Reinicia el juego cuando termina

### Pruebas

Ejecuta la suite de pruebas:

```bash
npm test
```

Ejecuta las pruebas con cobertura:

```bash
npm run test:coverage
```

## Arquitectura del juego

### Componentes principales

1. **GameEngine** (`game.js`): Orquestador principal, administra el ciclo del juego y los subsistemas
2. **Bird** (`bird.js`): Personaje jugador con física y animación
3. **PipeManager** (`pipe.js`): Genera y administra los obstáculos
4. **CollisionDetector** (`collision.js`): Maneja la detección de colisiones
5. **Renderer** (`renderer.js`): Dibuja todos los elementos del juego en canvas
6. **ScoreManager** (`score.js`): Controla la puntuación y el récord
7. **InputHandler** (`input.js`): Procesa la entrada del usuario
8. **GameStateManager** (`state.js`): Gestiona los estados y transiciones del juego
9. **SoundManager** (`sound.js`): Efectos de sonido opcionales

### Configuración

Todos los ajustes del juego están centralizados en `js/config.js`, incluyendo:

* Dimensiones y colores del canvas
* Parámetros de física del pájaro (gravedad, fuerza de salto)
* Configuración de generación de tuberías (altura del hueco, intervalo de aparición)
* Reglas del juego (altura del suelo, puntuación)
* Configuración de entrada
* Ajustes de sonido
* Objetivos de rendimiento

## Desarrollo

### Agregar nuevas funciones

1. Sigue el patrón de arquitectura modular
2. Agrega opciones de configuración en `config.js`
3. Actualiza los subsistemas relevantes
4. Añade pruebas para la nueva funcionalidad
5. Actualiza la documentación

### Estrategia de pruebas

* **Pruebas unitarias**: Evalúan componentes individuales de forma aislada
* **Pruebas basadas en propiedades**: Verifican propiedades universales en distintas entradas
* **Pruebas de integración**: Evalúan la interacción entre componentes
* **Pruebas de rendimiento**: Verifican el objetivo de FPS

### Estilo de código

* Usa nombres significativos para variables y funciones
* Agrega comentarios JSDoc para las APIs públicas
* Mantén una indentación consistente de 2 espacios
* Maneja errores con fallbacks apropiados

## Compatibilidad con navegadores

* Chrome 60+
* Firefox 55+
* Safari 11+
* Edge 79+
* Mobile Safari 11+
* Chrome para Android 60+

## Objetivos de rendimiento

* Mínimo 30 FPS en todos los dispositivos compatibles
* Entrada responsiva con latencia menor a 100 ms
* Uso eficiente de memoria con object pooling
* Degradación elegante en funciones no soportadas

## Licencia

Licencia MIT — ver el archivo LICENSE para más detalles

## Agradecimientos

* Basado en el juego original Flappy Bird de Dong Nguyen
* Construido con JavaScript puro con fines educativos
* Diseñado con una arquitectura limpia y mantenible
