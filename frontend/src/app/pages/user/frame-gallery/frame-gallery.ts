import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector: 'app-frame-gallery',
  standalone: true, // ✅ mark as standalone
  imports: [CommonModule,HttpClientModule], // ✅ for *ngFor, *ngIf etc.
  templateUrl: './frame-gallery.html',
  styleUrl: './frame-gallery.css'
})

export class FrameGallery {

   frames: any[] = [];
  baseUrl = 'http://localhost:5000'; // adjust if deployed

   constructor(
    private router: Router,private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    this.http.get<any[]>(`${this.baseUrl}/api/frames`).subscribe(data => {
      this.frames = data;
    });
  }

  routeToAdmin(){
    this.router.navigate(['/admin/login']);
  }

  onBuyNow(frameId: string) {
  console.log('Buy Now clicked for ID:', frameId);
  // Navigate to product detail page (placeholder)
  // this.router.navigate(['/product', frameId]);
  this.router.navigate(['/product', frameId]);
}
onAddToCart(frameId: string) {
  console.log('Add to Cart clicked for ID:', frameId);
  // Add logic to update cart (later)
}
}
