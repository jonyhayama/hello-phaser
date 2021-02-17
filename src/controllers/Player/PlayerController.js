export default class PlayerController {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Phaser.Scene} scene
   * @param {string} key
   */
  constructor(x, y, scene, key) {
    this.keys = {
      sprite: key,
      idle: `${key}-idle`,
      run: `${key}-run`,
      jump: `${key}-jump`,
      fall: `${key}-fall`,
      die: `${key}-die`,
    }

    this.sprite = scene.physics.add.sprite(x, y, this.keys.sprite);
    this.sprite.setCircle(13, 2, 5);
		this.sprite.setBounce(0.2)
		this.sprite.setCollideWorldBounds(true)

    this.scene = scene;
  }

  /**
   * @param {Phaser.Scene} scene
   */
  static loadSpritesheets(scene){
    scene.load.spritesheet('dude', 'assets/img/pink-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    scene.load.spritesheet('dude2', 'assets/img/owlet-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    scene.load.spritesheet('dude3', 'assets/img/dude-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  createControllers(){
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  createAnims(only = []){
    only = (only.length === 0) ? ['run', 'idle', 'jump', 'fall', 'die', 'superstar'] : only;

    if( only.includes('run') ){
      this.scene.anims.remove(this.keys.run);
      this.scene.anims.create({
        key: this.keys.run,
        frames: this.scene.anims.generateFrameNumbers(this.keys.sprite, { start: 8, end: 13 }),
        frameRate: 10,
        repeat: -1
      })
    }

    if( only.includes('idle') ){
      this.scene.anims.remove(this.keys.idle);
      this.scene.anims.create({
        key: this.keys.idle,
        frames: this.scene.anims.generateFrameNumbers(this.keys.sprite, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      })
    }
    
    if( only.includes('jump') ){
      this.scene.anims.remove(this.keys.jump);
      this.scene.anims.create({
        key: this.keys.jump,
        frames: this.scene.anims.generateFrameNumbers(this.keys.sprite, { start: 16, end: 19 }),
        frameRate: 20,
      })
    }
    
    if( only.includes('fall') ){
      this.scene.anims.remove(this.keys.fall);
      this.scene.anims.create({
        key: this.keys.fall,
        frames: this.scene.anims.generateFrameNumbers(this.keys.sprite, { start: 20, end: 23 }),
        frameRate: 20,
      })
    }
    
    if( only.includes('die') ){
      this.scene.anims.remove(this.keys.die);
      this.scene.anims.create({
        key: this.keys.die,
        frames: this.scene.anims.generateFrameNumbers(this.keys.sprite, { start: 24, end: 31 }),
        frameRate: 10,
      })
    }

    if( only.includes('superstar') ){
      this.tween = this.scene.tweens.addCounter({
        from: 50,
        to: 205,
        duration: 150,
        yoyo: true,
        repeat: -1,
        onUpdate: (tween) =>
        {
          const value = Math.floor(tween.getValue());
          this.sprite.setTint(Phaser.Display.Color.GetColor(255, 255, value));
        },
        onStop: (tween) => {
          this.sprite.clearTint();
        }
      });

      this.tween.stop();
    }
  }

  update(){
    if( !this.sprite.body.touching.down ) {
      if( this.sprite.body.velocity.y < 0 ){
        this.sprite.anims.play(this.keys.jump, true);
      } else {
        this.sprite.anims.play(this.keys.fall, true);
      }
    } else {
      if(this.cursors.up.isDown || this.cursors.space.isDown){
        this.sprite.anims.play(this.keys.idle, true);
        this.sprite.setVelocityY(-330);
      }

      if( this.cursors.left.isDown ){
        this.sprite.anims.play(this.keys.run, true);
      } else if ( this.cursors.right.isDown ){
        this.sprite.anims.play(this.keys.run, true);
      } else {
        this.sprite.anims.play(this.keys.idle, true);
      }
    }

    if( this.cursors.left.isDown ){
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-160);
    } else if ( this.cursors.right.isDown ){
      this.sprite.flipX = false;
      this.sprite.setVelocityX(160);
    } else {
      this.sprite.setVelocityX(0);
    }
  }
}
