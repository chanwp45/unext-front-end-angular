import { Injectable, inject } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MasterData } from '../models/master.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class MasterApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private cache$: Observable<MasterData> | null = null;

  private readonly fallback: MasterData = {
    degree_levels: ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'],
    title_th: ['นาย', 'นาง', 'นางสาว', 'ดร.', 'รศ.ดร.', 'ศ.ดร.'],
    nationalities: ['ไทย', 'ลาว', 'กัมพูชา', 'เมียนมา', 'เวียดนาม', 'จีน', 'ญี่ปุ่น', 'เกาหลี', 'อินเดีย', 'อื่นๆ'],
  };

  getMasterData(): Observable<MasterData> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<ApiResponse<MasterData>>(`${this.baseUrl}/v1/master`)
        .pipe(
          map((res) => res.data ?? this.fallback),
          catchError(() => of(this.fallback)),
          shareReplay(1),
        );
    }
    return this.cache$;
  }
}
