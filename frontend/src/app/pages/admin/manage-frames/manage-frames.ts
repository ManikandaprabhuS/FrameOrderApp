import { Frame, FrameService } from '../../../services/frame.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-frames',
  standalone: true,
  templateUrl: './manage-frames.html',
  styleUrl: './manage-frames.css',
  imports: [CommonModule, ReactiveFormsModule,FormsModule] 
})

export class ManageFrames implements OnInit {
   frameForm!: FormGroup;
  availableSizes = ['8x10', '10x12', '12x16', '16x20', '18x24'];
  availableColors = ['Black', 'White', 'Brown', 'Gold', 'Silver'];

  imageFile: File[] = [];
  videoFile: File | null = null;
  centerImageFile: File | null = null;

  frames: Frame[] = [];
  baseUrl = 'http://localhost:5000';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private frameService: FrameService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadFrames();
  }

  initForm() {
    this.frameForm = this.fb.group({
      title: ['', Validators.required],
      material: ['', Validators.required],
      colors: this.fb.array([]),
      outOfStock: [false],
      pricing: this.fb.array([])
    });
  }

  get pricing(): FormArray {
    return this.frameForm.get('pricing') as FormArray;
  }

  loadFrames() {
    this.frameService.getAll().subscribe((data) => {
      this.frames = data;
    });
  }

  onLogout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Success');
    this.router.navigate(['']);
  }

  addSize(size: string) {
    const group = this.fb.group({
      size: [size],
      price: [0, Validators.required],
      units: [0, Validators.required],
      imageFile: [null]
    });
    this.pricing.push(group);
  }
  hasSize(size: string): boolean {
  return this.pricing.controls.some(c => c.value.size === size);
}

getPricingGroup(size: string): FormGroup | null {
  const found = this.pricing.controls.find(c => c.value.size === size);
  return found instanceof FormGroup ? found : null;
}


  removeSize(size: string) {
    const index = this.pricing.controls.findIndex(c => c.value.size === size);
    if (index !== -1) this.pricing.removeAt(index);
  }

  onSizeToggle(event: any, size: string) {
    if (event.target.checked) {
      this.addSize(size);
    } else {
      this.removeSize(size);
    }
  }

  toggleColorSelection(color: string) {
    const colors = this.frameForm.get('colors') as FormArray;
    const index = colors.controls.findIndex(ctrl => ctrl.value === color);
    if (index >= 0) {
      colors.removeAt(index);
    } else {
      colors.push(new FormControl(color));
    }
  }

  onSizeImageChange(event: any, size: string) {
    const file = event.target.files[0];
    console.log(file);
    const control = this.pricing.controls.find(c => c.value.size === size);
   if (control) {
    (control as FormGroup).addControl('imageFile', new FormControl(file));
  }
  }

  onFileVideoChange(event: any) {
    this.videoFile = event.target.files[0];
  }

  onCenterImageSelected(event: any) {
    this.centerImageFile = event.target.files[0];
  }

  addFrame() {
    const formData = new FormData();
    const formValue = this.frameForm.value;

    formData.append('title', formValue.title);
    formData.append('material', formValue.material);
    formData.append('colors', formValue.colors.join(','));
    formData.append('outOfStock', formValue.outOfStock.toString());

    const pricingToSend = formValue.pricing.map((p: any) => ({
      size: p.size,
      price: p.price,
      units: p.units,
      //imageFile: p.imageFile
    }));

    formData.append('pricing', JSON.stringify(pricingToSend));

    this.pricing.controls.forEach((group: any) => {
      const size = group.get('size')?.value;
      const file = group.get('imageFile')?.value;
      if (file) {
        formData.append(`sizeImage-${size}`, file);
      }
    });

    if (this.videoFile) {
      formData.append('video', this.videoFile);
    }
    if (this.centerImageFile) {
      formData.append('centerImage', this.centerImageFile);
    }

    this.http.post(`${this.baseUrl}/api/frames`, formData).subscribe({
      next: () => {
        this.toastr.success('Frame added successfully!');
        this.initForm();
        this.loadFrames();
      },
      error: (err) => {
        this.toastr.error('Error adding frame');
        console.error(err);
      }
    });
  }

  deleteFrame(id: string) {
    this.frameService.delete(id).subscribe(() => {
      this.toastr.success('Successfully Deleted');
      this.loadFrames();
    });
  }
}
