import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {NgForm} from "@angular/forms";
import {ClothsApiService} from "../../services/cloth-api.service";
import {Router} from "@angular/router";
import {Cloth} from "../../models/cloth";
// @ts-ignore
import * as _ from 'lodash';

@Component({
  selector: 'app-cloth',
  templateUrl: './cloth.component.html',
  styleUrls: ['./cloth.component.css']
})
export class ClothComponent implements OnInit {
  displayedColumns: string[] = ['id', 'marca', 'color', 'actions'];
  clothData: Cloth;
  dataSource = new MatTableDataSource();
  isFiltering = false;
  @ViewChild('clothForm', { static: false }) clothForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  imagen_src = "";
  isInfoMode = false;
  isEditMode = false;
  isCreateMode = true;
  c_cloths = [
    {value: 'Rosa', viewValue: "Rosa", type: "jpeg"},
    {value: 'Azul', viewValue: "Azul", type: "jpg"},
    {value: 'Verde', viewValue: "Verde", type: "jpeg"}
  ];



  constructor(private clothsApi: ClothsApiService, private router: Router) {
    this.clothData = {} as Cloth;
  }

  ngOnInit(): void {
    this.getAllCloth();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.isFiltering = !!filterValue;
  }

  getAllCloth(): void {
    this.clothsApi.getAllCloths().subscribe((response: any) => {
      this.dataSource.data = response;
      console.log(this.dataSource.data);
    })
  }

  addCloth(): void {
    const newCloth = {brand: this.clothData.brand, color: this.clothData.color};

    this.clothsApi.addCloth(newCloth).subscribe((response: any) => {
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map(o => o);
    });
  }

  deleteItem(id: number): void {
    this.clothsApi.deleteCloth(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((o: any) => {
        return o.id !== id ? o : false;
      });
    });
    console.log(this.dataSource.data);
  }

  updateCloth(): void {
    this.clothsApi.updateCloth(this.clothData.id, this.clothData)
      .subscribe((response: Cloth) => {
        this.dataSource.data = this.dataSource.data.map((o: any) => {
          if (o.id === response.id) {
            o = response;
          }
          return o;
        });
        this.cancelEdit();
      });
  }

  editItem(element: any): void {
    console.log(element);
    this.clothData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.isInfoMode = false;
    this.clothForm.resetForm();
  }

  onSubmit(): void {
    if (this.clothForm.form.valid) {
      if (this.isEditMode) {
        this.updateCloth();
      } else {
        this.addCloth();
      }
    } else {
      console.log('Invalid Data');
    }
  }

  infoItem(element: any): void {
    console.log(element);
    this.clothData = _.cloneDeep(element);
    this.isInfoMode = true;
    if (element.clothData.color == "Rosa"){
      this.imagen_src="/assets/cloths/rosa.jpeg";
    }else if (element.clothData.color == "Azul"){
      this.imagen_src="/assets/cloths/azul.jpg";
    }else if (element.clothData.color == "Verde"){
      this.imagen_src="/assets/cloths/verde.jpeg";
    }else{
      this.isInfoMode = false;
    }
  }
}


