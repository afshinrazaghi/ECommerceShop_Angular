import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CategoryApi } from 'src/app/api/v1/category-api';
import { CreateCategoryRequest } from 'src/app/models/create-category-response';
import { UpdateCategoryRequest } from 'src/app/models/update-category-request';
import { LoadingService } from 'src/app/services/loading.service';
import { CreateCategoryValidator } from 'src/app/validators/create-category.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryApi: CategoryApi,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<CategoryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: UpdateCategoryRequest | null
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    if (this.data) {
      this.categoryForm.patchValue(this.data);
    }
  }


  onSubmit() {
    const validator = new CreateCategoryValidator();
    let model = this.categoryForm.value as CreateCategoryRequest;
    const validationResult = validator.validate(model);
    const messages = [];
    for (const field in validationResult) {
      messages.push(validationResult[field]);
    }

    if (messages.length == 0) {
      this.loadingService.loading = true;
      this.categoryApi.createCategory(model).subscribe(res => {
        this.loadingService.loading = false;
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: res.message });
          this.dialogRef.close(true);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      })
    }
    else {
      Swal.fire('Warning', messages.join("<br />"), 'warning');
    }
  }

  close() {
    this.dialogRef.close(null);
  }

}
