<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton
      class="inline-flex w-full justify-center gap-x-1 rounded-lg bg-white px-3 py-2 text-sm items-center font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
      <slot name="button">
        {{ buttonText }}
      </slot>
      <ChevronDownIcon class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems :class="[
        'absolute z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none',
        align === 'left' ? 'left-0' : 'right-0'
      ]">
        <div class="py-1">
          <MenuItem v-for="item in items" :key="item.value" v-slot="{ active }">
          <button type="button" @click="handleSelect(item)" :class="[
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            item.value === selectedValue ? 'font-semibold' : '',
            'block w-full text-left px-4 py-2 text-sm'
          ]">
            <div class="flex items-center justify-between">
              <span>{{ item.label }}</span>
              <span v-if="item.value === selectedValue" class="text-amber-600">✓</span>
            </div>
          </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

interface DropdownItem {
  label: string;
  value: string | number;
  icon?: any;
}

interface Props {
  buttonText?: string;
  items: DropdownItem[];
  modelValue?: string | number;
  align?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Select',
  align: 'right'
});

const emit = defineEmits(['update:modelValue', 'select']);

const selectedValue = computed(() => props.modelValue);

const handleSelect = (item: DropdownItem) => {
  emit('update:modelValue', item.value);
  emit('select', item.value);
};
</script>
