import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
      @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onLogin() {
    console.log(this.email);
    this.authService.login(this.email, this.password).subscribe({
      next: (res: { token: string }) => {
        console.log('🎫 Received token:', res.token);
        localStorage.setItem('token', res.token);
        this.toastr.success('Login successful!', 'Welcome');
        console.log('✅ Navigating to dashboard...');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: any) => {
        const errorMessage =
          error?.error?.message || 'Login failed. Please try again.';
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }
}
