import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/user';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ImageUploadServiceService } from 'src/app/services/image-upload-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userName: any;
  selectedFile: File | null = null;
  user!: User;
  imageSrc: string | undefined;
  imageSrc2: string | undefined;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authService: UserAuthService,
    private imageUploadService: ImageUploadServiceService
  ) {}

  ngOnInit(): void {
    this.getUserName()
   
  }

  getUser(userName: string) {
    this.userService.findUserByUserName(userName).subscribe((data: User) => {
      this.user = data;
      this.cdr.detectChanges();
      const userImage = this.user.image
      if(userImage){
      this.userService.getImage(userImage).subscribe(blob=>{
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageSrc2 = reader.result as string;
        };
        reader.readAsDataURL(blob);
      })
    }
    });
    
  }
  getUserName() {
    this.userName = this.authService.getUserName();
    
    if (this.userName != null) {
      this.getUser(this.userName);
    }
   
    // console.log(this.user.userFirstName)
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  uploadImage() {
    if (this.selectedFile) {
      this.imageUploadService
        .uploadImage(this.selectedFile, this.userName)
        .subscribe({
          next: (response) => {
            Swal.fire('Upload succcess!!', 'ok');
            console.log('Response Body:', response.body); // Log the response body

            console.log('full response: ', response);
          },
        });
    }
  }
  

  getImage(){

  }

}
