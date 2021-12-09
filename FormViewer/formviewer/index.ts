import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { FieldForm } from "./utilities/interfaces";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class formviewer implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _context: ComponentFramework.Context<IInputs>;
	private _container: HTMLDivElement;
	private _dataset: ComponentFramework.PropertyTypes.DataSet;
	private _recordid: any;
	/**
	 * Empty constructor.
	 */
	constructor()
	{
		
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
	{
		// Add control initialization code
		this._context = context;
		this._container = container;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._dataset = context.parameters.sampleDataSet;
		
		const columns = this._dataset.columns;
		// Get first record in my dataset
		const record:any = this._dataset.sortedRecordIds.length != 0 ? Object.values(this._dataset.records)[0] : null;
		this._recordid = record ? record.getRecordId() : null;
		// Get all the fields from the view
		let arrayFields: FieldForm[] = [];
		// Creating a new array with the columns name/ displayname and datatype
		arrayFields = columns.map(column => {
			return {
				DisplayName: column.displayName,
				Name: column.name,
				DataType: column.dataType
			}
		})

		const form = this._container.querySelector('#form');
		if(form != null) {
			this._container.removeChild(form);
		}
		this.createForm(arrayFields, record);

	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		document?.querySelector("#buttonUpdater")?.removeEventListener("click", this.updateRecord);
	}

	private createForm(arrayFields: FieldForm[], record: DataSetInterfaces.EntityRecord): void {
		//Create div that will store all the fields
		const form = document.createElement("div");
		
		form.setAttribute("id", "form");
		
		for(const field of arrayFields) {
			const fieldValue = record ? record.getFormattedValue(field.Name) : "";
			//Create div that will store each field
			const divField = document.createElement("div");

			divField.classList.add("flex-div")
			//Create label for each field
			const label = document.createElement("label");
			label.innerHTML = field.DisplayName;
			//Create input for each field
			const input = document.createElement("input");
			input.classList.add("input-field");
			input.setAttribute("type", field.DataType);
			input.setAttribute("name", field.Name);
			input.value = fieldValue;
			//Append label and input to divField
			divField.appendChild(label);
			divField.appendChild(input);
			//Append divField to form
			form.appendChild(divField);
		}
		//Append form to container
		const button = document.createElement("button");
		button.setAttribute("id","buttonUpdater");
		button.innerHTML = "Update record";
		button.addEventListener("click", this.updateRecord);
		form.appendChild(button);
		this._container.appendChild(form);
	}

	private updateRecord = (): void => {

		//Update element
		const form: any = this._container.querySelector('#form');
		var data: any = { }
		form.querySelectorAll('.input-field').forEach((element: any) => {
			const attribute: any = element.getAttribute("name");
			data[attribute] = element.value;
		})

		this._context.webAPI.updateRecord(this._dataset.getTargetEntityType(), this._recordid, data)
		.then(() => {
			alert("Record updated successfully");
		}, (error) => {
			alert("Error updating record - " + error.message);
		})
	}

}
