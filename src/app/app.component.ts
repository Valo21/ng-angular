import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameService } from './game.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

export enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  SPACE = ' '
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1,
        transform: 'translateY(40px)',
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-100px)',
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class AppComponent {

  public isShown: boolean = false;

  constructor(public gameService: GameService){
  }

  startGame() {
    this.gameService.initialize();
    document.getElementById('display')?.focus();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.gameService.isRunning) return;
    switch (event.key) {
    case KEY_CODE.DOWN_ARROW:
      event.preventDefault();
      this.gameService.moveTetromino('DOWN');
      this.gameService.score.next(this.gameService.score.getValue() + 2);
      break;
    case KEY_CODE.LEFT_ARROW:
      event.preventDefault();
      this.gameService.moveTetromino('LEFT');
      break;
    
    case KEY_CODE.RIGHT_ARROW:
      event.preventDefault();
      this.gameService.moveTetromino('RIGHT');
      break;
    
    case KEY_CODE.SPACE:
      event.preventDefault();
      this.gameService.rotateTetromino();
      break;
    default:
      break;
    }
  }
}