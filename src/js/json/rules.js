const rulesJson = {
	"SimpleRules":
		{
			"Button":
				[{ "Locator": "button[type=submit]", "uniqness": "text", "id": 0 }], "CheckBox":
				[{ "Locator": "input[type=checkbox]", "id": 0, "uniqness": "name" }], "Image":
				[{ "Locator": "img", "id": 0, "uniqness": "id" }], "Label":
				[{ "Locator": "h1", "id": 0, "uniqness": "name" }, {
					"Locator": "h2",
					"id": 1,
					"uniqness": "name"
				}, { "Locator": "h3", "id": 2, "uniqness": "name" }, {
					"Locator": "[ui=label]",
					"id": 3,
					"uniqness": "text"
				}], "Link":
				[{ "Locator": "", "uniqness": "", "id": 0 }], "Text":
				[{ "Locator": ".main-txt", "id": 0, "uniqness": "name" }], "TextField":
				[{ "Locator": "input[type=text]", "id": 0, "uniqness": "id" }, {
					"Locator": "input[type=password]",
					"id": 1,
					"uniqness": "id"
				}], "TextArea":
				[{ "Locator": "textarea", "id": 0, "uniqness": "id" }], "DataPicker":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "FileInput":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "Selector":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "CheckList":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "Menu":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "RadioButtons":
				[{ "Locator": "", "id": 0, "uniqness": "" }], "Tabs":
				[{ "Locator": "", "id": 0, "uniqness": "" }]
		}
	,
	"ComplexRules":
		{
			"Dropdown":
				[{
					"Root": "div[ui=dropdown]",
					"uniqness": "id",
					"Value": ".filter-option",
					"List": "li",
					"Expand": ".caret",
					"id": 0
				}, { "Root": "select[ui=dropdown]", "uniqness": "id", "Value": "", "List": "", "Expand": "", "id": 1 }],
			"ComboBox":
				[{
					"Root": "div[ui=combobox]",
					"uniqness": "id",
					"Value": "input",
					"List": "li",
					"Expand": ".caret",
					"id": 0
				}, { "Root": "select[ui=combobox]", "uniqness": "id", "Value": "", "List": "", "Expand": "", "id": 1 }],
			"DropList":
				[{
					"Root": "div[ui=droplist]",
					"uniqness": "id",
					"Value": "button",
					"List": "li",
					"Expand": ".caret",
					"IsSelected": "././/input",
					"id": 0
				}],
			"Table":
				[{
					"Root": "table",
					"Header": "",
					"RowHeader": "",
					"Cell": "",
					"Column": "",
					"Row": "",
					"Footer": "",
					"id": 0,
					"uniqness": "class"
				}],
			"DynamicTable":
				[{
					"Root": "",
					"Header": "",
					"RowHeader": "",
					"Cell": "",
					"Column": "",
					"Row": "",
					"Footer": "",
					"id": 0,
					"uniqness": "class"
				}]
		}
	,
	"CompositeRules":
		{
			"Section":
				[{ "Locator": ".section", "id": 0, "uniqness": "class" }, {
					"Locator": "header",
					"id": 1,
					"uniqness": "tag"
				}, { "Locator": "footer", "id": 2, "uniqness": "tag" }, {
					"Locator": ".uui-side-bar",
					"id": 3,
					"uniqness": "name"
				}, { "Locator": ".main-form", "id": 4, "uniqness": "tag" }], "Form":
				[{ "Locator": "form", "id": 0, "uniqness": "id" }]
		}
};

export default rulesJson;
