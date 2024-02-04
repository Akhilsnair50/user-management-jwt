import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/user';
import { ChangeDetectorRef } from '@angular/core';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  faTimes = faTimes;
  faEdit = faEdit;

  userList: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  isSearching: boolean = true;


  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private adminService:AdminServiceService,
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.userList = data;
      this.filteredUsers =data;
      // Manually trigger change detection
      this.cdr.detectChanges();
    });
  }

  searchUsers() {
    this.filteredUsers = this.userList.filter((user) =>
      user.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  refreshData(event:any){
    this.getUsers()
  }

}
