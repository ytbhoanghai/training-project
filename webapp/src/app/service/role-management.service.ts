import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import { SERVER_URL } from "../core/constants/api.constants";
import { catchError, map, tap } from "rxjs/operators";
import {IPermission, IPermissionChoose, IResource, IRole} from "../manager/role-management/role-management.component";

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  constructor(private httpClient: HttpClient) { }

  findAllRoles(): Observable<IRole[]> {
    return this.httpClient.get<IRole[]>(SERVER_URL + "/roles").pipe(
      tap(_ => console.log("find all roles")),
      catchError(err => {
        console.error(err);
        return of([]);
      })
    );
  }

  findRoleById(id: number): Observable<IRole> {
    return this.httpClient.get<IRole>(SERVER_URL + "/roles/" + id).pipe(
      tap( _ => console.log("find role by id " + id)));
  }

  deleteRoleById(id: number): Observable<string> {
    return this.httpClient.delete<any>(SERVER_URL + "/roles/" + id).pipe(
      tap(_ => console.log("delete role by id " + id)),
      map(value => value.message));
  }

  findAllResources(): Observable<IResource[]> {
    return this.httpClient.get<IResource[]>(SERVER_URL + "/resources").pipe(
      tap( _ => console.log("find all resources")),
      map(resources => {
        for (let i = 0; i < resources.length; i++) {
          resources[i].permissions = this.permissionListResolver(resources[i].permissions);
          resources[i].isCheckAllPermissions = false;
        }
        return resources;
      })
    )
  }

  private permissionListResolver(permissions: IPermission[]): IPermissionChoose[] {
    let arrTemp = { "CREATE": 0,  "READ": 1,  "UPDATE": 2,  "DELETE": 3 },
      temp: IPermissionChoose[] = [];

    permissions.forEach(permission => {
      let index = arrTemp[permission.type];
      temp[index] = permission as IPermissionChoose;
      temp[index].choose = false;
    })

    return temp;
  }
}
