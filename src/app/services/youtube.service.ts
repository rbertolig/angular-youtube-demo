import { Injectable } from '@angular/core';

// HttpClient para peticiones http
import { HttpClient, HttpParams } from '@angular/common/http';

// mi modelo de datos para respuesta del API contruida en models con
// heramienta detipado https://app.quicktype.io/
import { YoutubePlaylistData } from '../models/youtube.models';
// importar environment para usar api key protegida alli
import { environment } from '../../environments/environment';
// importar el operador map para extrer la repuesta con pipe
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  // definir propiedades del servicio
  private youtubeUrl    = 'https://www.googleapis.com/youtube/v3';
  public playlist       = 'UUuaPTYj15JSkETGnEseaFFg';
  private nextPageToken = '';
  private maxResults    = 10;


  constructor(  private http: HttpClient ) { }

  // metodo para obtener lista de videos
  // recibe el PlaylistId y MaxResult / query
  getVideos( playlist: string, maxresults: number ) {
    // conformar url del end-point de la API de youtube para playlists
    const url = `${this.youtubeUrl}/playlistItems`;
    // conformar parametros para el query http
    // ej: url/playlistItems?part=snippet&key=mi-api-key&playlistId=UUuaPTYj15JSkETGnEseaFFg&maxResults=10
    const params = new HttpParams()
          .set( 'part', 'snippet' )
          .set( 'key', environment.apikey )
          .set( 'playlistId', playlist )
          .set( 'pageToken', this.nextPageToken )
          .set( 'maxResults', String(maxresults));

    // retornamos la peticion para usar el metodo de forma asincrona con suscribe
    return this.http.get<YoutubePlaylistData>( url, { params } )
                      .pipe(
                        // mapear el contenido que nos interesa de la respuesta
                         map( resp => {
                            // aprovecho y extraigo el nextpageToken a mi propiedad
                            this.nextPageToken = resp.nextPageToken;
                            return resp.items; // este map retorna un array de 'items'
                          }),
                          // anido otro map para extraer en un array solo el campo videos de cada 'item'
                          // esto filtra la respuesta del map anterior
                          map( items => {
                            return items.map( video => video.snippet);
                          })

                          );

  }

}
