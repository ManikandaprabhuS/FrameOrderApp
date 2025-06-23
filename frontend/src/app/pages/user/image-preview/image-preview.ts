import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-image-preview',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.css'
})
export class ImagePreview {
 productId: string = '';
  frameData: any;
  uploadedImage: string | null = null;
  selectedCenterImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.fetchFrameData();
  }

  fetchFrameData() {
    console.log("Get into Image preview page")
    console.log(this.productId);
    this.http.get(`http://localhost:5000/api/frames/${this.productId}`).subscribe({
      next: (res: any) => {
        this.frameData = res;
        console.log(this.frameData);
      },
      error: (err: any) => {
        console.error('Error fetching frame data', err);
      }
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  selectCenterImage(imageUrl: string) {
    this.selectedCenterImage = imageUrl;
    console.log(this.selectCenterImage);
  }

  proceedToOrder() {
    this.router.navigate(['/product', this.productId], {
      queryParams: { centerImage: this.selectedCenterImage }
    });
  }
}