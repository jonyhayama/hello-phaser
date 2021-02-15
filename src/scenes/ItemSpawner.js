import Phaser from 'phaser'

export default class ItemSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, itemKey = 'item', spawnRate = 1) {
    this.scene = scene
    this.key = itemKey
    this.spawnRate = spawnRate * 100

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  shouldSpawn(){
    const getRandomInt = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    return getRandomInt(this.spawnRate, 100) === 100;
  }

  spawn(playerX = 0) {
    if( !this.shouldSpawn() ){
      return false;
    }
    
    const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    const item = this.group.create(x, 16, this.key)
    item.setCircle(11, 9, 9);
    item.setBounce(1)
    item.setCollideWorldBounds(true)
    item.setVelocity(Phaser.Math.Between(-200, 200), 20)
    item.setAngularVelocity(50);
    item.setMaxVelocity(500);

    return item
  }
}