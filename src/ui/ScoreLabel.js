import Phaser from 'phaser'

const formatScore = (score, template) => template.replace('#{score}', score)

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style, scoreTemplate) {
    super(scene, x, y, '', style);
    this.scoreTemplate = scoreTemplate
    this.setScore(score);
  }

  setScore(score) {
    this.score = score
    this.updateScoreText()
  }

  add(points) {
    this.setScore(this.score + points)
  }

  updateScoreText() {
    this.setText(formatScore(this.score, this.scoreTemplate))
  }
}