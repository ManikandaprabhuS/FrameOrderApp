import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ManageFrames } from './pages/admin/manage-frames/manage-frames';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin/manageFrames', canActivate: [authGuard], component: ManageFrames},
  { path: 'admin/dashboard',  canActivate: [authGuard],  component: Dashboard},

];
