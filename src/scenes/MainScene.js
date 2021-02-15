import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import ItemSpawner from './ItemSpawner'

const KEYS = {
  GROUND: 'ground',
  DUDE: 'dude',
  CUPCAKE: 'cupcake',
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
    
    this.gameOver = false;
  }

  preload() {
    this.load.spritesheet(KEYS.BOMB, 'assets/img/bomb-sprite.png', {
      frameWidth: 41,
      frameHeight: 41
    });
    this.load.image(KEYS.GROUND, 'assets/img/platform.png');
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image(KEYS.CUPCAKE, 'assets/img/cupcake.png');
    this.load.image(KEYS.STAR, 'assets/img/star.png');

    this.load.image("energycontainer", "assets/img/energycontainer.png");
    this.load.image("energybar", "assets/img/energybar.png");
  }

  create() {
    switch( this.scene.get('preload-scene').selected ){
      case 1:
        KEYS.DUDE = 'dude'
        break;
      case 2:
        KEYS.DUDE = 'dude2'
        break;
      case 3:
        KEYS.DUDE = 'dude3'
        break;
    }
    
    this.add.image(400, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.cupcakes = this.createCupcakes();

    this.scoreLabel = this.createScoreLabel(16, 16, this.currentScore);
    this.hiScoreLabel = this.createHiScoreLabel(16, 46, this.hiScore);
    this.gamerOverLabel = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gamerOverLabel.setOrigin(0.5);
    this.gamerOverLabel.setVisible(false);
    
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

    this.starSpawner = new ItemSpawner(this, KEYS.STAR, 0.9);

    this.playerPlatformCollider = this.physics.add.collider(this.player, platforms);
    this.playerBombsCollider = this.physics.add.collider(this.player, this.bombSpawner.group, this.hitBomb, null, this);
    this.playerStarsCollider = this.physics.add.collider(this.player, this.starSpawner.group, this.collectStar, null, this);
    this.BombsBombsCollider = this.physics.add.collider(this.bombSpawner.group, this.bombSpawner.group, null, null, this);
    this.StarsStarsCollider = this.physics.add.collider(this.starSpawner.group, this.starSpawner.group, null, null, this);
    this.BombsStarsCollider = this.physics.add.collider(this.bombSpawner.group, this.starSpawner.group, null, null, this);
    this.physics.add.collider(this.cupcakes, platforms);
    this.physics.add.collider(this.bombSpawner.group, platforms);
    this.physics.add.collider(this.starSpawner.group, platforms);

    this.playerTween = this.tweens.addCounter({
      from: 50,
      to: 205,
      duration: 150,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) =>
      {
        const value = Math.floor(tween.getValue());
        this.player.setTint(Phaser.Display.Color.GetColor(255, 255, value));
      },
      onStop: (tween) => {
        this.player.clearTint();
      }
    });

    this.playerTween.stop();

    this.playerCupcakesOverlap = this.physics.add.overlap(this.player, this.cupcakes, this.collectCupcake, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createParticles();

    this.input.keyboard.on('keyup-' + 'ESC', (event) => { 
      this.gameOver = false;
      this.setScore(0);
      this.scene.restart();
      this.scene.start('preload-scene');
    } );

    this.createPowerGauge();
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

    if( !this.player.body.touching.down ) {
      if( this.player.body.velocity.y < 0 ){
        this.player.anims.play('jump', true);
      } else {
        this.player.anims.play('fall', true);
      }
    } else {
      if(this.cursors.up.isDown || this.cursors.space.isDown){
        this.player.anims.play('idle', true);
        this.player.setVelocityY(-330);
      }

      if( this.cursors.left.isDown ){
        this.player.anims.play('run', true);
      } else if ( this.cursors.right.isDown ){
        this.player.anims.play('run', true);
      } else {
        this.player.anims.play('idle', true);
      }
    }

    if( this.cursors.left.isDown ){
      this.player.flipX = true;
      this.player.setVelocityX(-160);
    } else if ( this.cursors.right.isDown ){
      this.player.flipX = false;
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
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
    player.setCircle(13, 2, 5);
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

    this.anims.remove('run');
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 8, end: 13 }),
			frameRate: 10,
			repeat: -1
		})

    this.anims.remove('idle');
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
		})
    
    this.anims.remove('jump');
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 16, end: 19 }),
      frameRate: 20,
    })
    
    this.anims.remove('fall');
		this.anims.create({
			key: 'fall',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 20, end: 23 }),
      frameRate: 20,
		})
    
    this.anims.remove('die');
		this.anims.create({
			key: 'die',
			frames: this.anims.generateFrameNumbers(KEYS.DUDE, { start: 24, end: 31 }),
      frameRate: 10,
		})
		
    return player;
  }

  createParticles() {
    this.particles = this.add.particles(KEYS.CUPCAKE);
    this.emitter = this.particles.createEmitter({
      speed: 200,
      lifespan: 500,
      blendMode: 'ADD',
      scale: { start: 1, end: 0 },
      on: false
    })
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

  createSuperStarLabel( x, y, score ){
    const style = { fontSize: '32px', fill: '#000' }
    const superStarLabel = new ScoreLabel( this, x, y, score, style, 'Super Star: #{score}s' );

    this.add.existing(superStarLabel);

    return superStarLabel;
  }

  createCupcakes(){
    const cupcakes = this.physics.add.group({
      key: KEYS.CUPCAKE,
      repeat: 11,
      setXY: {
        x: 12, 
        y: 0,
        stepX: 70
      }
    });

    cupcakes.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setCircle(11, 2, 4);
    });

    return cupcakes;
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

    if( this.playerTween.isPlaying() ){
      return;
    }

    this.bombSpawner.group.children.iterate((child) => {
      child.anims.play('bomb-alt')
    });

    this.superStar = 10;
    this.energyMask.x = this.energyContainer.x + 23;
    
    this.playerTween.play();
    this.superStarInterval = setInterval(() => {
      if( this.superStar > 0 ){
        let stepLengh = this.energyMask.displayWidth / 10;
        this.superStar -= 1;
        this.energyMask.x -= stepLengh;
        return;
      }

      this.superStar = 0;
      this.playerTween.stop();
      clearInterval(this.superStarInterval);
    }, 1000);
    
  }

  collectCupcake(player, cupcake){
    cupcake.disableBody(true, true);
    this.particles.emitParticleAt(cupcake.x, cupcake.y, 50);
    this.addScore(10);

    if( this.cupcakes.countActive(true) === 0 ){
      //  A new batch of cupcakes to collect
			this.cupcakes.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			});
    }

    this.bombSpawner.spawn(player.x)

    this.starSpawner.spawn(player.x)
  }

  hitBomb(player, bomb){
    if( this.playerTween.isPlaying() || bomb.anims.getName() == 'bomb-alt' ){
      bomb.destroy();
      this.addScore(20);
      return;
    }

    player.anims.play('die');
    player.on('animationcomplete', function(evt){
      if( evt.key == 'die' ){
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
    localStorage.setItem('@helloPhaser/MainScene/hiScore', JSON.stringify(this.hiScore));
    this.hiScoreLabel.setScore(this.hiScore);
  }
}
