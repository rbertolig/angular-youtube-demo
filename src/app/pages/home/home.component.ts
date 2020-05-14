import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { Video } from '../../models/youtube.models';

// para manejar ventana emergente con reproduccion del video ( npm i sweetlert2 )
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videos: Video[] = [];  // array para guardar los videos consultados a la API
  playList = 'PLzh9EDVQms3aQRWNBLIYNAwz4Ym2K0rqV'; // playlist deseado
  videosPorPagina = 12;    // cantidad de videos a mostrar por pagina

  constructor( private youtubeService: YoutubeService ) { }

  ngOnInit(): void {
    // cargar videos
    this.cargarVideos();
  }

  cargarVideos(){
        // llamar al servicio de videos
        this.youtubeService.getVideos( this.playList, this.videosPorPagina)
        .subscribe(videos => {
          // añadir los videos obtenidos array 'videos' para usar en html
          // esta sintaxis del push expande el array cada vez que llega aqui
          // no reemplaza los elementos anteriores que ya tenia el array
          this.videos.push(...videos);
          console.log(this.videos);

        });

  }

  playVideo( video: Video ){
    console.log(video);
    Swal.fire({
      html:`
      <h4>${video.title}</h4>
      <iframe width="100%" height="315"
          src="https://www.youtube.com/embed/${video.resourceId.videoId}"
          frameborder="0" allow="accelerometer; autoplay;
          encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
      </iframe>
      `
    })

  }

}
