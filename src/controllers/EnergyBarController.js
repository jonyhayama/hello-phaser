export default class EnergyBarController {
/**
   * @param {Number} x
   * @param {Number} y
   * @param {Phaser.Scene} scene
   */
  constructor(x, y, scene) {
    this.maskOffset = 23;
    this.scene = scene;
    
    this.container = this.scene.add.sprite(160, 575, "energycontainer");
    this.bar = this.scene.add.sprite(this.container.x + this.maskOffset, this.container.y, "energybar");

    this.mask = this.scene.add.sprite(this.bar.x, this.bar.y, "energybar");
    this.mask.x = -this.mask.displayWidth;
    this.mask.visible = false;

    this.bar.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.mask);
  }

  fill(){
    this.mask.x = this.container.x + 23;
  }

  drain(percentage){
    let stepLengh = this.mask.displayWidth / (percentage * 100);
    this.mask.x -= stepLengh;
  }
}