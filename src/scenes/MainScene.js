import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import ItemSpawner from './ItemSpawner'
import PlayerController from '../controllers/Player/PlayerController'
import CupcakeController from '../controllers/CupcakeController'

const KEYS = {
  GROUND: 'ground',
  BOMB: 'bomb',
  STAR: 'star'
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('main-scene')

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.cupcakes = undefined
    this.bombSpawner = undefined;
    this.starSpawner = undefined;
    this.currentScore = 0;
    this.hiScore = Math.max( JSON.parse( localStorage.getItem('@helloPhaser/MainScene/hiScore') ), 0 );
    this.superStar = 10;
    this.superStarInterval = null;
    this.playerPlatformCollider = undefined;
    this.playerBombsCollider = undefined;
    this.playerCupcakesOverlap = undefined;
    this.platforms = undefined;
    
    this.gameOver = false;
  }

  preload() {
    this.load.spritesheet(KEYS.BOMB, 'assets/img/bomb-sprite.png', {
      frameWidth: 41,
      frameHeight: 41
    });
    this.load.image(KEYS.GROUND, 'assets/img/platform.png');
    this.load.image('sky', 'assets/img/sky.png');
    CupcakeController.preloadAssets(this);
    this.load.image(KEYS.STAR, 'assets/img/star.png');

    this.load.image("energycontainer", "assets/img/energycontainer.png");
    this.load.image("energybar", "assets/img/energybar.png");
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.createPlatforms();
    this.createPlayer();
    this.createCupcakes();
    this.createLabels();
    this.createBombs();
    this.createStars();
    this.createColliders();
    this.createPowerGauge();
    this.createConrollers();
  }

  update() {
    if( this.gameOver ){
      return;
    }

    this.player.update();
  }

  createConrollers(){
    this.input.keyboard.on('keyup-' + 'ESC', (event) => { 
      this.gameOver = false;
      this.setScore(0);
      this.scene.restart();
      this.scene.start('preload-scene');
    } );

    this.input.keyboard.on('keyup-' + 'SPACE', (event) => { 
      if( this.gameOver ){
        this.gameOver = false;
        this.gamerOverLabel.setVisible(false);
        this.setScore(0);
        this.scene.restart();
      }
    } );
  }

  createLabels(){
    this.scoreLabel = this.createScoreLabel(16, 16, this.currentScore);
    this.hiScoreLabel = this.createHiScoreLabel(16, 46, this.hiScore);
    this.gamerOverLabel = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gamerOverLabel.setOrigin(0.5);
    this.gamerOverLabel.setVisible(false);
  }

  createColliders(){
    this.playerPlatformCollider = this.physics.add.collider(this.player.sprite, this.platforms);
    this.playerBombsCollider = this.physics.add.collider(this.player.sprite, this.bombSpawner.group, this.hitBomb, null, this);
    this.playerStarsCollider = this.physics.add.collider(this.player.sprite, this.starSpawner.group, this.collectStar, null, this);
    this.BombsBombsCollider = this.physics.add.collider(this.bombSpawner.group, this.bombSpawner.group, null, null, this);
    this.StarsStarsCollider = this.physics.add.collider(this.starSpawner.group, this.starSpawner.group, null, null, this);
    this.BombsStarsCollider = this.physics.add.collider(this.bombSpawner.group, this.starSpawner.group, null, null, this);
    this.physics.add.collider(this.cupcakes.group, this.platforms);
    this.physics.add.collider(this.bombSpawner.group, this.platforms);
    this.physics.add.collider(this.starSpawner.group, this.platforms);

    this.playerCupcakesOverlap = this.physics.add.overlap(this.player.sprite, this.cupcakes.group, this.collectCupcake, null, this);
  }

  createStars(){
    this.starSpawner = new ItemSpawner(this, KEYS.STAR, 0.9);
  }

  createBombs(){
    this.bombSpawner = new ItemSpawner(this, KEYS.BOMB);

    this.anims.create({
			key: 'bomb-alt',
			frames: this.anims.generateFrameNumbers(KEYS.BOMB, { start: 1, end: 1 }),
			frameRate: 10,
			repeat: -1
		})

    this.anims.create({
			key: 'bomb',
			frames: this.anims.generateFrameNumbers(KEYS.BOMB, { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		})
  }

  createPlatforms(){
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, KEYS.GROUND).setScale(2).refreshBody();
    
    this.platforms.create(600, 400, KEYS.GROUND);
    this.platforms.create(50, 250, KEYS.GROUND);
    this.platforms.create(750, 220, KEYS.GROUND);
  }

  createPlayer(){
    const selectedPlayer = PlayerController.availableCharacters[this.scene.get('preload-scene').selected - 1];
    
    this.player = new PlayerController( 100, 450, this, selectedPlayer.key );
    this.player.createControllers();
    this.player.createAnims();
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

  createCupcakes(){
    this.cupcakes = new CupcakeController(this);

    this.cupcakes.createParticles();
  }

  createPowerGauge() {
    this.energyContainer = this.add.sprite(160, 575, "energycontainer");

    let energyBar = this.add.sprite(this.energyContainer.x + 23, this.energyContainer.y, "energybar");

    this.energyMask = this.add.sprite(energyBar.x, energyBar.y, "energybar");
    this.energyMask.x = -this.energyMask.displayWidth;
    this.energyMask.visible = false;

    energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.energyMask);
  }

  collectStar(player, star){
    star.destroy();

    if( this.player.tween.isPlaying() ){
      return;
    }

    this.bombSpawner.group.children.iterate((child) => {
      child.anims.play('bomb-alt')
    });

    this.superStar = 10;
    this.energyMask.x = this.energyContainer.x + 23;
    
    this.player.tween.play();
    this.superStarInterval = setInterval(() => {
      if( this.superStar > 0 ){
        let stepLengh = this.energyMask.displayWidth / 10;
        this.superStar -= 1;
        this.energyMask.x -= stepLengh;
        return;
      }

      this.superStar = 0;
      this.player.tween.stop();
      clearInterval(this.superStarInterval);
    }, 1000);
    
  }

  collectCupcake(player, cupcake){
    this.cupcakes.collect(cupcake);
    
    this.addScore(10);

    this.bombSpawner.spawn(player.x)

    this.starSpawner.spawn(player.x)
  }

  hitBomb(player, bomb){
    if( this.player.tween.isPlaying() || bomb.anims.getName() == 'bomb-alt' ){
      bomb.destroy();
      this.addScore(20);
      return;
    }

    const die_key = this.player.keys.die;
    player.anims.play(die_key);
    player.on('animationcomplete', function(evt){
      if( evt.key == die_key ){
        this.disableBody(true, true);
      }
    })
    player.body.stop();
    player.body.allowGravity = false;
    bomb.body.stop();
    bomb.body.allowGravity = false;
    this.playerPlatformCollider.destroy();
    this.playerBombsCollider.destroy();
    this.playerCupcakesOverlap.destroy();
    this.player.sprite.setCollideWorldBounds(false);
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
    localStorage.setItem('@helloPhaser/MainScene/hiScore', JSON.stringify(this.hiScore));
    this.hiScoreLabel.setScore(this.hiScore);
  }
}
