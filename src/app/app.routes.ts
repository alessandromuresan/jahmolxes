import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CodexComponent } from './codex/codex.component';
import { GameComponent } from './game/game.component';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'codex', component: CodexComponent },
  { path: 'codex/:slug', component: GameComponent },
  { path: '_', component: GameComponent },
  { path: '**',    component: NotFoundComponent }
];
