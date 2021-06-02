import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { CreateMaterialFormType } from "./create-material-form.type";
import { CreateMaterialPageStore } from "./create-material-page.store";

@Component({
	selector: "cook-book-create-material-page",
	templateUrl: "create-material-page.component.html",
	styleUrls: ["./create-material-page.component.scss"],
	providers: [CreateMaterialPageStore],
})
export class CreateMaterialPageComponent {
	form = new FormGroup({});
	model: CreateMaterialFormType = {
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
				placeholder: "Název materiálu",
			},
		},
		{
			key: "unit",
			type: "input",
			className: "p-col-12",
			templateOptions: {
				// translate: true,
				placeholder: "Jednotka",
			},
		},
	];

	@Output() formSubmit = new EventEmitter<CreateMaterialFormType>();

	constructor(public createMaterialPageStore: CreateMaterialPageStore) {}

	onFormSubmit(model: CreateMaterialFormType) {
		console.log(model);
		if (this.form.valid) {
      console.log(model);
			this.createMaterialPageStore.postData(
				JSON.parse(JSON.stringify(model)) as CreateMaterialFormType
			);
		}
	}
}