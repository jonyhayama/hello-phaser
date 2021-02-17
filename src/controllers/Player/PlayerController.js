export default class PlayerController {
  /**
   * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} sprite
   * @param {Phaser.Scene} scene
   * @param {string} key
   */
  constructor(sprite, scene, key) {
    this.key = key;
    this.sprite = sprite;
    this.sprite.setCircle(13, 2, 5);
		this.sprite.setBounce(0.2)
		this.sprite.setCollideWorldBounds(true)

    this.scene = scene;
    this.createControllers();
    this.createAnims();
  }

  createControllers(){
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  createAnims(){
    this.scene.anims.remove('run');
		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNumbers(this.key, { start: 8, end: 13 }),
			frameRate: 10,
			repeat: -1
		})

    this.scene.anims.remove('idle');
		this.scene.anims.create({
			key: 'idle',
			frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
		})
    
    this.scene.anims.remove('jump');
		this.scene.anims.create({
			key: 'jump',
			frames: this.scene.anims.generateFrameNumbers(this.key, { start: 16, end: 19 }),
      frameRate: 20,
    })
    
    this.scene.anims.remove('fall');
		this.scene.anims.create({
			key: 'fall',
			frames: this.scene.anims.generateFrameNumbers(this.key, { start: 20, end: 23 }),
      frameRate: 20,
		})
    
    this.scene.anims.remove('die');
		this.scene.anims.create({
			key: 'die',
			frames: this.scene.anims.generateFrameNumbers(this.key, { start: 24, end: 31 }),
      frameRate: 10,
		})

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

  update(){
    if( !this.sprite.body.touching.down ) {
      if( this.sprite.body.velocity.y < 0 ){
        this.sprite.anims.play('jump', true);
      } else {
        this.sprite.anims.play('fall', true);
      }
    } else {
      if(this.cursors.up.isDown || this.cursors.space.isDown){
        this.sprite.anims.play('idle', true);
        this.sprite.setVelocityY(-330);
      }

      if( this.cursors.left.isDown ){
        this.sprite.anims.play('run', true);
      } else if ( this.cursors.right.isDown ){
        this.sprite.anims.play('run', true);
      } else {
        this.sprite.anims.play('idle', true);
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
