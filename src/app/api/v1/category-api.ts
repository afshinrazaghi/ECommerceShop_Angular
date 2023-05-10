import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi } from '../base.api';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { CategoryRequest } from 'src/app/models/category-request';
import { BaseQueryResponse } from 'src/app/models/base-query-response.dto';
import { Observable } from 'rxjs';
import { CategoryResponse } from 'src/app/models/category-response';
import { UpdateCategoryRequest } from 'src/app/models/update-category-request';
import { UpdateCategoryResponse } from 'src/app/models/update-category-response';
import { BaseCommandResponse, BaseCommandResponse2 } from 'src/app/models/base-command.dto';
import { CreateCategoryRequest } from 'src/app/models/create-category-response';
import { CreateCategoryResponse } from 'src/app/models/create-category-request';
import { DeleteCategoryRequest } from 'src/app/models/delete-category-request';

@Injectable({ providedIn: 'root' })
export class CategoryApi extends BaseApi {
  constructor(http: HttpClient,
    router: Router,
    private configUser: AppConfigService,
    messageService: MessageService,
    loadingSevice: LoadingService) {
    super(http, configUser, router, 'Category', messageService, loadingSevice);
  }


  getCategories(request: CategoryRequest): Observable<BaseQueryResponse<CategoryResponse>> {
    return this.getByParam('getCategories', request);
  }

  createCategory(request: CreateCategoryRequest): Observable<BaseCommandResponse2<CreateCategoryResponse>> {
    return this.post(request, 'createCategory');
  }

  updateCategory(request: UpdateCategoryRequest): Observable<BaseCommandResponse2<UpdateCategoryResponse>> {
    return this.post(request, 'updateCategory');
  }

  deleteCategory(request:DeleteCategoryRequest):Observable<BaseCommandResponse>{
    return this.post(request, 'deleteCategory');
  }


}
