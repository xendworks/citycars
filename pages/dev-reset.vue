<template>
    <div class="p-20 text-center">
        <h1 class="text-2xl font-bold mb-8">System Reset Tool</h1>
        <div class="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto inline-block text-left">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Current Session Health</h2>
            <div v-if="adminUser" class="space-y-2">
                <p class="text-sm font-bold text-slate-900">Email: <span class="font-normal text-slate-600">{{
                    adminUser.email }}</span></p>
                <p class="text-sm font-bold text-slate-900">Role: <span class="font-normal text-slate-600 uppercase">{{
                    adminUser.role }}</span></p>
                <p class="text-[10px] font-mono text-slate-400">UID: {{ adminUser.id }}</p>
                <div v-if="adminUser.role !== 'super_admin'"
                    class="mt-4 p-2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">
                    ⚠️ Your role is not SUPER_ADMIN. This is why Firestore is rejecting your requests.
                </div>
            </div>
            <div v-else class="text-sm text-red-500 font-bold">
                No admin session detected.
            </div>
        </div>

        <div class="flex flex-col gap-4 max-w-xs mx-auto">
            <el-button @click="runReseed" :loading="isWorking" type="danger" size="large">
                Flush & Reseed Bookings
            </el-button>
            <el-button @click="upgradeAllAdmins" :loading="isWorking" type="warning" size="large">
                Fix Permissions (Admin -> Super Admin)
            </el-button>
            <el-button @click="runDiagnostics" :loading="isWorking" type="primary" size="large" plain>
                Run Permission Diagnostics
            </el-button>
        </div>
        <div v-if="log.length"
            class="mt-8 text-left bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-xs max-w-2xl mx-auto overflow-auto max-h-96">
            <div v-for="line in log" :key="line">{{ line }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, Timestamp, query, where } from 'firebase/firestore';

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const { $firebase } = useNuxtApp();
const { adminUser } = useAdminAuth();
const db = getFirestore($firebase as any);
const isWorking = ref(false);
const log = ref<string[]>([]);

const addLog = (msg: string) => {
    log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
};

const runReseed = async () => {
    isWorking.value = true;
    log.value = [];
    addLog('Starting system reset...');

    try {
        // 1. Flush Drivers
        const driversSnap = await getDocs(collection(db, 'drivers'));
        addLog(`Deleting ${driversSnap.size} drivers...`);
        for (const d of driversSnap.docs) {
            await deleteDoc(d.ref);
        }

        // 2. Flush Offers
        const offersSnap = await getDocs(collection(db, 'offers'));
        addLog(`Deleting ${offersSnap.size} offers...`);
        for (const o of offersSnap.docs) {
            await deleteDoc(o.ref);
        }

        // 3. Flush Bookings (except CTY55370159)
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        let deletedCount = 0;
        for (const b of bookingsSnap.docs) {
            if (b.data().bookingReference !== 'CTY55370159') {
                await deleteDoc(b.ref);
                deletedCount++;
            }
        }
        addLog(`Deleted ${deletedCount} bookings. Kept CTY55370159.`);

        // 4. Seed 50 Bookings
        addLog('Seeding 50 new bookings...');
        const names = ['James Wilson', 'Satoshi Nakamoto', 'Emma Thompson', 'Liam Neeson', 'Olivia Rodrigo', 'Noah Centineo', 'Sophia Loren', 'William Wright', 'Isabella Swan', 'Lucas Brown', 'Mia Khalifa', 'Ethan Hunt', 'Amelia Earhart', 'Daniel Craig', 'Charlotte Bronte'];
        const addresses = [
            'Heathrow Airport, Terminal 5', 'Victoria Station, London', 'Kings Cross St. Pancras',
            'Buckingham Palace, London', 'London Eye, London', 'The Shard, London',
            'Gatwick Airport, North Terminal', 'Paddington Station, London', 'Wembley Stadium, London'
        ];
        const vehicles = ['Saloon', 'Estate', 'Executive', 'MPV', 'MPV+', 'Minibus'];
        const statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 50; i++) {
            const offset = Math.floor(Math.random() * 7);
            const pickupDate = new Date(today);
            pickupDate.setDate(today.getDate() + offset);
            pickupDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            const pickup = addresses[Math.floor(Math.random() * addresses.length)];
            const dropoff = addresses.filter(a => a !== pickup)[Math.floor(Math.random() * (addresses.length - 1))];
            const name = names[Math.floor(Math.random() * names.length)];

            const status = i < 10 ? 'pending' : (i < 25 ? 'confirmed' : statuses[Math.floor(Math.random() * statuses.length)]);

            await addDoc(collection(db, 'bookings'), {
                userName: name,
                userEmail: `${name.toLowerCase().replace(' ', '.')}@example.com`,
                userPhone: `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`,
                pickupAddress: pickup,
                dropoffAddress: dropoff,
                vehicleType: vehicles[Math.floor(Math.random() * vehicles.length)],
                totalFare: parseFloat((40 + Math.random() * 120).toFixed(2)),
                status: status,
                passengers: Math.floor(Math.random() * 4 + 1),
                luggage: Math.floor(Math.random() * 3),
                bookingReference: `CTY${Math.floor(10000000 + Math.random() * 90000000)}`,
                pickupDateTime: Timestamp.fromDate(pickupDate),
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                distance: (Math.random() * 15 + 5).toFixed(1),
                eta: Math.floor(Math.random() * 40 + 10).toString()
            });

            if ((i + 1) % 10 === 0) addLog(`Seeded ${i + 1} bookings...`);
        }

        addLog('🎉 System reset and reseed complete!');
    } catch (err: any) {
        addLog(`❌ Error: ${err.message}`);
        console.error(err);
    } finally {
        isWorking.value = false;
    }
};

