import Phaser from 'phaser'

const KEYS = {
  GROUND: 'ground',
  DUDE: 'dude'
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('main-scene')

    this.player = undefined;
    this.cursors = undefined;
  }

  preload() {
    this.load.image('bomb', 'assets/img/bomb.png');
    this.load.image(KEYS.GROUND, 'assets/img/platform.png');
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('star', 'assets/img/star.png');
    
    this.load.spritesheet(KEYS.DUDE, 'assets/img/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();

    this.physics.add.collider(this.player, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if( this.cursors.left.isDown ){
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if ( this.cursors.right.isDown ){
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    
    if( this.cursors.up.isDown && this.player.body.touching.down ){
      this.player.setVelocityY(-330);
    }
  }

  createPlatforms(){
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, KEYS.GROUND).setScale(2).refreshBody();
    
    platforms.create(600, 400, KEYS.GROUND);
    platforms.create(50, 250, KEYS.GROUND);
    platforms.create(750, 220, KEYS.GROUND);

    return platforms;
  }

  createPlayer(){
    const player = this.physics.add.sprite(100, 450, KEYS.DUDE)
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: KEYS.DUDE, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
    })
    
    return player;
  }
}
