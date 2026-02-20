<template>
    <div class="global-search ml-12 flex-1 max-w-xl">
        <el-autocomplete v-model="searchQuery" :fetch-suggestions="querySearch"
            placeholder="Search bookings, drivers, or users..." @select="handleSelect" class="w-full" clearable>
            <template #prefix>
                <el-icon class="text-slate-400">
                    <Search />
                </el-icon>
            </template>
            <template #default="{ item }">
                <div class="flex items-center justify-between py-1">
                    <div class="flex items-center space-x-3">
                        <div :class="[
                            'w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm',
                            item.type === 'booking' ? 'bg-amber-500' :
                                item.type === 'driver' ? 'bg-emerald-500' : 'bg-blue-500'
                        ]">
                            {{ item.type[0].toUpperCase() }}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-900 leading-none">{{ item.label }}</p>
                            <p class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{{
                                item.sublabel }}</p>
                        </div>
                    </div>
                    <el-tag size="small"
                        :type="item.type === 'booking' ? 'warning' : item.type === 'driver' ? 'success' : 'info'">
                        {{ item.type }}
                    </el-tag>
                </div>
            </template>
        </el-autocomplete>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

const searchQuery = ref('');
const { globalSearch } = useAdminFirestore();
const router = useRouter();

const querySearch = async (queryString: string, cb: any) => {
    if (!queryString || queryString.length < 2) {
        cb([]);
        return;
    }

    const results = await globalSearch(queryString);
    cb(results);
};

const handleSelect = (item: any) => {
    searchQuery.value = '';

    if (item.type === 'booking') {
        router.push(`/admin/bookings/${item.id}`);
    } else if (item.type === 'driver') {
        router.push(`/admin/drivers/edit/${item.id}`);
    } else if (item.type === 'user') {
        router.push(`/admin/users/edit/${item.id}`);
    }
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
}

:deep(.el-input__wrapper.is-focus) {
    background-color: rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 0 0 1px #f59e0b inset !important;
}

:deep(.el-input__inner) {
    color: white !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

:deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.4) !important;
}
</style>
