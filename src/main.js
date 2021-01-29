import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
const merge = require('deepmerge')
let debugMode = JSON.parse( localStorage.getItem('@helloPhaser/structure/debugMode') );
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'hello-phaser',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: debugMode
		}
	},
	scene: [MainScene]
}

const APP = {
	game: new Phaser.Game(config)
}
document.getElementById('game-debug-toggle').checked = debugMode;
document.getElementById('game-debug-toggle').addEventListener('change', function(e){
	e.preventDefault();
	let debug = e.target.checked;
	localStorage.setItem('@helloPhaser/structure/debugMode', JSON.stringify(debug));
	
	APP.game.destroy(true);
	APP.game = new Phaser.Game(merge(config, { physics: { arcade: { debug } } }))

});

export default APP
