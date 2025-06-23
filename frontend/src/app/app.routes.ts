
import { LoginComponent } from './pages/admin/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ManageFrames } from './pages/admin/manage-frames/manage-frames';
import { FrameGallery } from './pages/user/frame-gallery/frame-gallery';
import { Component } from '@angular/core';
import { ProductPage } from './pages/user/product-page/product-page';
import { Routes } from '@angular/router';
import { Userlogin } from './pages/user/userlogin/userlogin';
import { ImagePreview } from './pages/user/image-preview/image-preview';


export const routes: Routes = [
  { path: 'admin/login', component: LoginComponent },
  { path: '', component: FrameGallery }, // Default homepage
  { path: 'admin/manageFrames', canActivate: [authGuard], component: ManageFrames},
  { path: 'admin/dashboard',  canActivate: [authGuard],  component: Dashboard},
  {path: 'product/:id',component: ProductPage },
  {path: 'preview/:id',component: ImagePreview},
  {path: 'users/login', component: Userlogin}

];
