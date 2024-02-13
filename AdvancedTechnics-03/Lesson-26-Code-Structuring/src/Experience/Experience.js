import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";

let instance = null // Singleton

export default class Experience
{
    constructor(canvas)
    {
        if (instance) // Singleton
        {
            return instance // Singleton
        }
        instance = this // Singleton

        // Global access
        window.experience = this

        // Options
        this.canvas = canvas
        // console.log(this.canvas);

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()

        // Sizes resize event
        this.sizes.on('resize', () => 
        {
            this.resize() // on appelle la fonction resize, plus bas
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
    }
}