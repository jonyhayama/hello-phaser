import Phaser from 'phaser'

export default class ItemSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, itemKey = 'item') {
    this.scene = scene
    this.key = itemKey

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  spawn(playerX = 0) {
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