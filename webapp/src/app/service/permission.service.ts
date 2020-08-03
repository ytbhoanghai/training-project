import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from './../core/constants/api.constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private REQUEST_URL = SERVER_URL + '/permissions';

  constructor(private http: HttpClient) {}

  fetchPermission(grantable: boolean): Observable<number[]> {
    return this.http.get<number[]>(
      this.REQUEST_URL + `?grantable=${grantable}`
    );
  }
}
