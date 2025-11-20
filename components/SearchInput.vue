<template>
  <div>
    <label v-if="label" :for="inputId" class="block text-sm/6 font-medium text-gray-900 mb-2">
      {{ label }}
    </label>
    <div class="flex rounded-lg bg-white border border-gray-200 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-amber-500">
      <!-- Filter Dropdown -->
      <div v-if="filterOptions.length > 0" class="grid shrink-0 grid-cols-1 focus-within:relative">
        <select
          :id="`${inputId}-filter`"
          v-model="selectedFilter"
          @change="handleFilterChange"
          :aria-label="filterLabel"
          class="col-start-1 row-start-1 w-full appearance-none rounded-l-lg bg-white py-2 pr-8 pl-4 text-sm text-gray-700 font-medium placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-amber-500 border-0"
        >
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <ChevronDownIcon 
          class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500" 
          aria-hidden="true" 
        />
      </div>

      <!-- Search Icon -->
      <div class="flex items-center pl-4 pr-2">
        <MagnifyingGlassIcon class="size-5 text-gray-400" aria-hidden="true" />
      </div>

      <!-- Search Input -->
      <input
        :type="type"
        :name="name"
        :id="inputId"
        v-model="searchValue"
        @input="handleInput"
        @keyup.enter="handleEnter"
        class="block min-w-0 grow bg-white py-2 pr-4 pl-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-r-lg"
        :placeholder="placeholder"
      />

      <!-- Clear Button -->
      <button
        v-if="searchValue && clearable"
        @click="clearSearch"
        type="button"
        class="flex items-center pr-4 text-gray-400 hover:text-gray-600"
      >
        <XMarkIcon class="size-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid';

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string;
  filterValue?: string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  placeholder?: string;
  label?: string;
  type?: string;
  name?: string;
  inputId?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  filterValue: '',
  filterOptions: () => [],
  filterLabel: 'Filter',
  placeholder: 'Search...',
  type: 'text',
  name: 'search',
  inputId: 'search-input',
  clearable: true
});

const emit = defineEmits(['update:modelValue', 'update:filterValue', 'search', 'filter-change']);

const searchValue = ref(props.modelValue);
const selectedFilter = ref(props.filterValue);

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});

watch(() => props.filterValue, (newValue) => {
  selectedFilter.value = newValue;
});

const handleInput = () => {
  emit('update:modelValue', searchValue.value);
  emit('search', searchValue.value);
};

const handleFilterChange = () => {
  emit('update:filterValue', selectedFilter.value);
  emit('filter-change', selectedFilter.value);
};

const handleEnter = () => {
  emit('search', searchValue.value);
};

const clearSearch = () => {
  searchValue.value = '';
  emit('update:modelValue', '');
  emit('search', '');
};
</script>

