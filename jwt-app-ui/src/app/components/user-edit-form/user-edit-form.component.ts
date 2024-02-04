import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ImageUploadServiceService } from 'src/app/services/image-upload-service.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.css'],
})
export class UserEditFormComponent implements OnInit {
  @Input() user!: User;
  @Output() toggleEdit:EventEmitter<boolean> = new EventEmitter()
  imageSrc!: string;
  imageSrcUpload: string | undefined;
  selectedFile: File | null = null;

  editedUser!: User | null;

  ngOnInit(): void {
    this.getImage()
  }
  constructor(
    private userService: UserService,
    private adminService: AdminServiceService,
    private imageService: ImageUploadServiceService,
  ) {}

  handleEdit() {}
  userReciever(user: User) {}

  updateUser() {
    this.userService.updateUser(this.user).subscribe({
      next:(updatedUser)=>{
        console.log('update success',updatedUser)
        Swal.fire('updated successfully',"OK");
        this.closeEdit()
      },
      error:(error)=>{
        console.error(error)
        Swal.fire("oops","ok")
      }
  })
  }
  onFileSelected(event:any){

    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrcUpload = reader.result as string;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  uploadImage(){
    if(this.selectedFile){
      this.imageService.uploadImage(this.selectedFile,this.user.userName).subscribe({
        next:(response)=>{
          Swal.fire("image uploaded successfully");
          this.refreshUserAfterUpdate();
          console.log(response.body);
          this.selectedFile = null
        }
      })
    }
  }
  refreshUserAfterUpdate(){
    this.userService.findUserByUserName(this.user.userName).subscribe((response)=>{
      this.user = response;
      this.getImage()
    })
    console.log('refreshed')
  }

  getImage(){
    const userImage = this.user.image;
    if (userImage) {
      this.userService.getImage(userImage).subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageSrc = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
    } else {
      this.imageSrc = '../../../assets/defaultuser.png';
    }
  }
  closeEdit(){
    this.toggleEdit.emit(true);
  }
}
