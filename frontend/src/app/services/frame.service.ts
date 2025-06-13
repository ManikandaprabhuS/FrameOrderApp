import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Frame {
  _id?: string;
  title: string;
  sizes: string[];
  colors: string[];
  material: string;
  price: number;
  image: string;
  video?: string;
  outOfStock?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FrameService {
  private api = 'http://localhost:5000/api/frames';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Frame[]> {
    return this.http.get<Frame[]>(this.api);
  }

  create(frame: Frame): Observable<Frame> {
    return this.http.post<Frame>(this.api, frame);
  }

  update(id: string, frame: Frame): Observable<Frame> {
    return this.http.put<Frame>(`${this.api}/${id}`, frame);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
