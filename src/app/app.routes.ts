import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ModuleSelectorComponent } from './components/module-selector/module-selector.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BingoComponent } from './modules/bingo/bingo.component';
import { KanbanBoardComponent } from './modules/kanban-board/kanban-board.component';
import { QuizComponent } from './modules/quiz/quiz.component';
import { VisionBoardComponent } from './modules/vision-board/vision-board.component';
import { WhiteboardComponent } from './modules/whiteboard/whiteboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'module-selector', component: ModuleSelectorComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'modules/bingo', component: BingoComponent },
  { path: 'modules/kanban-board', component: KanbanBoardComponent },
  { path: 'modules/quiz', component: QuizComponent },
  { path: 'modules/whiteboard', component: WhiteboardComponent },
  { path: 'modules/vision-board', component: VisionBoardComponent },
];
