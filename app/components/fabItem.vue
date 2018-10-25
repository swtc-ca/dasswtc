<template>
	<StackLayout class="fab-item" :backgroundColor="color" @tap="$emit('onItemTap')" @touch="onItemTouch">
		<Label :text="title" horizontalAlignment="center" />
	</StackLayout>
</template>

<script>
	export default {
    props: { title: String, color: String },
    methods: {
        onItemTouch(args) {
		  console.log('item touched')
		  this.$emit('onItemTouch', args)
        }
    }
}

</script>

<style scoped>
	.fab-item {
		width: 40;
		height: 40;
		border-radius: 20;
		color: #fff;
		font-weight: bold;
		vertical-align: center;
	}
</style>