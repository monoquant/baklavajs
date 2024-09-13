<template>
    <div
        ref="el"
        class="baklava-select"
        :class="{ '--open': open }"
        :title="intf.name"
        @click="toggleDropdown"
    >
        <div class="__selected">
            <div class="__text">
                {{ selectedText || 'Select an option' }}
            </div>
            <div class="__icon">
                <i-arrow />
            </div>
        </div>
        <transition name="slide-fade">
            <div v-show="open" class="__dropdown">
                <div class="item --header">
                    {{ intf.name }}
                </div>
                <!-- Search Input -->
                <div class="__search">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search..."
                        @click.stop
                        @input="handleSearch"
                    />
                </div>
                <!-- Filtered Items -->
                <div
                    v-for="(item, i) in filteredItems"
                    :key="i"
                    :class="['item', { '--active': isSelected(item) }]"
                    @click="selectItem(item)"
                >
                    {{ displayText(item) }}
                </div>
                <!-- No Results Message -->
                <div v-if="filteredItems.length === 0" class="item --no-results">
                    No results found
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { onClickOutside } from "@vueuse/core";
import { computed, defineComponent, ref } from "vue";
import Arrow from "../../icons/ChevronDown.vue";
import type { SelectInterface, SelectInterfaceItem } from "./SelectInterface";

export default defineComponent({
    name: "SearchableSelectInterface",
    components: {
        "i-arrow": Arrow,
    },
    props: {
        intf: {
            type: Object as () => SelectInterface<unknown>,
            required: true,
        },
    },
    setup(props) {
        const el = ref<HTMLElement | null>(null);
        const open = ref(false);
        const searchQuery = ref("");

        // Toggle dropdown visibility
        const toggleDropdown = () => {
            open.value = !open.value;
            if (open.value) {
                searchQuery.value = ""; // Reset search when opened
            }
        };

        // Close dropdown when clicking outside
        onClickOutside(el, () => {
            open.value = false;
        });

        // Compute the selected item based on the current value
        const selectedItem = computed(() =>
            props.intf.items.find((v) =>
                typeof v === "string" ? v === props.intf.value : v.value === props.intf.value,
            ),
        );

        // Display text for the selected item
        const selectedText = computed(() => {
            if (selectedItem.value) {
                return typeof selectedItem.value === "string" ? selectedItem.value : selectedItem.value.text;
            } else {
                return "";
            }
        });

        // Handle selection of an item
        const selectItem = (item: SelectInterfaceItem<unknown>) => {
            props.intf.value = typeof item === "string" ? item : item.value;
            open.value = false;
        };

        // Determine if an item is selected
        const isSelected = (item: SelectInterfaceItem<unknown>) => {
            return item === selectedItem.value;
        };

        // Get display text for an item
        const displayText = (item: SelectInterfaceItem<unknown>) => {
            return typeof item === "string" ? item : item.text;
        };

        // Filter items based on search query
        const filteredItems = computed(() => {
            if (!searchQuery.value.trim()) {
                return props.intf.items;
            }
            const query = searchQuery.value.toLowerCase();
            return props.intf.items.filter((item) => {
                if (typeof item === "string") {
                    return item.toLowerCase().includes(query);
                } else if (item.text) {
                    return item.text.toLowerCase().includes(query);
                }
                return false;
            });
        });

        // Optional: Handle search input if additional logic is needed
        const handleSearch = () => {
            // Any additional logic on search can be added here
        };

        return {
            el,
            open,
            toggleDropdown,
            selectedItem,
            selectedText,
            selectItem,
            isSelected,
            displayText,
            searchQuery,
            filteredItems,
            handleSearch,
        };
    },
});
</script>
