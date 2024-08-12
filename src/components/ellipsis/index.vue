<template>
    <a-popover placement="topLeft">
        <template #content>
            <div v-html="content"></div>
        </template>
        <template #title>
            <span>{{ title }}</span>
        </template>
        <div class="ellipsis">{{ content }}</div>
    </a-popover>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped>
.ellipsis {
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
</style>