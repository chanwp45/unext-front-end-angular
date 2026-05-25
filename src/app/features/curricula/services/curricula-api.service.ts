import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../shared/services/api-base.service';
import {
  Curriculum,
  CreateCurriculumRequest,
  UpdateCurriculumRequest,
  CurriculumAudit,
  CurriculumFilter,
} from '../models/curriculum.model';
import { ApiResponse, PagedResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CurriculaApiService extends ApiBaseService {
  getCurricula(filter?: CurriculumFilter): Observable<PagedResponse<Curriculum>> {
    return this.getPaged<Curriculum>('/v1/curricula', filter as Record<string, unknown>);
  }

  getCurriculumById(id: number): Observable<ApiResponse<Curriculum>> {
    return this.get<Curriculum>(`/v1/curricula/${id}`);
  }

  createCurriculum(body: CreateCurriculumRequest): Observable<ApiResponse<Curriculum>> {
    return this.post<Curriculum>('/v1/curricula', body);
  }

  updateCurriculum(id: number, body: UpdateCurriculumRequest): Observable<ApiResponse<Curriculum>> {
    return this.put<Curriculum>(`/v1/curricula/${id}`, body);
  }

  deleteCurriculum(id: number): Observable<ApiResponse<void>> {
    return this.delete<void>(`/v1/curricula/${id}`);
  }

  getAudit(id: number, page = 1, limit = 20): Observable<PagedResponse<CurriculumAudit>> {
    return this.getPaged<CurriculumAudit>(`/v1/curricula/${id}/audit`, { page, limit });
  }
}
