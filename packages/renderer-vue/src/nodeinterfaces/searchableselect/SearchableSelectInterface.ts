import { type ComponentOptions, markRaw } from "vue";
import { NodeInterface } from "@baklavajs/core";
import SearchableSelectInterfaceComponent from "./SearchableSelectInterface.vue";
// import type { SelectInterfaceItem } from "../select/SelectInterface";

export interface IAdvancedSelectInterfaceItem<V> {
    text: string;
    value: V;
}

export type SearchableSelectInterfaceItem<V> = string | IAdvancedSelectInterfaceItem<V>;

export class SearchableSelectInterface<V = string> extends NodeInterface<V> {
    component: ComponentOptions;
    items: SearchableSelectInterfaceItem<V>[];

    constructor(name: string, value: V, items: SearchableSelectInterfaceItem<V>[]) {
        super(name, value);
        this.component = markRaw(SearchableSelectInterfaceComponent) as ComponentOptions;
        this.items = items;
    }
}

export { SearchableSelectInterfaceComponent };
