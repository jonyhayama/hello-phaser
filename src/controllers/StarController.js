import ItemSpawner from '../scenes/ItemSpawner'

export default class StarController {
  static key = 'star';
  
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.spawner = new ItemSpawner(this.scene, StarController.key, 0.95);
  }
}