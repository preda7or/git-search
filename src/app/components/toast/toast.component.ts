import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

export interface GeneralToastData {
  icon: string;
  message: string;
}

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class CustomToastComponent {
  constructor(
    private readonly dialogRef: MatSnackBarRef<CustomToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: GeneralToastData
  ) {}

  onClose() {
    this.dialogRef.dismiss();
  }
}
