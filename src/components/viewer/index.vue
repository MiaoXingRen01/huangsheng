<template>
	<div class="pic-viewer" v-if="visible">
		<div class="pic-viewer__inner">
			<div class="viewer-close" @click="close">
				<i class="ri-close-line"></i>
			</div>
			<div class="viewer-content">
				<img :src="src" ref="img" :style="styleObj" />
			</div>
			<div class="viewer-control">
				<a-icon type="zoom-in" @click="zoomIn" />
				<a-icon type="zoom-out" @click="zoomOut" />
				<span class="viewer-divider"></span>
				<a-icon type="undo" @click="undo" />
				<a-icon type="redo" @click="redo" />
			</div>
		</div>
		<div class="pic-viewer__mask"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			multiples: 1, // 放大或者缩小
			deg: 0, // 旋转的角度
			styleObj: null, // 拖拽时修改图片的样式
		};
	},
	props: {
		src: String,
		visible: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		zoomIn() {
			if (this.multiples >= 10) {
				return;
			}
			this.multiples += 0.25;
			this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
		},
		zoomOut() {
			if (this.multiples <= 0) {
				return;
			}
			this.multiples -= 0.25;
			this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
		},
		undo() {
			this.deg -= 90;
			this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
		},
		redo() {
			this.deg += 90;
			this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
		},
		close() {
			this.$emit("onClose");
		},
	},
};
</script>

<style lang="less">
.pic-viewer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1101;

	.viewer-close {
		position: absolute;
		top: 32px;
		right: 32px;
		width: 40px;
		height: 40px;
		background: fade(white, 85%);
		text-align: center;
		line-height: 40px;
		font-size: 24px;
		border-radius: 50%;
		cursor: pointer;

		&:hover {
			background: white;
		}
	}

	.pic-viewer__inner {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1102;
	}

	.viewer-content {
	}

	img {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		transition: all 0.2s;
		max-width: 80vw;
		max-height: 80vh;
		user-select: none;
	}
}

.pic-viewer__mask {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1101;
	background: fade(black, 65%);
}

.viewer-control {
	position: fixed;
	left: 50%;
	bottom: 24px;
	transform: translateX(-50%);
	border-radius: 40em;
	background: fade(#606266, 75%);
	padding: 12px 24px;
	font-size: 20px;
	color: fade(white, 85%);
	display: flex;
	align-items: center;
	user-select: none;
	z-index: 1103;

	.anticon {
		margin: 0 12px;
		cursor: pointer;

		&:hover {
			color: white;
		}
	}

	.viewer-divider {
		height: 16px;
		width: 1px;
		margin: 0 8px;
	}
}
</style>