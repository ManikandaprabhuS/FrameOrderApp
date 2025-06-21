import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:5000/api/admin';  // Backend URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log(email,password);
    return this.http.post(`${this.api}/login`, { email, password });
  }
  
  logout(): void {
  localStorage.removeItem('token');
  localStorage.clear();
}

}
