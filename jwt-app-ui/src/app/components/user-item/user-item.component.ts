import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
})
export class UserItemComponent implements OnInit {
  @Input() user!: User;
  @Output() onEdit: EventEmitter<User> = new EventEmitter();
  @Output() afterEdit: EventEmitter<any> = new EventEmitter();

  isEditing: boolean = false;
  editingUser: User | null = null;
  imageSrc: string | undefined;

  faTimes = faTimes;
  faEdit = faEdit;

  constructor(
    private adminService: AdminServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
  onEditUser(user: User) {
    this.isEditing = !this.isEditing;
    this.editingUser = this.isEditing ? user : null;
  }
  closeEdit(event:boolean){
    this.isEditing = !this.isEditing;
    this.afterEdit.emit(this.user);
    console.log('hi there')
  }
  close(){
    this.isEditing = !this.isEditing
  }

  deleteUser(){
    Swal.fire({
      title:`Are you sure you want to delete ${this.user.userName}`,
      text:'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(
      (result)=>{
        this.adminService.deleteUser(this.user.userName).subscribe({
          next:(response) =>{
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            this.afterEdit.emit(this.user)
          },
          error:(error) => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'There was an error deleting the user.', 'error');
          }
        })
      }
    )
  }
}
