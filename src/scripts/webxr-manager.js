/**
 * WebXR Manager for AR/VR Features
 * Handles 3D learning objects, virtual labs, and immersive experiences
 */

class WebXRManager {
    constructor() {
        this.xrSession = null;
        this.xrReferenceSpace = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controllers = [];
        this.raycaster = new THREE.Raycaster();
        this.intersected = [];
        this.isSupported = false;
        this.isSessionActive = false;
        
        this.init();
    }

    /**
     * Initialize WebXR Manager
     */
    async init() {
        try {
            // Check WebXR support
            this.isSupported = await this.checkWebXRSupport();
            
            if (!this.isSupported) {
                console.warn('⚠️ WebXR not supported in this browser');
                return;
            }

            // Initialize Three.js
            this.initThreeJS();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('✅ WebXR Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize WebXR Manager:', error);
        }
    }

    /**
     * Check WebXR support
     */
    async checkWebXRSupport() {
        if (!navigator.xr) {
            return false;
        }

        try {
            const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
            return isSupported;
        } catch (error) {
            console.error('WebXR support check failed:', error);
            return false;
        }
    }

    /**
     * Initialize Three.js
     */
    initThreeJS() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Add to DOM
        const container = document.getElementById('xr-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('vrdisplaypresentchange', () => this.onVRDisplayPresentChange());
    }

    /**
     * Start VR session
     */
    async startVRSession() {
        if (!this.isSupported) {
            throw new Error('WebXR not supported');
        }

        try {
            const session = await navigator.xr.requestSession('immersive-vr', {
                requiredFeatures: ['local-floor'],
                optionalFeatures: ['bounded-floor', 'hand-tracking']
            });

            this.xrSession = session;
            this.isSessionActive = true;

            // Setup session event listeners
            this.setupSessionEventListeners();

            // Start rendering
            this.renderer.xr.setSession(session);
            this.renderer.setAnimationLoop(() => this.render());

            // Create reference space
            this.xrReferenceSpace = await session.requestReferenceSpace('local-floor');

            // Setup controllers
            this.setupControllers();

            console.log('✅ VR session started');
            return true;
        } catch (error) {
            console.error('❌ Failed to start VR session:', error);
            throw error;
        }
    }

    /**
     * End VR session
     */
    endVRSession() {
        if (this.xrSession) {
            this.xrSession.end();
            this.xrSession = null;
            this.isSessionActive = false;
            console.log('✅ VR session ended');
        }
    }

    /**
     * Setup session event listeners
     */
    setupSessionEventListeners() {
        this.xrSession.addEventListener('end', () => {
            this.isSessionActive = false;
            this.xrSession = null;
        });
    }

    /**
     * Setup VR controllers
     */
    setupControllers() {
        const controller1 = this.renderer.xr.getController(0);
        const controller2 = this.renderer.xr.getController(1);

        controller1.addEventListener('selectstart', (event) => this.onSelectStart(event, 0));
        controller1.addEventListener('selectend', (event) => this.onSelectEnd(event, 0));
        controller2.addEventListener('selectstart', (event) => this.onSelectStart(event, 1));
        controller2.addEventListener('selectend', (event) => this.onSelectEnd(event, 1));

        this.scene.add(controller1);
        this.scene.add(controller2);

        this.controllers = [controller1, controller2];
    }

    /**
     * Create 3D learning object
     */
    createLearningObject(type, options = {}) {
        let geometry, material, mesh;

        switch (type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                mesh = new THREE.Mesh(geometry, material);
                break;

            case 'sphere':
                geometry = new THREE.SphereGeometry(0.5, 32, 32);
                material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
                mesh = new THREE.Mesh(geometry, material);
                break;

            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
                mesh = new THREE.Mesh(geometry, material);
                break;

            case 'molecule':
                mesh = this.createMolecule(options.atoms || []);
                break;

            case 'solar-system':
                mesh = this.createSolarSystem();
                break;

            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = new THREE.MeshLambertMaterial({ color: 0xffffff });
                mesh = new THREE.Mesh(geometry, material);
        }

        // Add interaction
        mesh.userData = { type: type, interactive: true };
        mesh.position.set(
            options.x || 0,
            options.y || 0,
            options.z || -2
        );

        this.scene.add(mesh);
        return mesh;
    }

    /**
     * Create molecule structure
     */
    createMolecule(atoms) {
        const group = new THREE.Group();

        atoms.forEach((atom, index) => {
            const geometry = new THREE.SphereGeometry(atom.radius || 0.2, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: atom.color || 0xffffff });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.set(atom.x || 0, atom.y || 0, atom.z || 0);
            sphere.userData = { type: 'atom', element: atom.element };
            
            group.add(sphere);
        });

