import ItemSpawner from '../scenes/ItemSpawner'

export default class BombController {
  static key = 'bomb';
  
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.spawner = new ItemSpawner(this.scene, BombController.key);
    this.createAnims();
  }

  /**
   * @param {Phaser.Scene} scene
   */
  static preloadAssets(scene){
    scene.load.spritesheet(BombController.key, 'assets/img/bomb-sprite.png', {
      frameWidth: 41,
      frameHeight: 41
    });
  }

  createAnims(){
    this.scene.anims.create({
			key: 'bomb-alt',
			frames: this.scene.anims.generateFrameNumbers(BombController.key, { start: 1, end: 1 }),
			frameRate: 10,
			repeat: -1
		})

    this.scene.anims.create({
			key: 'bomb',
			frames: this.scene.anims.generateFrameNumbers(BombController.key, { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		})
  }

  turnIntoCandy(){
    this.spawner.group.children.iterate((child) => {
      child.anims.play('bomb-alt')
    });
  }

  isCandy(bomb){
    return bomb.anims.getName() === 'bomb-alt'
  }
}