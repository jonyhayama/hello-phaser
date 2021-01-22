import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'

const KEYS = {
  GROUND: 'ground',
  DUDE: 'dude',
  STAR: 'star'
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('main-scene')

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
  }

  preload() {
    this.load.image('bomb', 'assets/img/bomb.png');
    this.load.image(KEYS.GROUND, 'assets/img/platform.png');
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image(KEYS.STAR, 'assets/img/star.png');
    
    this.load.spritesheet(KEYS.DUDE, 'assets/img/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.add.image(400, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const stars = this.createStars();

    this.scoreLabel = this.createScoreLabel(16, 16, 8);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(this.player, stars, this.collectStar, null, this)

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

  createScoreLabel( x, y, score ){
    const style = { fontSize: '32px', fill: '#000' }
    const label = new ScoreLabel( this, x, y, score, style );

    this.add.existing(label);

    return label;
  }

  createStars(){
    const stars = this.physics.add.group({
      key: KEYS.STAR,
      repeat: 11,
      setXY: {
        x: 12, 
        y: 0,
        stepX: 70
      }
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  collectStar(player, star){
    star.disableBody(true, true);
    this.scoreLabel.add(10);
  }
}
