import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { EditMaterialFormType } from "./edit-material-form.type";

@Component({
	selector: "cook-book-edit-material-form",
	templateUrl: "edit-material-form.component.html",
	styleUrls: ["./edit-material-form.component.scss"],
})
export class EditMaterialFormComponent {
	form = new FormGroup({});
	model: EditMaterialFormType = {
		name: "",
		unit: "",
	};
	options: FormlyFormOptions = {};
	fields: FormlyFieldConfig[] = [
		{
			key: "name",
			type: "input",
			className: "p-col-12",
			templateOptions: {
				// translate: true,
				placeholder: "Name of the material",
        maxLength: 30
			},
		},
		{
			key: "unit",
			type: "input",
			className: "p-col-12",
			templateOptions: {
				// translate: true,
				placeholder: "Unit",
        maxLength: 10
			},
		},
	];

	@Input() set data(value: EditMaterialFormType) {
		this.model = JSON.parse(JSON.stringify(value));
	}

	@Output() formSubmit = new EventEmitter<EditMaterialFormType>();

	onFormSubmit(model: EditMaterialFormType) {
		if (this.form.valid) {
			this.formSubmit.emit(
				JSON.parse(JSON.stringify(model)) as EditMaterialFormType
			);
		}
	}
}
