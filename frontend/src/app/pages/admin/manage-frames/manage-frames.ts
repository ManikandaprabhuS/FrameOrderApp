import { Frame, FrameService } from '../../../services/frame.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-frames',
  standalone: true,
  templateUrl: './manage-frames.html',
  styleUrl: './manage-frames.css',
  imports: [CommonModule, FormsModule] 
})

export class ManageFrames implements OnInit {
   availableSizes = ['8x10', '10x12', '12x16', '16x20', '18x24'];
  availableColors = ['Black', 'White', 'Brown', 'Gold', 'Silver'];
  selectedSizes: string[] = [];
  selectedColors: string[] = [];
  pricing: { size: string; price: number }[] = [];

  newFrame: Frame = {
    title: '',
    colors: [],
    material: '',
    pricing: [],      // ✅ new structure replacing sizes + price
    image: '',
    video: '',
    outOfStock: false,
  };
    frames: Frame[] = [];
  baseUrl = 'http://localhost:5000'; 

  imageFiles: File[] = [];
  videoFile: File | null = null;
  sizePrices: any;


  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private frameService: FrameService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadFrames();
  }

  loadFrames() {
    this.frameService.getAll().subscribe(data => {
       this.ngZone.run(() => {
      this.frames = data;
    });
    });
  }
   onLogout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Success');
    this.router.navigate(['']);
  }

  resetForm() {
  this.newFrame = {
    title: '',
    colors: [],
    material: '',
    pricing: [],      // ✅ new structure replacing sizes + price
    image: '',
    video: '',
    outOfStock: false
  };
  this.selectedSizes = [];
  this.selectedColors = [];
  this.imageFiles = [];
  this.videoFile = null;
}

addFrame() {
  const formData = new FormData();
  formData.append('title', this.newFrame.title);
  //formData.append('sizes', this.selectedSizes.join(','));   // ✅ plural
  formData.append('colors', this.selectedColors.join(',')); // ✅ plural
  formData.append('material', this.newFrame.material);
  formData.append('pricing', JSON.stringify(this.pricing));
  formData.append('outOfStock', String(this.newFrame.outOfStock));

  // 👇 Append all selected image files
  this.imageFiles.forEach((file, index) => {
    formData.append('image', file); // same key name "images"
  });

  if (this.videoFile) formData.append('video', this.videoFile);

  // Build pricing array from selectedSizes and sizePrices
  const pricingArray = this.selectedSizes.map(size => {
    const matched = this.pricing.find(p => p.size === size);
  return {
    size,
    price: matched ? matched.price : 0
  }
  });

  this.http.post(`${this.baseUrl}/api/frames`, formData).subscribe({
    next: () => {
      this.toastr.success('Frame added successfully!');
      this.newFrame = {
          title: '',
          colors: [],
          material: '',
          pricing: [],      // ✅ new structure replacing sizes + price
          image: '',
          video: ''
        };
        this.imageFiles = [];
        this.selectedSizes = [];
        this.selectedColors = [];
        this.pricing = []; 
        this.loadFrames();
        this.resetForm();
    },
    error: (err: any) => {
      this.toastr.error('Error adding frame');
      console.error(err);
    }
  });
}

//For Sizes
toggleSizeSelection(size: string) {
  const index = this.selectedSizes.indexOf(size);

  if (index === -1) {
    this.selectedSizes.push(size);
     this.pricing.push({ size, price: 0 }); // initialize with 0 price
   // this.sizePrices[size] = 0; // default
  } else {
    this.selectedSizes.splice(index, 1);
   this.pricing = this.pricing.filter(p => p.size !== size);
  }
}

updatePrice(size: string, newPrice: number) {
  const item = this.pricing.find(p => p.size === size);
  if (item) {
    item.price = newPrice;
  }
}
getPrice(size: string): number {
  const item = this.pricing.find(p => p.size === size);
  return item ? item.price : 0;
}

getValueAsNumber(event: Event): number {
  const input = event.target as HTMLInputElement;
  return input.valueAsNumber;
}

toggleColorSelection(color: string) {
  const index = this.selectedColors.indexOf(color);
  if (index === -1) {
    this.selectedColors.push(color);
  } else {
    this.selectedColors.splice(index, 1);
  }
}

// toggleSelection(value: string, type: 'size' | 'color') {
//   const list = type === 'size' ? this.selectedSizes : this.selectedColors;
//   const index = list.indexOf(value);

//   if (index > -1) {
//     list.splice(index, 1); // remove
//   } else {
//     list.push(value); // add
//   }
// }


onFileChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.imageFiles = Array.from(event.target.files);
  }
}

onFileVideoChange(event: any, type: 'video') {
  const file = event.target.files[0];
   if (type === 'video') {
    this.videoFile = file;
  } else {
    this.toastr.error('This is Not correct Format please upload Valid Video format');
  }
}




  deleteFrame(id: string) {
    this.frameService.delete(id).subscribe(() => {
      this.toastr.success('Successfully Deleted')
      this.loadFrames();

    });
  }
}
