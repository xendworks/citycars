<template>
  <Listbox as="div" v-model="selectedValue" @update:modelValue="handleChange">
    <ListboxLabel class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</ListboxLabel>
    <div class="relative">
      <ListboxButton class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300 bg-white text-left">
        <span class="block truncate">{{ selectedValue }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition 
        leave-active-class="transition ease-in duration-100" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption 
            as="template" 
            v-for="option in options" 
            :key="option" 
            :value="option" 
            v-slot="{ active, selected }"
          >
            <li 
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9'
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                {{ option }}
              </span>

              <span 
                v-if="selected" 
                :class="[
                  active ? 'text-amber-600' : 'text-amber-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4'
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script> 