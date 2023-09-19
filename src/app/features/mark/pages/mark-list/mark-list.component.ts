import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Mark } from 'src/app/core/models/mark.model';
import { HttpMarkService } from 'src/app/core/services/http-mark.service';

@Component({
  selector: 'app-mark-list',
  templateUrl: './mark-list.component.html',
  styleUrls: ['./mark-list.component.css']
})
export class MarkListComponent implements OnInit {

  marks?: Mark[];
 
  subsciptions = new Subscription();

  keyword: string = '';


  constructor(private httpMark: HttpMarkService, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.loadMarks();
  }

  ngOnDestroy(): void {
    this.subsciptions.unsubscribe();
  }

  loadMarks() {
    this.subsciptions.add(
      this.httpMark.getAllByStudent().subscribe(
        (marks: Mark[]) => {
          this.marks = marks; 
        })
    );
  }

  get filterMarks(): Mark[] {
    if (!this.marks) {
      return [];
    }
    const term = this.keyword.toLowerCase();
    return this.marks.filter(mark => (
      mark.exam.subject.name.toLowerCase().includes(term) ||
      mark.exam.examinationPeriod.name.toLowerCase().includes(term) ||
      mark.exam.examDate.toString().includes(term) ||
      mark.mark.toString().includes(term)
    ));
  }

}
