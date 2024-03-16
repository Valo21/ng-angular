import { rotateMatrix } from '../../lib/utils';
import config from '../game.config';

export class Tetromino {
  x: number;
  y: number;
  public shape;
  public color;
    
  constructor() {
    const cfgShape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
    this.shape = cfgShape.matrix;
    this.color = cfgShape.color;
    this.x = Math.floor(Math.random() * (config.boardWidth - this.shape[0].length - 1));
    this.y = 0;
  }
    
  public rotate() {
    this.shape = rotateMatrix(this.shape);
  }
}