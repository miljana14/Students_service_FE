import { NavigationEnd, Router } from '@angular/router';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';
import { Student, Professor, Subject } from 'src/app/core/models';
import { User } from 'src/app/core/models/user.model';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpStudentService } from 'src/app/core/services/http-student.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showMenu: boolean = false;
  userRole: string | null = null;
  showSettingsMenu: boolean = false;
  students?: Student[];
  professors?: Professor[];
  users?: User[];
  student?: Student;
  professor?: Professor;
  user?: User;
  currentLanguage = 'en';

  private _userAuthority: any;

  @Input() set userAuthority(value: any) {
    this._userAuthority = value;
  }
  
  get userAuthority() {
    return this._userAuthority || (this.userLoginData?.userLoginData?.authorities[0].authority);
  }

  @Output() languageChange = new EventEmitter<string>();
  @Output() menuClosed  = new EventEmitter<void>();
  @Output() openMenu = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private httpStudent: HttpStudentService, private httpProfessor: HttpProfessorService, public userLoginData: UserLoginDataService, private router: Router, private elementRef: ElementRef) {
    const user = this.userLoginData.userLoginData;
    this.userRole = user ? user.authorities[0].authority : null;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = false;
      }
    });
   }

  ngOnInit(): void {
    this.loadStudents();
    this.loadProfessors();
   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userLoginData'] && changes['userLoginData'].currentValue) {
      this._userAuthority = changes['userLoginData'].currentValue.userLoginData?.authorities[0].authority;
    }
  }

  onLanguageChange(language: string) {
    this.currentLanguage = language;
    this.languageChange.emit(this.currentLanguage);
  }

  logout(){
    this.userLoginData.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.openMenu.emit();
    } else {
      this.closeMenu.emit();
    }
  }

  hideMenu() {
    this.elementRef.nativeElement.querySelector('.overlay')?.classList.remove('show'); 
    this.showMenu = false;
    this.menuClosed.emit();
  }

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
    if (this.showSettingsMenu) {
      if (this.userAuthority === 'ROLE_STUDENT') {
        this.loadStudents();
        this.openMenu.emit();
      }
      else if (this.userAuthority === 'ROLE_PROFESSOR') {
        this.loadProfessors();
        this.openMenu.emit();
      }
    } else {
      this.closeMenu.emit();
    }

  }
  
  hideSettingsMenu() {
    this.elementRef.nativeElement.querySelector('.overlay')?.classList.remove('show'); 
    this.showSettingsMenu = false;
    this.menuClosed.emit();
  }

  loadStudents() {
    this.httpStudent.getAll().subscribe((students: Student[]) => {
      this.students = students;
      if (this.userAuthority === "ROLE_STUDENT") {
        this.student = this.students?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);
  
      }
    });
  }

  loadProfessors() {
    this.httpProfessor.getAll().subscribe((professors: Professor[]) => {
      this.professors = professors;
      if (this.userAuthority === "ROLE_PROFESSOR") {
        this.professor = this.professors?.find((loginData) => loginData.username === this.userLoginData?.userLoginData?.username);
    
      }
    });
  }

}
