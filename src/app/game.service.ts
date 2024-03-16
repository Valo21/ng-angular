import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tetromino } from './models/Tetromino';
import config from './game.config';
import { rotateMatrix } from '../lib/utils';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}


@Injectable({
  providedIn: 'root'
})
export class GameService {
  public canvas!: HTMLCanvasElement;
  public context2D!: CanvasRenderingContext2D | null;
  public score = new BehaviorSubject<number>(0);
  public level: number = 1;
  public board: {x: number, y: number, value: number, color: string}[][] = config.generateBoard();
  public blockSize: number = 20;

  public canvasWidth: number = config.boardWidth * this.blockSize;
  public canvasHeight: number = config.boardHeight * this.blockSize;

  public tetromino$ = new BehaviorSubject<Tetromino>(new Tetromino());
  public interval: ReturnType<typeof setInterval> | null = null; 
  public music = new Audio('/assets/Tetris.mp3');

  public isToastShown = false;


  constructor() {
  }

  public initialize() {
    this.level = 1;
    this.score.next(0);
    this.board = config.generateBoard();
    this.music.currentTime = 0;
    this.music.play();
    this.music.loop = true;
    this.tetromino$.next(new Tetromino());
    this.tetromino$.subscribe(tetromino => {
      if (tetromino.y === 0) {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.moveTetromino('DOWN');
        }, 800 / (2 * (this.level)));
      }
    });
    this.score.subscribe(()=> {
      if (this.score.getValue() > (400 * Math.pow(2, this.level - 1))){
        this.level++;
      }
    });

    const draw = () => { 
      this.tetromino$.getValue().shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            this.board[this.tetromino$.getValue().y + y][this.tetromino$.getValue().x + x].color = this.tetromino$.getValue().color;
            this.board[this.tetromino$.getValue().y + y][this.tetromino$.getValue().x + x].value = value;
          }
        });
      });
    };

    function render() {
      draw();
      requestAnimationFrame(render);
    }

    render();
  }

  public isGameOver(){
    let gameOver: boolean = false;
    this.board[0].forEach((pixel) => {
      if (pixel.value === 1) {
        gameOver = true;
      }
    });

    return gameOver;
  }

  public checkCollision(tetromino: Tetromino) {
    return tetromino.shape.find((row, y) => {
      return row.find((value, x)=> {
        return (
          value !== 0 &&
          this.board[y + tetromino.y]?.[tetromino.x + x]?.value !== 0 && 
          !(this.board[y + tetromino.y]?.[tetromino.x + x]?.value === 2)
        );
      });
    });
  }

  public gameOver(){
    if (this.interval) clearInterval(this.interval);
    this.isToastShown = true;
    setTimeout(()=> {
      this.isToastShown = false;
    }, 2000);
  }

  public removeRows() {
    const rowsToRemove: number[] = [];

    this.board.forEach((row, y) => {
      if (row.every(c => c.value === 1)){
        rowsToRemove.push(y);
      }
    });

    rowsToRemove.forEach(y => {
      this.board.splice(y, 1);
      const newRow =  config.generateBoard()[0];
      this.board.unshift(newRow);
      this.score.next(this.score.getValue() + 100 * this.level * 0.3);
    });

  }
  
  public clearPreviusPixel(tetromino: Tetromino) {
    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.board[tetromino.y + y][tetromino.x + x].color = '#0ea5e9';
          this.board[tetromino.y + y][tetromino.x + x].value = 0;
        }
      });
    });
  }

  public rotateTetromino(){
    this.clearPreviusPixel(this.tetromino$.getValue());
    this.tetromino$.getValue().shape = rotateMatrix(this.tetromino$.getValue().shape);
  }

  public moveTetromino(direction: 'DOWN' | 'LEFT' | 'RIGHT') {
    const tetromino = this.tetromino$.getValue();
    const tHelper: Tetromino = Object.assign({}, tetromino);
    switch (direction) {
    case 'DOWN':
      tHelper.y++;
      break;
    case 'LEFT':
      tHelper.x--;
      if (tHelper.x < 0){
        return;
      }
      break;
    case 'RIGHT':
      tHelper.x++;
      if (tetromino.x + tetromino.shape[0].length >= config.boardHeight){
        return;
      }
      break;
    default:
      break;
    }
    if (this.checkCollision(tHelper)) {
      if (direction === 'DOWN') {
        tetromino.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              this.board[tetromino.y + y][tetromino.x + x].value = 1;
              this.board[tetromino.y + y][tetromino.x + x].color = tetromino.color;
            }
          });
        });
        this.removeRows();
        if (this.isGameOver()) {
          this.gameOver();
          return;
        }
        this.tetromino$.next(new Tetromino());
        return;
      }
      return;
    }

    this.clearPreviusPixel(tetromino);
    this.tetromino$.next(tHelper);
  }
}


/* 

public initialize(canvas: HTMLCanvasElement) {
    this.board = config.board;
    this.canvas = canvas;
    this.context2D = this.canvas.getContext('2d');
    if (!this.context2D) {
      return;
    }
    this.context2D.scale(this.blockSize, this.blockSize);

    this.interval = setInterval(() => {
      this.moveTetromino('DOWN');
    }, 1000);
    const draw = () => {
      if (!this.context2D){
        return;
      }
      this.context2D.fillStyle = '#87ceeb';
      this.context2D.fillRect(0, 0, config.boardWidth, config.boardHeight);
  
      this.board.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel.value === 1) {
            this.context2D!.fillStyle = pixel.color;
            this.context2D!.fillRect(x, y, 1, 1);
          }
        });
      });
      
      this.tetromino$.getValue().shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            this.context2D!.fillStyle = this.tetromino$.getValue().color;
            this.context2D!.fillRect(this.tetromino$.getValue().x + x, this.tetromino$.getValue().y + y, 1, 1);
          }
        });
      });
    };
  
    function update() {
      draw();
      window.requestAnimationFrame(update);
    }

    update();
  }

*/