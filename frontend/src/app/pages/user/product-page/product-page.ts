import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
//import { SwiperModule } from 'swiper/angular';
//import SwiperCore, { Navigation, Pagination} from 'Swiper';

// 👉 Register modules globally
//SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage {

  productId: string = '';
  product: any;
  baseUrl = 'http://localhost:5000';

  constructor(private router: Router,private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.http.get(`${this.baseUrl}/api/frames/${this.productId}`).subscribe(data => {
      this.product = data;
      console.log(data);
    });
  }

  buyNow() {
    alert(`Proceeding to buy frame: ${this.product.title}`);
    // Later navigate to checkout
  }
  previewImage() {
    alert('Show image overlay preview logic here.');
    // You can later expand this with a modal or canvas rendering
  }

}
