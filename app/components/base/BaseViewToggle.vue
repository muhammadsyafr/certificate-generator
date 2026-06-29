<template>
    <div class="bvt-root">
        <button
            class="bvt-btn"
            :class="{ 'bvt-btn--active': modelValue === 'grid' }"
            @click="$emit('update:modelValue', 'grid')"
            aria-label="Grid view"
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    stroke-width="1.9"
                />
                <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    stroke-width="1.9"
                />
                <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    stroke-width="1.9"
                />
                <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    stroke-width="1.9"
                />
            </svg>
        </button>
        <button
            class="bvt-btn"
            :class="{ 'bvt-btn--active': modelValue === 'list' }"
            @click="$emit('update:modelValue', 'list')"
            aria-label="List view"
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: "grid" | "list";
}>();

defineEmits<{
    "update:modelValue": [value: "grid" | "list"];
}>();
</script>

<style scoped>
.bvt-root {
    display: flex;
    background: #fff;
    border: 1px solid rgba(20, 17, 14, 0.09);
    border-radius: 10px;
    overflow: hidden;
    width: 180px;
}

.bvt-btn {
    border: none;
    cursor: pointer;
    width: 36px;
    height: 34px;
    display: grid;
    place-items: center;
    background: #fff;
    color: #6e665e;
    transition: background 0.15s;
}

.bvt-btn--active {
    background: #14110e;
    color: #fff;
}
</style>
