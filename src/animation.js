const uuid = require('uuid');
const TWEEN = require('@tweenjs/tween.js');
const Easing = require('./easing');

// 当前存在的动画对象 id 的集合
// 当存在的动画对象都完成时，此 id 集合即为空，动画循环
// 过程 animateLoop() 即停止。
//
// 有关 Set 对象的说明：
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
let animateIds = new Set();

/**
 * 设置全局动画循环，获取定时更新
 */
function animateLoop(time) {
	if (animateIds.size > 0){
        // 有关 requestAnimationFrame() 方法的说明：
        // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        // https://msdn.microsoft.com/en-us/library/hh920765(v=vs.85).aspx
		requestAnimationFrame(animateLoop);
	}

	TWEEN.update(time);
}

class Animation {

    /**
     * 构建一个有规律更新数值的对象。
     *
     * @param {*} fromCoords
     * @param {*} toCoords
     * @param {*} options
     */
	constructor(fromCoords, toCoords, options) {

		// 'from' 和 'to' 是包含开始和结束值的对象，比如：
		//
		// let from = {
		//   x: 100,
		//   y: 200,
		//   z: 300
		// }
		//
		// let to = {
		//   x: 500,
		//   y: 600,
		//   z: 700
		// }
        //
        // options 是定制更新方式、以及调用者提供回调方法的对象：
		// {
		//   duration: Integer,     // 动画的时长，单位为 milliseconds, optional
		//   easing: Easing,        // 动画函数（easing function）, optional
		//   onUpdate: (middleValueObject: Object) => {}, // 数值更新的回调方法。
		//   onStop: () => {},      // 动画被中断（即没有变化完全）的回调方法, optional
		//   onComplete: () => {}   // 动画成功完成的回调方法，optional
		// }

		let duration = options.duration ?? 250;           // default duration is 250 ms
		let easing = options.easing ?? Easing.CubicOut;   // default easing function is Easing.CubicOut
		let onUpdate = options.onUpdate ?? function() {};
		let onComplete = options.onComplete ?? function() {};
		let onStop = options.onStop ?? function() {};

		// 构造一个不重复的动画对象 id
		// https://github.com/broofa/node-uuid
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		this.animateId = uuid.v4();

        // tween 的使用方法说明：
        // http://tweenjs.github.io/tween.js/docs/user_guide.html
		this.tween = new TWEEN.Tween(fromCoords);
		this.tween.to(toCoords, duration);
		this.tween.easing(easing);

		this.tween.onUpdate((coords) => {
            // fromCoords 的各属性值会被更新
            // 注意不要直接把传入的 onUpdate 方法赋值给 tween.onUpdate() 方法，
            // 否则无法获取 coords 对象。
			onUpdate(coords);
		});

		this.tween.onStop(() => {
			animateIds.delete(this.animateId);
			onStop();
		});

		this.tween.onComplete(() => {
			animateIds.delete(this.animateId);
			onComplete();
		});

	}

    /**
     * 开始当前动画
     */
	start() {
        animateIds.add(this.animateId);
		if (animateIds.size === 1) {
			// 开始全局的动画循环
			requestAnimationFrame(animateLoop);
		}

		this.tween.start();
	}

	/**
     * 停止（中断）当前动画
     */
	stop() {
		this.tween.stop();
	}

    /**
     * 用于简化动画对象的调用，此方法仅支持一个变化数值。
     *
     * 示例：
     *
	 * Animation.play(100, 200, {
	 * 		duration: 500,
	 * 		easing: Animation.Easing.CubicOut,
	 * 		onUpdate: (middleValue) => {
	 * 			console.log(middleValue); // middleValue 从 100 变化到 200
	 * 		},
	 * 		onStop: () => {
	 * 			// 动画被中断（interrupted）
	 * 		},
	 * 		onComplete: () => {
	 * 			// 动画成功完成（without interruption）
	 * 		},
	 * 		onFinish: () => {
	 * 			// 动画无论是被中断，还是成功完成，都会执行这里。
	 * 		}
	 * 	});
     *
     *
     * @param {*} startValue
     * @param {*} endValue
     * @param {*} options
     * @returns
     */
	static play(startValue, endValue, options) {

        let onUpdate = options.onUpdate ?? function(middleValue){};
        let onComplete = options.onComplete ?? function(){};
        let onStop = options.onStop ?? function(){};

        // 无论动画最终是成功完成（onComplete）还是被中断（onStop），都会
        // 调用这个 onFinish 函数。
        let onFinish = options.onFinish ?? function(){};

		let animation = new Animation({
			value: startValue
		}, {
			value: endValue
		}, {
			duration: options.duration,
			easing: options.easing,
			onUpdate: (middleValueObject) => {
				onUpdate(middleValueObject.value);
			},
			onComplete: () => {
				onComplete();
                onFinish();
			},
			onStop: () => {
				onStop();
				onFinish();
			}
		});

		animation.start();

		return animation;
	}
}

module.exports = Animation;