<template>
    <div class="table-container relative overflow-hidden dark:bg-slate-900 dark:border-white/5 transition-colors">
        <!-- High Fidelity Branded Loader Overly -->
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <AdminLoader v-if="loading" size="sm" :text="loadingText"
                class="absolute inset-0 z-50 bg-white/90 backdrop-blur-[2px]" />
        </transition>

        <el-table ref="tableRef" :data="data" stripe :height="height" :default-sort="defaultSort"
            @sort-change="handleSortChange" style="width: 100%" :row-class-name="getRowClassName">
            <!-- ID Column -->
            <el-table-column prop="bookingReference" label="ID" width="160" sortable="custom" fixed :resizable="true">
                <template #default="scope">
                    <div class="id-cell" v-if="scope?.row">
                        <el-icon class="copy-icon" @click="$emit('copy', scope.row.bookingReference)">
                            <DocumentCopy />
                        </el-icon>
                        <span class="booking-id dark:text-slate-300">{{ scope.row.bookingReference }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Customer Column -->
            <el-table-column label="CUSTOMER" width="280" sortable="custom" prop="userName" :resizable="true">
                <template #default="scope">
                    <div class="customer-cell" v-if="scope?.row">
                        <el-avatar :size="40" :src="scope.row.photoURL">
                            {{ getInitials(scope.row.userName) }}
                        </el-avatar>
                        <div class="customer-info">
                            <div class="customer-name dark:text-white transition-colors">{{ scope.row.userName || 'N/A'
                                }}</div>
                            <div class="customer-email dark:text-slate-400 transition-colors">{{ scope.row.userEmail }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <!-- Phone Column -->
            <el-table-column prop="userPhone" label="PHONE" width="200" :resizable="true">
                <template #default="scope">
                    <div class="phone-cell dark:text-slate-400 transition-colors" v-if="scope?.row">
                        <el-icon>
                            <Phone />
                        </el-icon>
                        <span>{{ scope.row.userPhone }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Pickup Column -->
            <el-table-column label="PICKUP" width="250" show-overflow-tooltip :resizable="true">
                <template #default="scope">
                    <div class="address-cell dark:text-slate-400 transition-colors" v-if="scope?.row">
                        <el-icon class="location-icon">
                            <LocationFilled />
                        </el-icon>
                        <span>{{ scope.row.pickupAddress }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Dropoff Column -->
            <el-table-column label="DROPOFF" width="250" show-overflow-tooltip :resizable="true">
                <template #default="scope">
                    <div class="address-cell dark:text-slate-400 transition-colors" v-if="scope?.row">
                        <el-icon class="location-icon">
                            <Location />
                        </el-icon>
                        <span>{{ scope.row.dropoffAddress }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Date & Time Column -->
            <el-table-column label="DATE & TIME" width="280" sortable="custom" prop="pickupDateTime" :resizable="true">
                <template #default="scope">
                    <div class="datetime-cell dark:text-slate-400 transition-colors" v-if="scope?.row">
                        <el-icon>
                            <Calendar />
                        </el-icon>
                        <span>{{ formatDateTime(scope.row.pickupDateTime) }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Vehicle Column -->
            <el-table-column prop="vehicleType" label="VEHICLE" width="130" :resizable="true">
                <template #default="scope">
                    <el-tag v-if="scope?.row" size="small" class="vehicle-tag">
                        {{ (scope.row.vehicleType || scope.row.cabType || 'Unknown')?.toUpperCase() }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- Fare Column -->
            <el-table-column label="FARE" width="120" sortable="custom" prop="totalFare" align="right"
                :resizable="true">
                <template #default="scope">
                    <div class="fare-cell" v-if="scope?.row">£{{ scope.row.totalFare?.toFixed(2) || '0.00' }}</div>
                </template>
            </el-table-column>

            <!-- Status Column -->
            <el-table-column label="STATUS" width="160" :resizable="true">
                <template #default="scope">
                    <StatusBadge v-if="scope?.row" :status="scope.row.status" />
                </template>
            </el-table-column>

            <!-- Actions Column -->
            <el-table-column label="ACTIONS" width="140" fixed="right" align="center" v-if="showActions">
                <template #default="scope">
                    <el-dropdown v-if="scope?.row" trigger="click" @command="(cmd) => $emit('action', cmd, scope.row)">
                        <Button size="sm">
                            <el-icon>
                                <MoreFilled />
                            </el-icon>
                        </Button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="view">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    <span>View Details</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="status">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    <span>Change Status</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="assign">
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                    <span>Assign Driver</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="edit">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    <span>Edit Parameters</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="print" divided>
                                    <el-icon>
                                        <Printer />
                                    </el-icon>
                                    <span>Print</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>

            <template #empty>
                <el-empty description="No bookings found" />
            </template>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import {
    DocumentCopy, Phone, LocationFilled, Location, Calendar,
    MoreFilled, View, Edit, User, Printer
} from '@element-plus/icons-vue';

interface Props {
    data: any[];
    loading?: boolean;
    loadingText?: string;
    height?: string | number;
    showActions?: boolean;
    defaultSort?: { prop: string; order: string };
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    loadingText: 'Retrieving bookings...',
    height: '100%',
    showActions: true,
    defaultSort: () => ({ prop: 'createdAt', order: 'descending' })
});

const emit = defineEmits(['sort-change', 'copy', 'action']);

const formatDateTime = (dateString: any) => {
    if (!dateString) return 'N/A';
    try {
        let date;
        if (typeof dateString === 'string') {
            date = new Date(dateString);
        } else if (dateString.toDate) {
            date = dateString.toDate();
        } else {
            date = new Date(dateString);
        }

        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getRowClassName = ({ rowIndex }: { rowIndex: number }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
};

const handleSortChange = (sortData: any) => {
    emit('sort-change', sortData);
};
</script>

<style scoped lang="scss">
.table-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Cell Styles */
.id-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .copy-icon {
        cursor: pointer;
        color: #9ca3af;

        &:hover {
            color: #6b7280;
        }
    }

    .booking-id {
        font-family: 'Monaco', 'Courier New', monospace;
        font-weight: 600;
        color: #1f2937;
        font-size: 13px;
    }
}

.customer-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .customer-info {
        flex: 1;
        min-width: 0;

        .customer-name {
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 2px;
        }

        .customer-email {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

.phone-cell,
.datetime-cell,
.address-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4b5563;

    .location-icon {
        color: #f59e0b;
    }
}

.fare-cell {
    font-weight: 600;
    font-size: 15px;
    color: #059669;
}

.vehicle-tag {
    font-weight: 600;
    font-size: 11px;
}

/* Element Plus Overrides */
:deep(.el-table) {
    font-size: 14px;

    th {
        background: #f9fafb !important;
        color: #6b7280;
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .el-table__cell {
        padding: 14px 12px;
    }

    /* Fixed Column Backgrounds - Required for Scroll Stability */
    .el-table-fixed-column--left,
    .el-table-fixed-column--right {
        background: inherit !important;
    }

    .even-row {
        background: #ffffff !important;

        &.el-table__row--striped td {
            background: #ffffff !important;
        }

        td.el-table-fixed-column--left,
        td.el-table-fixed-column--right {
            background: #ffffff !important;
        }
    }

    .odd-row {
        background: #f9fafb !important;

        &.el-table__row--striped td {
            background: #f9fafb !important;
        }

        td.el-table-fixed-column--left,
        td.el-table-fixed-column--right {
            background: #f9fafb !important;
        }
    }
}

.dark {
    :deep(.el-table) {
        background-color: transparent !important;
        --el-table-border-color: rgba(255, 255, 255, 0.05);
        --el-table-header-bg-color: #1e293b;
        --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.02);
        color: #94a3b8;

        th {
            background: #1e293b !important;
            color: #94a3b8;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        .even-row {
            background: #0f172a !important;

            td.el-table-fixed-column--left,
            td.el-table-fixed-column--right {
                background: #0f172a !important;
            }
        }

        .odd-row {
            background: #1e293b !important;

            td.el-table-fixed-column--left,
            td.el-table-fixed-column--right {
                background: #1e293b !important;
            }
        }

        /* Fixed Header Support */
        th.el-table-fixed-column--left,
        th.el-table-fixed-column--right {
            background: #1e293b !important;
        }
    }
}
</style>
