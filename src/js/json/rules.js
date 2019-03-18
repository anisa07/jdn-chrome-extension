const rulesJson = {
	"ListOfSearchAttributes": ['id', 'class'],
	"SimpleRules":
		{
			"Button":
				[{ "Locator": "button[type=submit]", "uniqness": "text", "id": 0 }],
			"Checkbox":
				[{ "Locator": "input[type=checkbox]", "id": 0, "uniqness": "name" }],
			"Image":
				[{ "Locator": "img", "id": 0, "uniqness": "id" }],
			"Title":
				[{ "Locator": "h1", "id": 0, "uniqness": "name" },
					{ "Locator": "h2", "id": 1, "uniqness": "name" },
					{ "Locator": "h3", "id": 2, "uniqness": "name" }
				],
			"Link":
				[{ "Locator": "", "uniqness": "", "id": 0 }],
			"Text":
				[{ "Locator": ".main-txt", "id": 0, "uniqness": "name" }],
			"TextField":
				[{ "Locator": "input[type=text]", "id": 0, "uniqness": "id" },
					{ "Locator": "input[type=password]", "id": 1, "uniqness": "id" }
				],
			"TextArea":
				[{ "Locator": "textarea", "id": 0, "uniqness": "id" }],
			"DataPicker":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"FileInput":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"Selector":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"CheckList":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"RadioButtons":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"Tabs":
				[{ "Locator": "", "id": 0, "uniqness": "" }],
			"MultiDropdown":
				[{ "Locator": "[ui=droplist]", "id": 0, "uniqness": "id" }],
			"Menu":
				[{ "Locator": ".sidebar-menu", "id": 0, "uniqness": "class" }],
			"Dropdown":
				[{ "Locator": "[ui=dropdown]", "id": 0, "uniqness": "id" } ]
		} ,
	"ComplexRules":
		{
			"ComboBox":
				[{
					"Root": "div[ui=combobox]",
					"uniqness": "id",
					"Value": "input",
					"List": "li",
					"Expand": ".caret",
					"id": 0
				}, { "Root": "select[ui=combobox]", "uniqness": "id", "Value": "", "List": "", "Expand": "", "id": 1 }],
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
		}
	,
	"CompositeRules":
		{
			"Section":
				[{ "Locator": ".section", "id": 0, "uniqness": "class" },
					{ "Locator": "header", "id": 1, "uniqness": "tag" },
					{ "Locator": "footer", "id": 2, "uniqness": "tag" },
					{ "Locator": ".main-form", "id": 3, "uniqness": "tag" }
				],
			"Form":
				[{ "Locator": "form", "id": 0, "uniqness": "id" }]
		}
};

export default rulesJson;
