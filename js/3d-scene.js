/* ========================================
   3D-SCENE.JS — Immersive Three.js Background
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    // Add very subtle fog for depth
    scene.fog = new THREE.FogExp2(0x08080e, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,           // transparent background
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high DPI
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Create Particles (Stars / Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    // Solid Cyan palette for particles
    const color = new THREE.Color('#00f0ff');

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Spread particles across a wide area
        posArray[i] = (Math.random() - 0.5) * 100;     // x
        posArray[i + 1] = (Math.random() - 0.5) * 100;   // y
        posArray[i + 2] = (Math.random() - 0.5) * 100;   // z

        // Use solid color
        colorsArray[i] = color.r;
        colorsArray[i + 1] = color.g;
        colorsArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Custom shader material for glowy particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // Makes overlapping particles brighter
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Create wireframe 3D object (Icosahedron - techy feel)
    const geoIco = new THREE.IcosahedronGeometry(10, 1);
    const matIco = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(geoIco, matIco);
    icosahedron.position.x = 15;
    scene.add(icosahedron);

    const geoTorus = new THREE.TorusGeometry(12, 0.5, 16, 100);
    const matTorus = new THREE.MeshBasicMaterial({
        color: 0x00c8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(geoTorus, matTorus);
    torus.position.x = -15;
    torus.position.y = -5;
    scene.add(torus);

    // 4. Create 3D Text using Troika
    let myText = null;
    if (typeof troika_three_text !== 'undefined') {
        myText = new troika_three_text.Text();
        scene.add(myText);

        myText.text = "Hi, I'm Suryansh\na Python\nProgrammer.";
        myText.fontSize = 2.5;
        myText.position.z = 0;
        myText.position.y = 2; // Move it slightly up
        myText.color = 0xffffff;

        // Font customization
        myText.font = 'https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA.woff'; // Space Grotesk
        myText.anchorX = 'center';
        myText.anchorY = 'middle';
        myText.textAlign = 'center';
        myText.lineHeight = 1.2;
        myText.letterSpacing = 0.05;

        // Create a solid glowing material for the text
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.8, // Solid, strong glow
            roughness: 0.1,
            metalness: 0.8
        });
        myText.material = material;

        // Sync the text geometry
        myText.sync();
    }

    // Add a light source for the text material
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x9d4edd, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 5. Create 3D Python Logo using ExtrudeGeometry
    const pythonGroup = new THREE.Group();

    // Extrusion settings for a thick, rounded 3D shape
    const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };

    // Function to draw one half of the python logo (a stylized snake)
    function createSnakeShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 2);
        shape.lineTo(2, 2);
        shape.quadraticCurveTo(4, 2, 4, 0); // Head curve
        shape.lineTo(4, -1);
        shape.quadraticCurveTo(4, -3, 2, -3);
        shape.lineTo(-2, -3);
        shape.quadraticCurveTo(-4, -3, -4, -1);
        shape.lineTo(-4, 0);
        shape.lineTo(-2, 0);
        shape.lineTo(-2, -1);
        shape.quadraticCurveTo(-2, -1.5, -1.5, -1.5);
        shape.lineTo(1.5, -1.5);
        shape.quadraticCurveTo(2, -1.5, 2, -1);
        shape.lineTo(2, 0);
        shape.lineTo(0, 0);
        shape.lineTo(0, 2); // Close the loop

        // Add an eye (a hole in the shape)
        const eye = new THREE.Path();
        eye.absarc(2.5, 0.5, 0.4, 0, Math.PI * 2, false);
        shape.holes.push(eye);
        return shape;
    }

    const snakeShape = createSnakeShape();
    const snakeGeo = new THREE.ExtrudeGeometry(snakeShape, extrudeSettings);

    // Blue Snake
    const matBlue = new THREE.MeshStandardMaterial({
        color: 0x306998,
        roughness: 0.2,
        metalness: 0.6,
        emissive: 0x306998,
        emissiveIntensity: 0.2
    });
    const blueSnake = new THREE.Mesh(snakeGeo, matBlue);
    blueSnake.position.set(-0.5, 1, 0);
    pythonGroup.add(blueSnake);

    // Yellow Snake (Rotated 180 degrees)
    const matYellow = new THREE.MeshStandardMaterial({
        color: 0xFFE873,
        roughness: 0.2,
        metalness: 0.6,
        emissive: 0xFFE873,
        emissiveIntensity: 0.2
    });
    const yellowSnake = new THREE.Mesh(snakeGeo, matYellow);
    yellowSnake.rotation.z = Math.PI; // 180 degrees
    yellowSnake.position.set(0.5, -1, 0);
    pythonGroup.add(yellowSnake);

    // Position the whole logo in the scene
    pythonGroup.position.set(12, 0, -5); // To the right of the text

    // Responsive scaling and positioning
    if (window.innerWidth < 768) {
        pythonGroup.position.set(0, 5, -10); // Move above text on mobile
        pythonGroup.scale.set(0.5, 0.5, 0.5);
    } else {
        pythonGroup.scale.set(0.8, 0.8, 0.8);
    }
    // Add point lights directly orbiting the python logo for highlights
    const pyLightB = new THREE.PointLight(0x306998, 5, 20);
    pyLightB.position.set(-3, 3, 5);
    pythonGroup.add(pyLightB);

    const pyLightY = new THREE.PointLight(0xFFE873, 5, 20);
    pyLightY.position.set(3, -3, 5);
    pythonGroup.add(pyLightY);

    scene.add(pythonGroup);

    // 6. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // 5. Scroll Interaction (Parallax)
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // 6. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate target values for parallax mouse effect
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Rotate wireframe shapes
        icosahedron.rotation.x += 0.002;
        icosahedron.rotation.y += 0.003;

        torus.rotation.x -= 0.001;
        torus.rotation.y -= 0.002;

        // Apply mouse movement to point cloud group
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Animate the Troika Text
        if (myText) {
            // Subtle floating effect
            myText.position.y = 2 + Math.sin(elapsedTime * 2) * 0.2;

            // Subtly track mouse
            myText.rotation.y += 0.1 * ((targetX * 0.5) - myText.rotation.y);
            myText.rotation.x += 0.1 * ((targetY * 0.5) - myText.rotation.x);
        }

        // Animate Python Logo (Spinning Core)
        if (pythonGroup) {
            // Floating up and down
            pythonGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.5;
            // Constant 3D Rotation
            pythonGroup.rotation.y = elapsedTime * 0.5;
            pythonGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;
            pythonGroup.rotation.z = Math.cos(elapsedTime * 0.5) * 0.2;
        }

        // Adjust camera position slightly based on scroll
        camera.position.y = -scrollY * 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // 7. Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Update responsive positions
        if (window.innerWidth < 768) {
            pythonGroup.position.set(0, 5, -10);
            pythonGroup.scale.set(0.5, 0.5, 0.5);
        } else {
            pythonGroup.position.set(12, 0, -5);
            pythonGroup.scale.set(0.8, 0.8, 0.8);
        }
    });
}