        return group;
    }

    /**
     * Create solar system
     */
    createSolarSystem() {
        const group = new THREE.Group();

        // Sun
        const sunGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const sunMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData = { type: 'planet', name: 'Sun' };
        group.add(sun);

        // Planets
        const planets = [
            { name: 'Mercury', color: 0x8c7853, distance: 0.5, size: 0.05 },
            { name: 'Venus', color: 0xffc649, distance: 0.7, size: 0.08 },
            { name: 'Earth', color: 0x6b93d6, distance: 1.0, size: 0.1 },
            { name: 'Mars', color: 0xc1440e, distance: 1.5, size: 0.08 },
            { name: 'Jupiter', color: 0xd8ca9d, distance: 2.0, size: 0.2 },
            { name: 'Saturn', color: 0xfad5a5, distance: 2.5, size: 0.18 },
            { name: 'Uranus', color: 0x4fd0e7, distance: 3.0, size: 0.12 },
            { name: 'Neptune', color: 0x4b70dd, distance: 3.5, size: 0.12 }
        ];

        planets.forEach((planet, index) => {
            const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: planet.color });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.x = planet.distance;
            sphere.userData = { type: 'planet', name: planet.name };
            
            group.add(sphere);
        });

        return group;
    }

    /**
     * Create virtual lab environment
     */
    createVirtualLab() {
        // Lab table
        const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -0.5;
        this.scene.add(table);

        // Lab equipment
        this.createLabEquipment();

        // Lighting
        this.setupLabLighting();
    }

    /**
     * Create lab equipment
     */
    createLabEquipment() {
        // Microscope
        const microscope = this.createMicroscope();
        microscope.position.set(-0.5, 0, 0);
        this.scene.add(microscope);

        // Test tubes
        for (let i = 0; i < 5; i++) {
            const testTube = this.createTestTube();
            testTube.position.set(0.2 + i * 0.2, 0, 0.3);
            this.scene.add(testTube);
        }

        // Bunsen burner
        const burner = this.createBunsenBurner();
        burner.position.set(0.8, 0, -0.3);
        this.scene.add(burner);
    }

    /**
     * Create microscope
     */
    createMicroscope() {
        const group = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);

        // Arm
        const armGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const arm = new THREE.Mesh(armGeometry, baseMaterial);
        arm.position.y = 0.4;
        group.add(arm);

        // Eyepiece
        const eyepieceGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32);
        const eyepieceMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const eyepiece = new THREE.Mesh(eyepieceGeometry, eyepieceMaterial);
        eyepiece.position.set(0.2, 0.6, 0);
        group.add(eyepiece);

        return group;
    }

    /**
     * Create test tube
     */
    createTestTube() {
        const group = new THREE.Group();

        // Tube
        const tubeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 32);
        const tubeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.8 
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        group.add(tube);

        // Liquid
        const liquidGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.2, 32);
        const liquidMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() * 0xffffff 
        });
        const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquid.position.y = 0.05;
        group.add(liquid);

        return group;
    }

    /**
     * Create Bunsen burner
     */
    createBunsenBurner() {
        const group = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);

        // Flame
        const flameGeometry = new THREE.ConeGeometry(0.05, 0.3, 8);
        const flameMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6600, 
            transparent: true, 
            opacity: 0.8 
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 0.25;
        group.add(flame);

        return group;
    }

    /**
     * Setup lab lighting
     */
    setupLabLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Point light for lab
        const pointLight = new THREE.PointLight(0xffffff, 1, 10);
        pointLight.position.set(0, 2, 0);
        this.scene.add(pointLight);
    }

    /**
     * Handle controller select start
     */
    onSelectStart(event, controllerIndex) {
        const controller = this.controllers[controllerIndex];
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(controller.matrixWorld);

        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const intersected = intersects[0].object;
            this.intersected[controllerIndex] = intersected;

            if (intersected.userData.interactive) {
                this.handleObjectInteraction(intersected, 'select');
            }
        }
    }

    /**
     * Handle controller select end
     */
    onSelectEnd(event, controllerIndex) {
        if (this.intersected[controllerIndex]) {
            this.handleObjectInteraction(this.intersected[controllerIndex], 'deselect');
            this.intersected[controllerIndex] = null;
        }
    }

    /**
     * Handle object interaction
     */
    handleObjectInteraction(object, action) {
        switch (object.userData.type) {
            case 'atom':
                this.handleAtomInteraction(object, action);
                break;
            case 'planet':
                this.handlePlanetInteraction(object, action);
                break;
            case 'molecule':
                this.handleMoleculeInteraction(object, action);
                break;
            default:
                this.handleGenericInteraction(object, action);
        }
    }

    /**
     * Handle atom interaction
     */
    handleAtomInteraction(atom, action) {
        if (action === 'select') {
            // Highlight atom
            atom.material.emissive.setHex(0x444444);
            
            // Show atom info
            this.showAtomInfo(atom.userData.element);
        } else {
            // Remove highlight
            atom.material.emissive.setHex(0x000000);
        }
    }

    /**
     * Handle planet interaction
     */
    handlePlanetInteraction(planet, action) {
        if (action === 'select') {
            // Highlight planet
            planet.material.emissive.setHex(0x222222);
            
            // Show planet info
            this.showPlanetInfo(planet.userData.name);
        } else {
            // Remove highlight
            planet.material.emissive.setHex(0x000000);
        }
    }

    /**
     * Handle molecule interaction
     */
    handleMoleculeInteraction(molecule, action) {
        if (action === 'select') {
            // Rotate molecule
            molecule.rotation.y += 0.1;
        }
    }

    /**
     * Handle generic interaction
     */
    handleGenericInteraction(object, action) {
        if (action === 'select') {
            // Scale up
            object.scale.multiplyScalar(1.1);
        } else {
            // Scale down
            object.scale.multiplyScalar(1 / 1.1);
        }
    }

    /**
     * Show atom information
     */
    showAtomInfo(element) {
        console.log(`Selected atom: ${element}`);
        // Implement UI to show atom information
    }

    /**
     * Show planet information
     */
    showPlanetInfo(name) {
        console.log(`Selected planet: ${name}`);
        // Implement UI to show planet information
    }

    /**
     * Render loop
     */
    render() {
        if (this.isSessionActive) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Handle VR display present change
     */
    onVRDisplayPresentChange() {
        // Handle VR display changes
    }

    /**
     * Get WebXR capabilities
     */
    getWebXRCapabilities() {
        return {
            isSupported: this.isSupported,
            isSessionActive: this.isSessionActive,
            hasControllers: this.controllers.length > 0,
            hasHandTracking: false // Would need to check for hand tracking support
        };
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.xrSession) {
            this.endVRSession();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Export for use in other modules
window.WebXRManager = WebXRManager;

