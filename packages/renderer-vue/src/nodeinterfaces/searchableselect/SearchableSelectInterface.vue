<!-- src/nodeinterfaces/searchableselect/SearchableSelectInterface.vue -->
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
// Corrected import path to point to '../select/SelectInterface'
import type { SelectInterface, SelectInterfaceItem } from "../select/SelectInterface";

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
            props.intf.items.find((v: SelectInterfaceItem<unknown>) =>
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
            return props.intf.items.filter((item: SelectInterfaceItem<unknown>) => {
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

<style scoped>
.baklava-select {
    position: relative;
    cursor: pointer;
    /* Add your existing styles here */
}

.__selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* Add your existing styles here */
}

.__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    -webkit-overflow-scrolling: touch; /* Add this line */
    touch-action: pan-y; /* Allow vertical touch scrolling */
  }

.__search {
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.__search input {
    width: 100%;
    padding: 6px 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.item {
    padding: 8px 12px;
    cursor: pointer;
}

.item.--active {
    background-color: #f0f0f0;
}

.item.--header {
    font-weight: bold;
    background-color: #fafafa;
    border-bottom: 1px solid #eee;
}

.item.--no-results {
    padding: 8px 12px;
    color: #999;
    text-align: center;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>