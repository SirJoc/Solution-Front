import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  animal: string = "";
  name: string = "";
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNoMessage, {
      width: '250px',
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


@Component({
  selector: 'dialog/dialog-no-message',
  templateUrl: 'dialog/dialog-no-message.html',
})
export class DialogNoMessage {
  constructor(
    public dialogRef: MatDialogRef<DialogNoMessage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
