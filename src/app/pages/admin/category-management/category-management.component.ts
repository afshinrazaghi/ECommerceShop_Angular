import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { CategoryApi } from 'src/app/api/v1/category-api';
import { CategoryRequest } from 'src/app/models/category-request';
import { CategoryResponse } from 'src/app/models/category-response';
import { UpdateCategoryRequest } from 'src/app/models/update-category-request';
import { LoadingService } from 'src/app/services/loading.service';
import { UpdateCategoryValidator } from 'src/app/validators/update-category.validator';

import Swal from 'sweetalert2';
import { CategoryComponent } from '../category/category.component';
import { DeleteCategoryRequest } from 'src/app/models/delete-category-request';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: CategoryResponse[];
  clonedCategories: { [s: string]: CategoryResponse } = {};
  totalRecords = 0;
  loading = false;
  take = 10;
  first = 0;
  constructor(
    private categoryApi: CategoryApi,
    private loadingService: LoadingService,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

  }


  loadCategories(event: LazyLoadEvent) {
    setTimeout(() => {
      this.loading = true;
      const skip = event.first;
      this.categoryApi.getCategories({ skip: skip, take: this.take } as CategoryRequest).subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.categories = res.items;
          this.totalRecords = res.count;
        } else {
          this.messageService.add({ severity: 'error', summary: "Error", detail: res.message });
        }
      })
    }, 1000);
  }

  onRowEditInit(category: CategoryResponse) {
    this.clonedCategories[category.id] = { ...category };
  }

  onRowEditSave(category: CategoryResponse, index: number) {
    const validator = new UpdateCategoryValidator();
    const validationResult = validator.validate(category);
    let messages = [];
    for (const field in validationResult) {
      messages.push(validationResult[field]);
    }

    if (messages.length == 0) {
      this.loadingService.loading = true;
      this.categoryApi.updateCategory({ id: category.id, name: category.name, description: category.description } as UpdateCategoryRequest).subscribe(res => {
        this.loadingService.loading = false;
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
          delete this.clonedCategories[category.id];
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
          this.onRowEditCancel(category, index);
        }
      })
    }
    else {
      Swal.fire('Warning', messages.join("<br />"), 'warning');
    }

  }

  onRowEditCancel(category: CategoryResponse, index: number) {
    this.categories[index] = this.clonedCategories[category.id];
    delete this.clonedCategories[category.id];
  }

  addCategory() {
    this.dialog.open(CategoryComponent, {
    }).afterClosed().subscribe(res => {
      if (res == true) {
        this.loadCategories({ first: this.first } as LazyLoadEvent);
      }
    });
  }

  deleteCategory(category: CategoryResponse, index: number) {
    Swal.fire({
      title:'Warning',
      html: 'Are you sure?',
      icon: 'question',
      showCancelButton:true,
      showConfirmButton:true,
    }).then(res => {
      if (res.isConfirmed) {
        this.loadingService.loading = true;
        this.categoryApi.deleteCategory({ id: category.id } as DeleteCategoryRequest).subscribe(res => {
          this.loadingService.loading = false;
          if (res.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message })
            this.loadCategories({ first: this.first } as LazyLoadEvent);
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message })

          }
        })
      }
    })
  }
}
