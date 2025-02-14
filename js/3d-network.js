import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class NetworkAnimation {
    constructor() {
        this.container = document.querySelector('.hero');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.nodes = [];
        this.lines = [];
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.insertBefore(this.renderer.domElement, this.container.firstChild);
        
        // Camera position
        this.camera.position.z = 30;
        
        // Create nodes
        const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.8
        });
        
        // Create network of nodes
        for(let i = 0; i < 50; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.x = (Math.random() - 0.5) * 40;
            node.position.y = (Math.random() - 0.5) * 40;
            node.position.z = (Math.random() - 0.5) * 40;
            node.userData = {
                originalPosition: node.position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                )
            };
            this.nodes.push(node);
            this.scene.add(node);
        }
        
        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.2
        });
        
        for(let i = 0; i < this.nodes.length; i++) {
            for(let j = i + 1; j < this.nodes.length; j++) {
                if(this.nodes[i].position.distanceTo(this.nodes[j].position) < 15) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.nodes[i].position,
                        this.nodes[j].position
                    ]);
                    const line = new THREE.Line(geometry, lineMaterial);
                    this.lines.push({
                        line: line,
                        pointA: this.nodes[i],
                        pointB: this.nodes[j]
                    });
                    this.scene.add(line);
                }
            }
        }
        
        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        this.animate();
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Animate nodes
        this.nodes.forEach(node => {
            node.position.add(node.userData.velocity);
            
            // Mouse interaction
            const mouseInfluence = new THREE.Vector3(
                this.mouse.x * 20,
                this.mouse.y * 20,
                0
            );
            
            const distance = mouseInfluence.distanceTo(node.position);
            if(distance < 10) {
                const repulsion = node.position.clone().sub(mouseInfluence).normalize();
                node.position.add(repulsion.multiplyScalar(0.1));
            }
            
            // Return to original position
            const originalPosition = node.userData.originalPosition;
            node.position.lerp(originalPosition, 0.02);
        });
        
        // Update connections
        this.lines.forEach(({line, pointA, pointB}) => {
            const positions = new Float32Array([
                pointA.position.x, pointA.position.y, pointA.position.z,
                pointB.position.x, pointB.position.y, pointB.position.z
            ]);
            line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            line.geometry.attributes.position.needsUpdate = true;
        });
        
        // Rotate entire scene
        this.scene.rotation.y += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }
} 