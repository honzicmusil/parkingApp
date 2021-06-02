import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { EditMaterialFormType } from './edit-material-form.type';

@Component({
  selector: 'cook-book-edit-material-page',
  templateUrl: 'edit-material-page.component.html',
  styleUrls: ['./edit-material-page.component.scss'],
})
export class EditMaterialPageComponent {
  form = new FormGroup({});
  model: EditMaterialFormType = {
    name: "",
    unit: ""
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
      {
        key: 'name',
        type: 'input',
        className: 'p-col-12',
        templateOptions: {
          // translate: true,
          placeholder: 'Název materiálu',
        },
      },
      {
        key: 'unit',
        type: 'input',
        className: 'p-col-12',
        templateOptions: {
          // translate: true,
          placeholder: 'Jednotka',
        },
      },
  ];

  @Output() formSubmit = new EventEmitter<EditMaterialFormType>();

  onFormSubmit(model: EditMaterialFormType) {
    if (this.form.valid) {
      this.formSubmit.emit(
        JSON.parse(JSON.stringify(model)) as EditMaterialFormType
      );
    }
  }
}
