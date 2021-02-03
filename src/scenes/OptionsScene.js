import Phaser from 'phaser'

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('options-scene')
  }

  preload() {
    this.load.image('sky', 'assets/img/sky.png');
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.mainMessageLabel = this.add.text(400, 300, 'No options yet, come back later 😜', { fontSize: '32px', fill: '#000', testString: '😜', fontStyle: 'bold' });
    this.mainMessageLabel.setOrigin(0.5);

    this.input.keyboard.on('keyup-' + 'ESC', (event) => { 
      this.scene.start('preload-scene');
    } );
  }
}