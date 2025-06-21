import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Include here
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css'
})
export class Userlogin {
  isLoginMode = true; // toggle form

  email = '';
  password = '';
  redirectParams: any;

  // Register Fields
  name = '';
  address = '';
  phone = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.redirectParams = params;
    });
  }
   toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  login() {
  console.log('Sending login data:', this.email, this.password); // 👈 Add this
  this.http.post<any>('http://localhost:5000/api/users/login', {
    email: this.email, password: this.password,
  }).subscribe(
    res => {
      localStorage.setItem('userToken', res.token);
      alert('Login successful!');
       console.log('🎫 Received token:', res.token);
        localStorage.setItem('token', res.token);
        this.toastr.success('Login successful!', 'Welcome');
        this.router.navigate(['/']); // or your payment route
    },
    err => {
      console.error('Login error:', err);
      alert('Login failed. Please try again.');
    }
  );
}

  //register
  register() {
    const body = {
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      password: this.password,

    };
      console.log('Sending login data:', this.name,this.address,this.email, this.password,this.password); 
     this.http.post<any>('http://localhost:5000/api/users/register', body).subscribe(
      res => {
        this.toastr.success('Registration successful! Please login.');
        this.toggleMode(); // Switch back to login
        this.router.navigate(['users/login']);
      },
      err => {
        alert('Registration failed: ' + err.error?.error || 'Unknown error');
         this.toastr.error('Registration Failed!');
      }
    );
  }

}
