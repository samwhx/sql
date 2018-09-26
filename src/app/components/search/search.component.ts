import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { SearchService } from '../../services/search.service'; // service
import { MatSort, MatTableDataSource } from '@angular/material'; // sort

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  types = ['Title', 'Description', 'Both'];

  // for table
  displayedColumns: string[] = ['title', 'description', 'url'];
  films = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  searchCriteria = {
    'offset': 0,
    'limit': 5,
    'title': '',
    'description': ''
  };

  // validator checks called from html for reactive forms
  get type() { return this.searchForm.get('type'); }
  get term() { return this.searchForm.get('term'); }

  searchForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    type: new FormControl('', Validators.required),
    term: new FormControl('', Validators.required),
    });
  }

  constructor(private SearchSvc: SearchService) {
    this.searchForm = this.createFormGroup();
  }

  // reset button
  reset() {
    this.searchForm.reset();
  }

  // submit button
  onSubmit () {
    this.searchCriteria.offset = 0; // reinit
    this.searchCriteria.limit = 5; // reinit
    this.searchCriteria.title = ''; // reinit
    this.searchCriteria.description = ''; // reinit
    console.log('Form data: ', this.searchForm.value);
    if (this.searchForm.value.type === 'Title' ) {
    this.searchCriteria.title = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Description' ) {
      this.searchCriteria.description = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Both' ) {
      this.searchCriteria.title = `%${this.searchForm.value.term}%`;
      this.searchCriteria.description = `%${this.searchForm.value.term}%`;
    }
    console.log('Title:', this.searchCriteria.title, ', Description:', this.searchCriteria.description);
    this.SearchSvc.getFilms(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.films = results;
    });
    this.searchForm.reset(); // form reset
  }

  ngOnInit() {
    this.SearchSvc.getFilms(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.films = results;
      this.films.sort = this.sort;
    });
  }
}
