<template>
    <el-drawer v-model="store.isDrawerOpen" title="Activity stream" direction="rtl" size="400px"
        class="notification-drawer">
        <template #header>
            <div class="flex items-center justify-between w-full pr-4">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">Notifications
                </h2>
                <div class="flex items-center space-x-2">
                    <button v-if="store.unreadCount > 0" @click="store.markAllAsRead"
                        class="text-[11px] font-bold text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors">
                        Mark all read
                    </button>
                    <button @click="store.clearAll"
                        class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        Clear
                    </button>
                </div>
            </div>
        </template>

        <div class="p-0">
            <div v-if="store.notifications.length === 0"
                class="flex flex-col items-center justify-center py-20 text-center">
                <div
                    class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <el-icon size="24" class="text-slate-300 dark:text-slate-600">
                        <Bell />
                    </el-icon>
                </div>
                <p class="text-slate-900 dark:text-white font-bold font-sora transition-colors">All caught up!</p>
                <p class="text-slate-400 dark:text-slate-500 text-xs mt-1">New activity will appear here in real-time.
                </p>
            </div>

            <div v-else class="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                <div v-for="notif in store.notifications" :key="notif.id" @click="handleNotificationClick(notif)"
                    :class="[
                        'p-5 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 relative group',
                        !notif.isRead ? 'bg-amber-50/30 dark:bg-amber-500/5' : ''
                    ]">
                    <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>

                    <div class="flex items-start space-x-4">
                        <div :class="[
                            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                            notif.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                notif.type === 'error' ? 'bg-red-50 text-red-600' :
                                    notif.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        ]">
                            <el-icon size="18">
                                <component :is="getIcon(notif.type)" />
                            </el-icon>
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between">
                                <p
                                    class="text-sm font-bold text-slate-900 dark:text-white font-sora truncate transition-colors">
                                    {{ notif.title }}</p>
                                <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500">{{
                                    formatTime(notif.timestamp)
                                    }}</span>
                            </div>
                            <p
                                class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                                {{
                                notif.message }}</p>

                            <div v-if="notif.link"
                                class="mt-3 flex items-center text-[11px] font-bold text-amber-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>View Details</span>
                                <el-icon class="ml-1">
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { useAdminNotificationsStore } from '~/stores/adminNotifications';
import {
    Bell,
    SuccessFilled,
    CircleCloseFilled,
    WarningFilled,
    InfoFilled,
    ArrowRight
} from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const store = useAdminNotificationsStore();
const router = useRouter();

const getIcon = (type: string) => {
    switch (type) {
        case 'success': return SuccessFilled;
        case 'error': return CircleCloseFilled;
        case 'warning': return WarningFilled;
        default: return InfoFilled;
    }
};

const formatTime = (timestamp: any) => {
    return dayjs(timestamp).fromNow();
};

const handleNotificationClick = (notif: any) => {
    store.markAsRead(notif.id);
    if (notif.link) {
        store.isDrawerOpen = false;
        router.push(notif.link);
    }
};
</script>

<style scoped>
:deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
}

.dark :deep(.el-drawer__header) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.el-drawer__title) {
    display: none;
}

:deep(.notification-drawer) {
    border-radius: 24px 0 0 24px;
}

.dark :deep(.el-drawer) {
    background-color: #0f172a !important;
}
</style>
