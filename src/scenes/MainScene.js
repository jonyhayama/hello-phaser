import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from './BombSpawner'

const KEYS = {
  GROUND: 'ground',
  DUDE: 'dude',
  STAR: 'star',
  BOMB: 'bomb'
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('main-scene')

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.stars = undefined
    this.bombSpawner = undefined;
    this.currentScore = 0;
    this.hiScore = 0;
    this.playerPlatformCollider = undefined;
    this.playerBombsCollider = undefined;
    this.playerStarsOverlap = undefined;
    
    this.gameOver = false;
  }

  preload() {
    this.load.image(KEYS.BOMB, 'assets/img/bomb.png');
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
    this.stars = this.createStars();

    this.scoreLabel = this.createScoreLabel(16, 16, this.currentScore);
    this.hiScoreLabel = this.createHiScoreLabel(16, 46, this.hiScore);
    this.gamerOverLabel = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gamerOverLabel.setOrigin(0.5);
    this.gamerOverLabel.setVisible(false);

    this.bombSpawner = new BombSpawner(this, KEYS.BOMB);
    const bombGroup = this.bombSpawner.group;

    this.playerPlatformCollider = this.physics.add.collider(this.player, platforms);
    this.playerBombsCollider = this.physics.add.collider(this.player, bombGroup, this.hitBomb, null, this);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombGroup, platforms);

    this.playerStarsOverlap = this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if( this.gameOver ){
      if( this.cursors.space.isDown ){
        this.gameOver = false;
        this.gamerOverLabel.setVisible(false);
        this.setScore(0);
        this.scene.restart();
      }
      return;
    }
    
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
    
    if( this.player.body.touching.down && (this.cursors.up.isDown || this.cursors.space.isDown) ){
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
    const label = new ScoreLabel( this, x, y, score, style, 'Score: #{score}' );

    this.add.existing(label);

    return label;
  }

  createHiScoreLabel( x, y, score ){
    const style = { fontSize: '32px', fill: '#000' }
    const hiLabel = new ScoreLabel( this, x, y, score, style, 'Hi: #{score}' );

    this.add.existing(hiLabel);

    return hiLabel;
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
    this.addScore(10);

    if( this.stars.countActive(true) === 0 ){
      //  A new batch of stars to collect
			this.stars.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			});
    }

    this.bombSpawner.spawn(player.x)
  }

  hitBomb(player, star){
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.playerPlatformCollider.destroy();
    this.playerBombsCollider.destroy();
    this.playerStarsOverlap.destroy();
    this.player.setVelocityY(100);
    this.player.setVelocityX(0);
    this.player.setCollideWorldBounds(false);
    this.gameOver = true;
    this.gamerOverLabel.setVisible(true);
  }

  addScore(score){
    score += this.currentScore;
    this.setScore(score);
  }

  setScore(score){
    this.currentScore = score;
    this.scoreLabel.setScore(this.currentScore);

    this.hiScore = Math.max(this.currentScore, this.hiScore);
    this.hiScoreLabel.setScore(this.hiScore);
  }
}
