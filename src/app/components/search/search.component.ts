import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { SearchService } from '../../services/search.service'; // service

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  types = ['Title', 'Description', 'Both'];

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
    console.log ('Form data: ', this.searchForm.value);
    this.SearchSvc
      .submitForm(this.searchForm.value)
      .subscribe((result) => {
        console.log(result);
      });
  }

  ngOnInit() {
  }

}
