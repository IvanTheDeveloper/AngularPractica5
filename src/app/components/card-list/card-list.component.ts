import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  list: any[]

  constructor() {
    this.list = [new item('HELLO', true), new item('HELLO', true), new item('HELLO', true), new item('BYE', false)]
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  paginatedFugitives!: any[]
  pageSize: number = 4
  pageIndex: number = 0

  //filtro
  page: any = 1
  sex!: string
  ageMin!: any
  ageMax!: any
  hair!: string
  eyes!: string

  ngOnInit(): void {
    this.getListData()
  }

  getListData() {
    this.page = this.page ?? ''
    this.sex = this.sex ?? ''
    this.ageMin = this.ageMin ?? ''
    this.ageMax = this.ageMax ?? ''
    this.hair = this.hair ?? ''
    this.eyes = this.eyes ?? ''

    /*this.dataSource.getFugitivesByFilter(this.page, this.sex, this.ageMin, this.ageMax, this.hair, this.eyes).subscribe(data => {
      this.fugitiveList = data.items
      this.paginateFugitives()
    })*/
  }

  paginateList(): void {
    const startIndex = this.pageIndex * this.pageSize
    this.paginatedFugitives = this.list.slice(startIndex, startIndex + this.pageSize)
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.paginateList()
  }

  applyFilter() {
    this.getListData() //refrescar los datos
    this.pageIndex = 0
    this.paginator.pageIndex = 0
  }

  resetFields() {
    this.page = 1
    this.sex = ''
    this.ageMin = ''
    this.ageMax = ''
    this.eyes = ''
    this.hair = ''
    /* por esto uso 'any' en vez de 'number' para el tipo de variable,
    la api puede pillar los campos vacíos y devolver una respuesta como si no se hubiesen usado parámetros sin dar error */
  }

}

class item {
  constructor(public name: string, public show: boolean) { }
}
