<template>
  <span 
    class="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium"
    :class="badgeClasses"
  >
    <svg class="size-1.5" :class="dotClasses" viewBox="0 0 6 6" aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | string;
}

const props = defineProps<Props>();

const statusConfig = {
  'pending': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'fill-yellow-500',
    label: 'Pending'
  },
  'confirmed': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'fill-blue-500',
    label: 'Confirmed'
  },
  'in-progress': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    dot: 'fill-indigo-500',
    label: 'In Progress'
  },
  'completed': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'fill-green-500',
    label: 'Completed'
  },
  'cancelled': {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'fill-red-500',
    label: 'Cancelled'
  },
  'default': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'fill-gray-400',
    label: 'Unknown'
  }
};

const config = computed(() => {
  return statusConfig[props.status] || statusConfig['default'];
});

const badgeClasses = computed(() => {
  return `${config.value.bg} ${config.value.text}`;
});

const dotClasses = computed(() => {
  return config.value.dot;
});

const label = computed(() => {
  return config.value.label;
});
</script>

