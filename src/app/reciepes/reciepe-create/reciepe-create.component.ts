import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReciepeService } from '../reciepe.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Reciepe } from '../reciepe.model';
import { mimeType } from './mimeType.validator';

@Component({
  selector: 'app-reciepe-create',
  templateUrl: './reciepe-create.component.html',
  styleUrls: ['./reciepe-create.component.css']
})
export class ReciepeCreateComponent implements OnInit {

  reciepeForm: FormGroup;
  isLoading = false;
  mode = 'create';
  reciepe: Reciepe;
  reciepeId;
  previewImage: string;

  constructor(private reciepeService: ReciepeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.reciepeForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl('veg', { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.reciepeId = paramMap.get('id');
        this.reciepeService.getReciepeById(this.reciepeId)
          .subscribe((response: Reciepe) => {
            this.isLoading = false;
            this.reciepe = response;
            this.reciepeForm.patchValue({
              title: this.reciepe.title,
              content: this.reciepe.content,
              type: this.reciepe.type,
              image: this.reciepe.imagePath
            });
            this.previewImage = response.imagePath;
          }, err => {
            console.log(err);
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.reciepeId = null;
      }
    });

  }

  onPickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.reciepeForm.patchValue({
      image: file
    });
    if (file) {
      this.reciepeForm.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.previewImage = fileReader.result as string;
      };
      fileReader.readAsDataURL(file);
    }

  }

  onSubmit() {
    if (this.reciepeForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.reciepeService.postReciepe({
        id: null,
        title: this.reciepeForm.value.title,
        content: this.reciepeForm.value.content,
        type: this.reciepeForm.value.type,
        imagePath: null,
        createdBy: null
      }, this.reciepeForm.value.image)
        .subscribe((response) => {
          this.router.navigate(['/']);
        });
    } else {
      this.reciepeService.editReciepe(this.reciepeId,
        {
          id: this.reciepeId,
          title: this.reciepeForm.value.title,
          content: this.reciepeForm.value.content,
          type: this.reciepeForm.value.type,
          imagePath: null,
          createdBy: null
        }, this.reciepeForm.value.image)
        .subscribe((response) => {
          console.log(response);
          this.router.navigate(['/']);
        });
    }

  }

}
