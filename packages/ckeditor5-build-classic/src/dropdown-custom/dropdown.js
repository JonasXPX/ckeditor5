import { addListToDropdown, createDropdown, addToolbarToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Model from '@ckeditor/ckeditor5-ui/src/model'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'


export default class Dropdown extends Plugin {
    init() {
        const editor = this.editor
        const items = [
            'item 1',
            'item 2',
            'item 3',
            {
                label: 'Submenu',
                items: ['item1', 'item2']
            },
            {
                label: 'Submenu2',
                items: ['item1', 'item2', {
                    label: 'Submenu',
                    items: ['item1', 'item2']
                }]
            }
        ]
       
        editor.ui.componentFactory.add('dropdown', locale => {
            const dropdownView = createDropdown(locale /*, ButtonClass: DropdownButtonView */)

            addListToDropdown(dropdownView, this._getDropdownItemsDefinitions(items, dropdownView))
            
            dropdownView.buttonView.set({
                label: editor.t('Dropdown'),
                tooltip: true,
                withText: true
                /* icon: ... */
            })

            return dropdownView
        })
    }

    _getDropdownItemsDefinitions(items, dropdownView) {
        const itemDefinitions = new Collection()
        
        for(const name of items) {

            if(typeof name === 'object' && Object.keys(name).includes('items')) {
                this._createSubdropdowns(name, dropdownView)
                continue
            }
            
            const definition = {
                type: 'button',
                model: new Model({
                    commandParem: name,
                    label: name,
                    withText: true
                })
            }
            itemDefinitions.add(definition)
        }
        return itemDefinitions
    }


    _createSubdropdowns(name, dropdownView) {
        const customDropdown = createDropdown(this.editor.locale)
        customDropdown.buttonView.set({
            label: name.label,
            withText: true,
            tooltip: true
        })
        addListToDropdown(customDropdown, this._getDropdownItemsDefinitions(name.items, customDropdown))
        addToolbarToDropdown(dropdownView, [customDropdown])
    }
}