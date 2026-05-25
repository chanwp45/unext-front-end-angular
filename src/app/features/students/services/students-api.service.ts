import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../shared/services/api-base.service';
import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  UpdateStudentStatusRequest,
  StudentFilter,
} from '../models/student.model';
import { CurriculumAudit } from '../../curricula/models/curriculum.model';
import { ApiResponse, PagedResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class StudentsApiService extends ApiBaseService {
  getStudents(filter?: StudentFilter): Observable<PagedResponse<Student>> {
    return this.getPaged<Student>('/v1/students', filter as Record<string, unknown>);
  }

  getStudentById(studentId: string): Observable<ApiResponse<Student>> {
    return this.get<Student>(`/v1/students/${studentId}`);
  }

  createStudent(body: CreateStudentRequest): Observable<ApiResponse<Student>> {
    return this.post<Student>('/v1/students', body);
  }

  updateStudent(studentId: string, body: UpdateStudentRequest): Observable<ApiResponse<Student>> {
    return this.patch<Student>(`/v1/students/${studentId}`, body);
  }

  updateStatus(studentId: string, body: UpdateStudentStatusRequest): Observable<ApiResponse<Student>> {
    return this.patch<Student>(`/v1/students/${studentId}/status`, body);
  }

  updatePhoto(studentId: string, photoUrl: string): Observable<ApiResponse<Student>> {
    return this.patch<Student>(`/v1/students/${studentId}/photo`, { photo_url: photoUrl });
  }

  getAudit(studentId: string, page = 1, limit = 20): Observable<PagedResponse<CurriculumAudit>> {
    return this.getPaged<CurriculumAudit>(`/v1/students/${studentId}/audit`, { page, limit });
  }
}
