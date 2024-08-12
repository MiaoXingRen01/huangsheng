<template>
	<i :class="type" />
</template>

<script>
export default {
	props: ["type"],
};
</script>

<style>
[class^="ri-"],
[class*=" ri-"] {
	display: inline-block;
	font-size: inherit;
	vertical-align: -2px;
}
[class^="ri-"] + span,
[class*=" ri-"] + span,
span + [class^="ri-"],
span + [class*=" ri-"] {
	margin-left: 8px;
}
</style>