import { Component, OnInit } from '@angular/core';
import { Frame, FrameService } from '../../../services/frame.service';
import { FormsModule } from '@angular/forms'; // for ngModel
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

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

  newFrame: Frame = {
    title: '',
    sizes: [],
    colors: [],
    material: '',
    price: 0,
    image: '',
    video: '',
    outOfStock: false,
  };
    frames: Frame[] = [];
  baseUrl = 'http://localhost:5000'; 


  imageFile: File | null = null;
  videoFile: File | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private frameService: FrameService
  ) {}

  ngOnInit() {
    this.loadFrames();
  }

  loadFrames() {
    this.frameService.getAll().subscribe(data => {
      this.frames = data;
    });
  }
  
  resetForm() {
  this.newFrame = {
    title: '',
    sizes: [],
    colors: [],
    material: '',
    price: 0,
    image: '',
    video: '',
    outOfStock: false
  };
  this.selectedSizes = [];
  this.selectedColors = [];
  this.imageFile = null;
  this.videoFile = null;
}

addFrame() {
  const formData = new FormData();
  formData.append('title', this.newFrame.title);
  formData.append('sizes', this.selectedSizes.join(','));   // ✅ plural
  formData.append('colors', this.selectedColors.join(',')); // ✅ plural
  formData.append('material', this.newFrame.material);
  formData.append('price', this.newFrame.price.toString());
  formData.append('outOfStock', String(this.newFrame.outOfStock));

  if (this.imageFile) formData.append('image', this.imageFile);
  if (this.videoFile) formData.append('video', this.videoFile);

  this.http.post(`${this.baseUrl}/api/frames`, formData).subscribe({
    next: () => {
      this.toastr.success('Frame added successfully!');
      this.newFrame = {
          title: '',
          sizes: [],
          colors: [],
          material: '',
          price: 0,
          image: '',
          video: ''
        };
        this.loadFrames();
        this.resetForm();
    },
    error: (err: any) => {
      this.toastr.error('Error adding frame');
      console.error(err);
    }
  });
}

toggleSelection(value: string, type: 'size' | 'color') {
  const list = type === 'size' ? this.selectedSizes : this.selectedColors;
  const index = list.indexOf(value);

  if (index > -1) {
    list.splice(index, 1); // remove
  } else {
    list.push(value); // add
  }
}


onFileChange(event: any, type: 'image' | 'video') {
  const file = event.target.files[0];
  if (type === 'image') {
    this.imageFile = file;
  } else if (type === 'video') {
    this.videoFile = file;
  }
}


  deleteFrame(id: string) {
    this.frameService.delete(id).subscribe(() => {
      this.toastr.success('Successfully Deleted')
      this.loadFrames();

    });
  }
}
