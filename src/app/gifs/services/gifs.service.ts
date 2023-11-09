import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

/**
 * Para poder utilizar HttpClientModule, se debe inyectar en el constructor, previamente debo importalos en el modulo
 * principal o en el modulo del gifs en este caso lo agregue en el modulo principal porque en teoria se va a utilizar
 * esto en varia partes del sistema
 */

@Injectable({
  providedIn: 'root'
})

export class GifsService {

  public gifList: Gif[] = []

  private key = `PbTAnSEQ0K7PuSiya9MJ3B6uPuxfPOt9`
  private serviceURL = `https://api.giphy.com/v1/gifs/search`
  private _tagSearchHistory: string[] = []

  constructor(private http: HttpClient) {
    this.loadLocalHistory()
  }

  get tagSearchHistory() {
    return [...this._tagSearchHistory]
  }

  organizeTag(tag: string) {
    tag = tag.toLowerCase()
    if (this._tagSearchHistory.includes(tag)) {
      this._tagSearchHistory = this._tagSearchHistory.filter((oldItem) => oldItem !== tag)
    }

    this._tagSearchHistory.unshift(tag)
    this._tagSearchHistory = this._tagSearchHistory.slice(0, 10)//para que solo me acepte 10 valores pero hay otra forma de hacerlo
    this.saveLocalHistory()
  }

  private saveLocalHistory(): void {
    localStorage.setItem('history', JSON.stringify(this._tagSearchHistory))
  }

  private loadLocalHistory(): void {

    if (!localStorage.getItem('history')) { return }

    this._tagSearchHistory = JSON.parse(localStorage.getItem('history')!) ?? []

    if (this._tagSearchHistory.length === 0) { return }

    this.searchTag(this._tagSearchHistory[0])

  }

  async searchTagFetch(tag: string): Promise<void> {
    /**
     * Esta es la forma de trabajar con fetch pero angular ofrece otra alternativa mas poderosa que se llama HttpClientModule, permite agregar más herramientas que las que ofrece fetch */
    tag.length !== 0 ? this.organizeTag(tag) : null;
    const path = `https://api.giphy.com/v1/gifs/search?api_key=PbTAnSEQ0K7PuSiya9MJ3B6uPuxfPOt9&q=${tag}
    &limit=5&lang=es`
    const resp = await fetch(path)
    const data = await resp.json()
  }

  searchTag(tag: string): void {
    /**
     * Aquí utulizaremos el modulo HttpClientModule
     * La funcion no será async porque le modulo HttpClientModule trabaja con observables,
     * en este caso el observable solo buscara y valor y no monitorea cambios.
     * Pero debo suscribirme al observable para poder utilizarlo
     */

    /**
     * const path = `${this.path.url}&q=${tag}${this.path.limit}${this.path.lang}` esta forma esta correcta y funcionaria bien pero angular ofrece otra forma
     * console.log("🚀 ~ file: gifs.service.ts:59 ~ GifsService ~ searchTag ~ path:", path)
     this.http.get(path)
       .subscribe((resp) => {
         console.log(resp)
       })
     * mas optimizada

    */

    /**  Este codigo esta bien=this.http.get(this.serviceURL, { params: params }), pero en emacscript 6 cuando en una desesctructuracion los miembros de las
     * variables tienen el mismo nombre se puede dejas un solo nombre y el transpilador sabra que el lo que tiene que hacer por eso se puede hacer asi: en vez
     * de this.http.get(this.serviceURL, { params: params }) se puede dejar asi: this.http.get(this.serviceURL, { params }), si por el contrario fueran
     * diferentes tendria que dejar asi: this.http.get(this.serviceURL, { params: nombreParams }) para este caso del curso el instructor utilizo los mismos nombres
     */
    /**
     * Para este ejemplo necesitamos conocer la estructura de los datos que devuelve la api, para ello tomamos los resultados en json que nos devuelve
     * la res api y la transformamos en interfaces utilizando las herramientas de https://app.quicktype.io/ o la extension de https://quicktype.io,
     * Luego para efectos http.get, es un generico y  para indicarle los tipos de datos que se deben trabajar se hace referencia a la interface principal que
     * se creo la cual es SearchResponse

     */
    tag.length !== 0 ? this.organizeTag(tag) : null;
    const params = new HttpParams()//se crea un objeto de tipo parametro
      .set('api_key', this.key)
      .set('limit', '10')
      .set('q', tag)
    this.http.get<SearchResponse>(this.serviceURL, { params })
      .subscribe((resp) => {
        this.gifList = resp.data
      })

  }
}

/**
 * En este caso estamos creando un servicio y el @Injectable({providerIn:root}) indica que puede ser utilizado en cualquier parte de la app
 * sin necesidad de hacer referencia, si se desea que no sea global habria que importarlo en los modulos en la seccion provider
 * este servicio tiene que ser inyectado, y para lograrlo se realiza en el constructor de la clase donde se desea aplicar
 *  */
