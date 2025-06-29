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
  frameWidth = 0;
  frameHeight = 0;
  transparentBox = { top: 0, left: 0, width: 0, height: 0 };  

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
        // Optionally set default selected center image
        if (this.frameData.centerImage) {
          this.selectedCenterImage = this.frameData.centerImage;
        }
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
        console.log('Image URL:', this.uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  }

  selectCenterImage(imageUrl: string) {
    this.selectedCenterImage = imageUrl;
    console.log(this.selectCenterImage);
  }

   onFrameLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    this.frameWidth = img.naturalWidth;
    this.frameHeight = img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = this.frameWidth;
    canvas.height = this.frameHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
     let foundTransparent = false;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const alpha = data[i + 3];
        if (alpha < 10) { // transparent pixel
          foundTransparent = true;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

     if (foundTransparent) {
      this.transparentBox = {
        top: minY,
        left: minX,
        width: maxX - minX,
        height: maxY - minY
      };
    } else {
      // fallback if no transparent area found
      this.transparentBox = { top: 0, left: 0, width: this.frameWidth, height: this.frameHeight };
    }
  }

   
  

  proceedToOrder() {
    this.router.navigate(['/product', this.productId], {
      queryParams: { centerImage: this.selectedCenterImage }
    });
  }
}