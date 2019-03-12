import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlbumService } from '../../album.service';
import { Album } from '../../album';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-album',
  templateUrl: './update-album.component.html',
  styleUrls: ['./update-album.component.scss']
})
export class UpdateAlbumComponent implements OnInit {
    album: Album;
    updateFormAlbum: FormGroup;
    id: string;
    selectedImage: File = null;

    constructor(
        private route: ActivatedRoute,
        private aS: AlbumService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id'); // id dans l'url

        this.initUpdateForm(); // initialisation du formulaire 

        // mise à jour du formulaire après l'instanciation de ce dernier
        this.aS.getAlbum(this.id).subscribe(album => {
            // on récupère l'instance du formulaire et on met à jour les champs du formulaire
            // avec la méthode patchValue du formGroup
            this.album = album;
            this.updateFormAlbum.patchValue(album);
        }
        );
    }

    initUpdateForm() {
        this.updateFormAlbum = this.fb.group({
            name: new FormControl('', [
            Validators.required,
            Validators.minLength(5)
            ]),
            title: new FormControl('', [
            Validators.required
            ]),
            ref: new FormControl('', [
            Validators.required,
            Validators.pattern('\\w{5}')
            ]),
            duration: new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]*'),
            Validators.max(900)
            ]),
            description: new FormControl('', [
            Validators.required
            ]),
            status: 'off',
            id: 0,
        });
    }
    
    // getter pour la validation dans le formulaire errors
    get name() { return this.updateFormAlbum.get('name'); }
    get title() { return this.updateFormAlbum.get('title'); }
    get ref() { return this.updateFormAlbum.get('ref'); }
    get duration() { return this.updateFormAlbum.get('duration'); }

    onSubmit() {
        let album: Album;
        album = this.updateFormAlbum.value;
        album.id = this.id;

        /**
        * @todo observer methods next and error 
        */
        this.aS.updateAlbum(album.id, album).subscribe(
            /*() => {
                this.router.navigate(['/admin'], { queryParams: { message: 'success updated resource' } });
            }*/

            a => { 
                if (this.selectedImage != null) {
                    //a.name || 'anonymous';
                    this.aS.deleteAlbumImage(this.album);
                    this.aS.uploadFile(this.selectedImage)
                        .then(
                            snapshot => {
                                return snapshot.ref.getDownloadURL()
                            }
                        )
                        .then(url => {
                            album.url = url;
                            this.aS.updateAlbum(album.id, album).subscribe(
                                () => {
                                    console.log('updated with url image', album.url)
                                }
                            );
                        }
                    )
                    .catch(error => console.log(error))
                }
            },
            error => console.error(error),
            () => {
                this.router.navigate(
                    ['admin'], 
                    { queryParams: { message:'success'} }
                );
            }
        )
    }


    onSelectedImage(event) {
        this.selectedImage = <File>event.target.files[0];
        console.log(this.selectedImage);
    }
}
