import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content';
import { CodexComponent } from './codex/codex.component';
import { CodexEntryComponent } from './codex-entry/codex-entry.component';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'codex', component: CodexComponent },
  { path: 'codex/:slug', component: CodexEntryComponent },
  { path: '**',    component: NoContentComponent }
];
