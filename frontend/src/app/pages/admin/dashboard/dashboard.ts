import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

   goToManageFrames() {
    this.router.navigate(['/admin/manageFrames']);
  }

  onLogout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Success');
    this.router.navigate(['']);
  }

}
