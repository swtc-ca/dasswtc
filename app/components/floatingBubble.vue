<template>
	<GridLayout rows="auto, *" columns="*, auto, *">
		<GridLayout colSpan="3" rowSpan="2">
			<slot />
		</GridLayout>

		<GridLayout ref="bubble" class="FloatingBubble" col="1" @tap="onBubbleTap">
			<Label :text="text" textWrap="true" />
		</GridLayout>
	</GridLayout>
</template>

<script>
	export default {
    props: {
        text: {},
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true;
            this.$refs.bubble.nativeView.animate({
                translate: { x: 0, y: 0 },
                opacity: 1,
                duration: 300
            });
        },
        hide() {
            this.visible = false;
            this.$refs.bubble.nativeView.animate({
                translate: { x: 0, y: -100 },
                opacity: 0,
                duration: 300
            });
        },
        onBubbleTap(e) {
            this.$emit("tap");
            this.hide();
        }
    }
};

</script>

<style>
	.FloatingBubble {
        max-width: 80%;
		transform: translateY(-100);
		opacity: 0;
		margin-top: 20;
		padding: 2;
		background: royalblue;
		border-radius: 50;
	}

	.FloatingBubble>Label {
		padding: 10 20;
		background: royalblue;
		color: white;
		border-width: 1;
		border-color: white;
		text-alignment: center;
		border-radius: 50;
	}
</style>