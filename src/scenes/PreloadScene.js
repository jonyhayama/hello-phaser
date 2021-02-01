import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload-scene')
    this.selected = null;
  }

  preload() {
    this.load.image('sky', 'assets/img/sky.png');

    this.load.spritesheet('dude', 'assets/img/pink-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('dude2', 'assets/img/owlet-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('dude3', 'assets/img/dude-monster.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('selector', 'assets/img/player-selector.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.anims.create({
			key: 'selected',
			frames: [ { key: 'selector', frame: 1 } ],
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
			key: 'not-selected',
			frames: [ { key: 'selector', frame: 0 } ],
      frameRate: 10,
      repeat: -1
    })
    
    this.input.keyboard.addCapture('SPACE');
    this.input.keyboard.on('keyup-' + 'SPACE', (event) => { 
      this.scene.start('main-scene', { selectedPlayer: this.selected });
    });

    this.input.keyboard.on('keyup-' + 'RIGHT', (event) => { 
      let playerIdx = Math.min((this.selected + 1), 3);
      this.setSelected(playerIdx);
    });

    this.input.keyboard.on('keyup-' + 'LEFT', (event) => { 
      let playerIdx = Math.max((this.selected - 1), 1);
      this.setSelected(playerIdx);
    });

    this.player = this.physics.add.sprite(128, 128, 'dude')
    this.player.body.allowGravity = false;
    this.anims.create({
			key: 'select-idle',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.player.setScale(2).refreshBody();
    this.player.setDepth(1);

    this.player2 = this.physics.add.sprite(320, 128, 'dude2')
    this.player2.body.allowGravity = false;
    this.anims.create({
			key: 'select-idle2',
			frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.player2.setScale(2).refreshBody();
    this.player2.setDepth(1);

    this.player3 = this.physics.add.sprite(512, 128, 'dude3')
    this.player3.body.allowGravity = false;
    this.anims.create({
			key: 'select-idle3',
			frames: this.anims.generateFrameNumbers('dude3', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.player3.setScale(2).refreshBody();
    this.player3.setDepth(1);

    this.graphics = this.physics.add.sprite(128, 128, 'selector');
    this.graphics.body.allowGravity = false;

    this.graphics2 = this.physics.add.sprite(320, 128, 'selector');
    this.graphics2.body.allowGravity = false;

    this.graphics3 = this.physics.add.sprite(512, 128, 'selector');
    this.graphics3.body.allowGravity = false;

    this.setSelected( 1 );
  }

  setSelected( playerIdx ){
    if( playerIdx == this.selected){
      return;
    }
    this.selected = playerIdx;
    this.player.anims.stop();
    this.graphics.anims.play('not-selected');
    
    this.player2.anims.stop();
    this.graphics2.anims.play('not-selected');
    
    this.player3.anims.stop();
    this.graphics3.anims.play('not-selected');

    switch( this.selected ){
      case 1:
        this.player.anims.play('select-idle');
        this.graphics.anims.play('selected');
        break;
      case 2: 
        this.player2.anims.play('select-idle2');
        this.graphics2.anims.play('selected');
        break;
      case 3: 
        this.player3.anims.play('select-idle3');
        this.graphics3.anims.play('selected');
        break;
    }
    
  }

}