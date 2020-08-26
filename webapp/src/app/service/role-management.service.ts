import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {Observable, of, Subject, BehaviorSubject} from "rxjs";
import { SERVER_URL } from "../core/constants/api.constants";
import { catchError, map, tap } from "rxjs/operators";
import {IPermission, IPermissionChoose, IResource, IRole, IRoleBody} from "../manager/role-management/role-management.component";

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  private MANAGER_URL = SERVER_URL + '/manager';
  private ADMIN_URL = SERVER_URL + '/admin';

  public updateSubject = new Subject();
  public updateObservable$ = this.updateSubject.asObservable();

  roleAddSubject = new BehaviorSubject<IRole>(null);
  roleAddObservable$ = this.roleAddSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  findAllRoles(): Observable<IRole[]> {
    return this.httpClient.get<IRole[]>(this.MANAGER_URL + "/roles").pipe(
      catchError(err => {
        console.error(err);
        return of([]);
      })
    );
  }

  findAdminRoleById(id: number): Observable<IRole> {
    return this.httpClient.get<IRole>(this.ADMIN_URL + "/roles/" + id);
  }

  findManagerRoleById(id: number): Observable<IRole> {
    return this.httpClient.get<IRole>(this.MANAGER_URL + "/roles/" + id);
  }

  deleteRoleById(id: number): Observable<string> {
    return this.httpClient.delete<any>(this.MANAGER_URL + "/roles/" + id).pipe(
      tap(_ => console.log("delete role by id " + id)),
      map(value => value.message));
  }

  findAllResources(): Observable<IResource[]> {
    return this.httpClient.get<IResource[]>(SERVER_URL + "/resources").pipe(
      map(resources => {
        for (let i = 0; i < resources.length; i++) {
          resources[i].permissions = this.permissionListResolver(resources[i].permissions);
          resources[i].isCheckAllPermissions = false;
          resources[i].isCheckAllDisabled = false;
        }
        return resources;
      })
    )
  }

  createRole(body: IRoleBody): Observable<IRole> {
    return this.httpClient.post<IRole>(this.MANAGER_URL + '/roles', body);
  }

  updateRole(id: number, body: IRoleBody): Observable<IRole> {
    return this.httpClient.put<IRole>(SERVER_URL + `/roles/${id}`, body);
  }

  private permissionListResolver(permissions: IPermission[]): IPermissionChoose[] {
    const arrTemp = { "CREATE": 0,  "READ": 1,  "UPDATE": 2,  "DELETE": 3 },
      temp: IPermissionChoose[] = [];

    permissions.forEach(permission => {
      const index = arrTemp[permission.type];
      temp[index] = permission as IPermissionChoose;
      temp[index].choose = false;
    })

    return temp;
  }
}
