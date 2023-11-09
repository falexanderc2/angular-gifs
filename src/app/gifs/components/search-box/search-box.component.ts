import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <input type="search"
      class="form-control"
      placeholder="Buscar gifs..."
      #txtSearch
      (keyup.enter)="searchGifs()"
    />
  `,

})

/**
 * #txtSearch: es una referencia local, angular permite utilizar esta referencia a un elemento para solo este ambito del componente
 *   existe otra forma de realizar una referencia local que permite simplificar el código, y se realiza con viewchild,
 *   el viewchild, permite realizar una referencia local a un elemento
 * en la clase SearchBoxComponent se debe llamar al servicio ./services/gifs.servics.ts y para ello hay que inyectarlo en el constructor
 * de la clase
*/

export class SearchBoxComponent {

  @ViewChild('txtSearch')
  txtSearch!: ElementRef<HTMLInputElement>

  constructor(private gifsService: GifsService) { }

  searchGifs(): void {
    const value = this.txtSearch.nativeElement.value
    this.gifsService.searchTag(value)
    this.txtSearch.nativeElement.value = ''
  }

}
