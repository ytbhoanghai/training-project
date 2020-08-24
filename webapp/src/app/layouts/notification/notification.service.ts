import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private options = {
    closeButton: true,
    timeOut: 2000,
    progressBar: true,
  };

  private quickToastOptions = {
    closeButton: true,
    timeOut: 500,
    progressBar: false,
  };

  constructor(private toastService: ToastrService) {}

  showSuccess(message?: string): void {
    this.toastService.success(
      message || 'Operation perform successfully!',
      '200 OK',
      this.options
    );
  }

  showQuickSuccess(message?: string): void {
    this.toastService.success(
      message || 'Operation perform successfully!',
      'Success',
      this.quickToastOptions
    );
  }

  showQuickWarning(message?: string): void {
    this.toastService.warning(
      message || 'Warning!',
      'Warning',
      this.quickToastOptions
    );
  }

  showWaring(message?: string): void {
    this.toastService.warning(
      message || 'Please check again!',
      'Warning',
      this.options
    );
  }

  showError401(message?: string): void {
    this.toastService.error(
      message || "You don't have permissions to do this action",
      '401 Unauthorized',
      this.options
    );
  }

  showError(message?: string): void {
    this.toastService.error(
      message || 'Something went wrong!',
      'Error',
      this.options
    );
  }
}
