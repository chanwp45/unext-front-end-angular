import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../shared/services/api-base.service';
import { Faculty, Department } from '../models/faculty.model';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class FacultiesApiService extends ApiBaseService {
  getFaculties(): Observable<ApiResponse<Faculty[]>> {
    return this.get<Faculty[]>('/v1/faculties');
  }

  getDepartmentsByFaculty(facultyId: number): Observable<ApiResponse<Department[]>> {
    return this.get<Department[]>(`/v1/faculties/${facultyId}/departments`);
  }
}
