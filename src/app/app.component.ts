import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameService } from './game.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroArrowDown, heroArrowLeft, heroArrowRight, heroArrowPath} from "@ng-icons/heroicons/outline";

export enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [provideIcons({ heroArrowDown, heroArrowLeft, heroArrowRight, heroArrowPath })],
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
    event.preventDefault();
    switch (event.key) {
    case KEY_CODE.DOWN_ARROW:
      this.gameService.moveTetromino('DOWN', true);
      break;
    case KEY_CODE.LEFT_ARROW:
      this.gameService.moveTetromino('LEFT');
      break;

    case KEY_CODE.RIGHT_ARROW:
      event.preventDefault();
      this.gameService.moveTetromino('RIGHT');
      break;

    case KEY_CODE.UP_ARROW:
      this.gameService.rotateTetromino();
      break;
    default:
      break;
    }
  }
}
