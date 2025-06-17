import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { SwiperModule } from 'swiper/angular';
//import SwiperCore, { Navigation, Pagination} from 'Swiper';

// 👉 Register modules globally
//SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage {

  selectedSize: string = '';
selectedPrice: number | null = null;


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
  onSizeChange() {
  const selected = this.product.pricing.find((p: { size: string; }) => p.size === this.selectedSize);
  this.selectedPrice = selected ? selected.price : null;
    }


  buyNow() {
    if (!this.selectedSize || this.selectedPrice === null) {
    alert("Please select a size before proceeding.");
    return;
  } else{
    alert(`Proceeding to buy frame: ${this.product.title} and its Size : ${this.selectedSize} price: ${this.selectedPrice}`);
    
  }

}

  previewImage() {
    alert('Show image overlay preview logic here.');
    // You can later expand this with a modal or canvas rendering
  }

}
