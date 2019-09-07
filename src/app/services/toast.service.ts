import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

import { CustomToastComponent, GeneralToastData } from "../components/toast/toast.component";


@Injectable({ providedIn: "root" })
export class ToastService {
  constructor(private readonly snackbar: MatSnackBar) {}

  error(message: string) {
    this.snackbar.openFromComponent(CustomToastComponent, {
      data: { message, icon: "error" } as GeneralToastData,
      duration: -1,
      panelClass: "error-toast",
    });
  }

  warning(message: string) {
    this.snackbar.openFromComponent(CustomToastComponent, {
      data: { message, icon: "warning" } as GeneralToastData,
      duration: -1,
      panelClass: "warning-toast",
    });
  }

  success(message: string) {
    this.snackbar.openFromComponent(CustomToastComponent, {
      data: { message, icon: "check" } as GeneralToastData,
      duration: -1,
      panelClass: "success-toast",
    });
  }
}
