import Phaser from 'phaser'
import PlayerController from '../controllers/Player/PlayerController'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload-scene')
    this.selected = 1;
    this.menuItem = 1;
    this.players = {};
  }

  preload() {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('logo', 'assets/img/hello-phaser-logo.png');

    PlayerController.loadSpritesheets(this);

    this.load.spritesheet('selector', 'assets/img/player-selector.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 150, 'logo');

    let textStyle = { fontSize: '32px', fill: '#fff', padding: 10, fontStyle: 'bold' };

    this.startGameLabel = this.add.text(400, 420, 'Start Game', textStyle);
    this.startGameLabel.setOrigin(0.5);

    this.optionsLabel = this.add.text(400, ( 420 + this.startGameLabel.height ) , 'Options', textStyle);
    this.optionsLabel.setOrigin(0.5);

    this.setMenuItem( this.menuItem );

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
      switch( this.menuItem ){
        case 1: 
          this.scene.start('main-scene');
          break;
        case 2:
          this.scene.start('options-scene');
          break;
      }
    });

    this.input.keyboard.on('keyup-' + 'RIGHT', (event) => { 
      let playerIdx = Math.min((this.selected + 1), 3);
      this.setSelected(playerIdx);
    });

    this.input.keyboard.on('keyup-' + 'LEFT', (event) => { 
      let playerIdx = Math.max((this.selected - 1), 1);
      this.setSelected(playerIdx);
    });

    this.input.keyboard.on('keyup-' + 'DOWN', (event) => { 
      let itemIdx = Math.min((this.menuItem + 1), 2);
      this.setMenuItem(itemIdx);
    });
    
    this.input.keyboard.on('keyup-' + 'UP', (event) => { 
      let itemIdx = Math.max((this.menuItem - 1), 1);
      this.setMenuItem(itemIdx);
    });

    PlayerController.availableCharacters.forEach((character, index) => {
      const x = index * 192 + 128 + 85;
      this.players[character.key] = new PlayerController( x, 290, this, character.key );
      this.players[character.key].sprite.body.allowGravity = false;
      this.players[character.key].createAnims(['idle']);
      this.players[character.key].sprite.setScale(2).refreshBody();
      this.players[character.key].sprite.setDepth(1);
    });

    this.graphics = this.physics.add.sprite( ( 85 + 128), 290, 'selector');
    this.graphics.body.allowGravity = false;

    this.graphics2 = this.physics.add.sprite( ( 85 + 320), 290, 'selector');
    this.graphics2.body.allowGravity = false;

    this.graphics3 = this.physics.add.sprite( ( 85 + 512), 290, 'selector');
    this.graphics3.body.allowGravity = false;

    this.setSelected( this.selected );
  }

  setSelected( playerIdx ){
    
    this.selected = playerIdx;
    this.players['dude'].sprite.anims.stop();
    this.graphics.anims.play('not-selected');
    
    this.players['dude2'].sprite.anims.stop();
    this.graphics2.anims.play('not-selected');
    
    this.players['dude3'].sprite.anims.stop();
    this.graphics3.anims.play('not-selected');

    switch( this.selected ){
      case 1:
        this.players['dude'].sprite.anims.play(this.players['dude'].keys.idle);
        this.graphics.anims.play('selected');
        break;
      case 2: 
        this.players['dude2'].sprite.anims.play(this.players['dude2'].keys.idle);
        this.graphics2.anims.play('selected');
        break;
      case 3: 
        this.players['dude3'].sprite.anims.play(this.players['dude3'].keys.idle);
        this.graphics3.anims.play('selected');
        break;
    }
  }
  
  setMenuItem( itemIdx ){
    this.menuItem = itemIdx;
    this.startGameLabel.setAlpha(0.6);
    this.optionsLabel.setAlpha(0.6);

    switch( this.menuItem ){
      case 1:
        this.startGameLabel.setAlpha(1);
        break;
      case 2:
        this.optionsLabel.setAlpha(1);
        break;
    }
  }
}