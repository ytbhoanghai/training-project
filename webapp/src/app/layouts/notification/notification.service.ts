import {Injectable} from '@angular/core';
import {ToastService} from "ng-uikit-pro-standard";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private options: object = {
    opacity: 0.6,
    closeButton: true,
    timeOut: 2000,
    progressBar: true
  }


  constructor(private toastService: ToastrService) {
  }

  showSuccess(message?: string): void {
    this.toastService.success(message || "Operation perform successfully!", "200 OK", this.options);
  }

  showError401(message?: string): void {
    this.toastService.error(message || "You don't have permissions to do this action", "401 Unauthorized", this.options);
  }
}
