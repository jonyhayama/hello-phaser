export default class PlayerController {
  /**
   * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player
   * @param {Phaser.Scene} scene
   * @param {string} key
   */
  constructor(player, scene, key) {
    this.key = key;
    this.player = player;
    this.player.setCircle(13, 2, 5);
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)

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

    this.playerTween = this.scene.tweens.addCounter({
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
  }

  update(){
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
}