const upgradeAllAdmins = async () => {
    isWorking.value = true;
    log.value = [];
    addLog('Starting role upgrade...');

    try {
        const { updateDoc } = await import('firebase/firestore');
        const usersSnap = await getDocs(collection(db, 'users'));
        let count = 0;

        for (const u of usersSnap.docs) {
            const data = u.data();
            const currentRole = (data.role || '').toLowerCase().trim();
            if (currentRole === 'admin' || !currentRole) {
                await updateDoc(u.ref, { role: 'super_admin' });
                addLog(`Upgraded ${data.email || u.id} to super_admin`);
                count++;
            }
        }
        addLog(`✅ Successfully upgraded ${count} users.`);
        addLog('💡 LOG OUT and LOG IN again to apply changes!');
    } catch (err: any) {
        addLog(`❌ Error: ${err.message}`);
        console.error(err);
    } finally {
        isWorking.value = false;
    }
};

const runDiagnostics = async () => {
    isWorking.value = true;
    log.value = [];
    addLog('🚀 Starting Permission Diagnostics...');
    addLog(`User: ${adminUser.value?.email} | Role: ${adminUser.value?.role}`);

    try {
        const { setDoc, deleteDoc, getDoc } = await import('firebase/firestore');

        // Test 1: Read Self Profile
        try {
            const snap = await getDoc(doc(db, 'users', adminUser.value!.id));
            addLog(`✅ READ users/${adminUser.value!.id}: SUCCESS`);
        } catch (e: any) {
            addLog(`❌ READ users/${adminUser.value!.id}: FAILED (${e.code})`);
        }

        // Test 2: Write to Drivers (Known working?)
        try {
            const testRef = doc(db, 'drivers', 'test_write_diag');
            await setDoc(testRef, { diag: true, timestamp: Timestamp.now() });
            addLog(`✅ WRITE drivers: SUCCESS`);
            await deleteDoc(testRef);
        } catch (e: any) {
            addLog(`❌ WRITE drivers: FAILED (${e.code})`);
        }

        // Test 3: Write to Offers
        try {
            const testRef = doc(db, 'offers', 'TEST_DIAG');
            await setDoc(testRef, { diag: true, timestamp: Timestamp.now() });
            addLog(`✅ WRITE offers: SUCCESS`);
            await deleteDoc(testRef);
        } catch (e: any) {
            addLog(`❌ WRITE offers: FAILED (${e.code})`);
        }

        // Test 4: Write to Config
        try {
            const testRef = doc(db, 'config', 'diag_test');
            await setDoc(testRef, { diag: true, timestamp: Timestamp.now() });
            addLog(`✅ WRITE config: SUCCESS`);
            await deleteDoc(testRef);
        } catch (e: any) {
            addLog(`❌ WRITE config: FAILED (${e.code})`);
        }

        addLog('🏁 Diagnostics Complete.');
    } catch (err: any) {
        addLog(`❌ Fatal Error during diagnostics: ${err.message}`);
    } finally {
        isWorking.value = false;
    }
};
</script>
