import Phaser from 'phaser'

export default class StarSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, starKey = 'star') {
    this.scene = scene
    this.key = starKey

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  spawn(playerX = 0) {
    const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    const star = this.group.create(x, 16, this.key)
    star.setCircle(11, 0, 0);
    star.setBounce(1)
    star.setCollideWorldBounds(true)
    star.setVelocity(Phaser.Math.Between(-200, 200), 20)
    star.setAngularVelocity(50);
    star.setMaxVelocity(500);

    return star
  }
}