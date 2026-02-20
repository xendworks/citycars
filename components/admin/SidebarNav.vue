<template>
    <nav class="p-4 fixed w-56 space-y-1 z-[30] font-sora transition-colors duration-300">
        <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
            class="group flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-slate-500 font-sora hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500"
            :exact="item.exact"
            exact-active-class="bg-amber-500 text-amber-600 font-semibold shadow-sm ring-1 ring-amber-100 text-white"
            active-class="bg-amber-500 text-amber-600 font-semibold shadow-sm ring-1 ring-amber-100 text-white">
            <el-icon size="18"
                class="text-slate-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                <component :is="item.icon" />
            </el-icon>
            <span class="text-[13px] font-sora tracking-tight font-semibold">{{ item.name }}</span>
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import {
    House, Timer, List, User,
    Ticket, PriceTag, Avatar, Setting
} from '@element-plus/icons-vue';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: House, exact: true },
    { name: 'Live Dispatch', path: '/admin/bookings/live', icon: Timer },
    { name: 'Bookings', path: '/admin/bookings', icon: List },
    { name: 'Drivers', path: '/admin/drivers', icon: User },
    { name: 'Offers & Promotions', path: '/admin/offers', icon: Ticket },
    { name: 'Pricing Rules', path: '/admin/pricing', icon: PriceTag },
    { name: 'Users', path: '/admin/users', icon: Avatar },
    { name: 'Settings', path: '/admin/settings', icon: Setting },
];
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
    transform: translateX(4px);
}
</style>
