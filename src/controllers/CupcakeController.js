export default class CupcakeController {
  static key = 'cupcake';

  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    console.log(CupcakeController.key);
    this.group = this.scene.physics.add.group({
      key: CupcakeController.key,
      repeat: 11,
      setXY: {
        x: 12, 
        y: 0,
        stepX: 70
      }
    });

    this.group.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setCircle(11, 2, 4);
    });
  }

  /**
   * @param {Phaser.Scene} scene
   */
  static preloadAssets(scene){
    scene.load.image(this.key, 'assets/img/cupcake.png');
  }

  createParticles(){
    this.particles = this.scene.add.particles(CupcakeController.key);
    this.emitter = this.particles.createEmitter({
      speed: 200,
      lifespan: 500,
      blendMode: 'ADD',
      scale: { start: 1, end: 0 },
      on: false
    })
  }

  collect( cupcake ){
    cupcake.disableBody(true, true);
    this.particles.emitParticleAt(cupcake.x, cupcake.y, 50);
    
    if( this.group.countActive(true) === 0 ){
      //  A new batch of cupcakes to collect
			this.group.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			});
    }
  }
}