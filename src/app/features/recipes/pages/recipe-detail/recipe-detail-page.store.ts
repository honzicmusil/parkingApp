import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";

import { Observable, of } from "rxjs";
import {
	catchError,
	exhaustMap,
	map,
	tap,
	withLatestFrom,
} from "rxjs/operators";

import { selectRouteParam } from "src/app/root.state";
import { ToastActions } from "src/app/features/toasts";
import { Material, Recipe } from "src/app/features/models";
import { RecipesService } from "src/app/features/api-services/recipes.service";
import { MaterialService } from "src/app/features/api-services/meterials.service";
import { httpError } from "src/app/features/helper";

export interface RecipeDetailPageState {
	data: Recipe | undefined | null;
	materials: Material[] | undefined | null;
	loading: boolean;
	editMode: boolean;
}

@Injectable()
export class RecipeDetailPageStore extends ComponentStore<RecipeDetailPageState> {
	constructor(
		protected store$: Store<never>,
		private service: RecipesService,
		private materialService: MaterialService
	) {
		super({
			data: null,
			loading: false,
			materials: [],
			editMode: false,
		});
	}

	readonly loading$ = this.select((state) => state.loading);

	readonly data$ = this.select((state) => state.data);
	readonly materials$ = this.select((state) => state.materials);
	readonly combineddata$ = this.select((state) => {
		const { data, materials } = state;
		if (data && materials)
			return {
				...data,
				materials: data.materials.map((p) => ({
					...p,
					material: materials.find((k) => k.id == (p["material"] as unknown)),
				})),
			};
		else {
			return null;
		}
	});
	readonly editMode$ = this.select((state) => state.editMode);
	readonly editNonMode$ = this.select((state) => !state.editMode);

	public readonly requesting = this.updater((state) => ({
		...state,
		loading: true,
	}));

	public readonly requestFinished = this.updater((state) => ({
		...state,
		loading: false,
	}));

	private readonly updateData = this.updater((state, input: Recipe) => ({
		...state,
		data: input,
	}));

	private readonly updateMaterialData = this.updater(
		(state, input: Material[]) => ({
			...state,
			materials: input,
		})
	);

	readonly toggleEditMode = this.updater((state) => ({
		...state,
		editMode: !state.editMode,
	}));

	readonly init = this.effect((input: Observable<unknown>) => {
		return input.pipe(
			tap(() => this.fetchMaterialData()),
			tap(() => this.fetchData())
		);
	});

	readonly fetchMaterialData = this.effect((input: Observable<never>) => {
		return input.pipe(
			tap(() => this.requesting()),
			exhaustMap(() =>
				this.materialService.getAll().pipe(
					map((data) => {
						if (data.error) throw data;
						else if (data.itemList) this.updateMaterialData(data.itemList);
					}),
					tap(() => this.requestFinished()),
					catchError((p) => httpError(this.store$, p))
				)
			)
		);
	});

	readonly fetchData = this.effect((input: Observable<never>) => {
		return input.pipe(
			withLatestFrom(this.store$.pipe(select(selectRouteParam("id")))),
			tap(() => this.requesting()),
			exhaustMap(([p, id]) =>
				this.service.get(id).pipe(
					map((data) => {
						if (data.error) throw data;
						else if (!data.error) {
							this.updateData(data);
						}
					}),
					tap(() => this.requestFinished()),
					catchError((p) => httpError(this.store$, p))
				)
			)
		);
	});

	readonly editData = this.effect((input: Observable<Omit<Recipe, "id">>) => {
		return input.pipe(
			tap(() => this.requesting()),
			exhaustMap((p) =>
				this.service.put(p).pipe(
					map((data) => {
						if (data.error) throw data;
						else if (!data.error) {
							this.store$.dispatch(
								ToastActions.showToast({
									message: {
										severity: "success",
										summary: "Saved",
										detail: `${data.name} was updated`,
									},
								})
							);
							this.updateData(data);
						}
					}),
					tap(() => this.requestFinished()),
					catchError((p) => httpError(this.store$, p))
				)
			)
		);
	});
}
