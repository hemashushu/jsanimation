const TWEEN = require('@tweenjs/tween.js');

/**
 * 动画函数
 *
 * 即数值变化的规律
 *
 * 参考
 * - http://tweenjs.github.io/tween.js/examples/03_graphs.html
 * - http://www.createjs.com/demos/tweenjs/tween_sparktable
 * - http://easings.net/
 *
 * 带有 out 的：意味着从快到慢，比如常见的弹出（物体往上抛）、移入（刹车）等
 * 带哟 in 的：意味着从慢到快，比如逃离（加速跑）、消失等
 *
 */
const Easing = {
	// the following is easing out
	QuadraticOut: TWEEN.Easing.Quadratic.Out,  // slower
	CubicOut: TWEEN.Easing.Cubic.Out,          // slow (default)
	QuarticOut: TWEEN.Easing.Quartic.Out,      // normal
	CircularOut: TWEEN.Easing.Circular.Out,    // fast
	QuinticOut: TWEEN.Easing.Quintic.Out,      // very fast

	// the following is easing in
	QuadraticIn: TWEEN.Easing.Quadratic.In,    // slower
	CubicIn: TWEEN.Easing.Cubic.In,            // slow
	QuarticIn: TWEEN.Easing.Quartic.In,        // normal
	CircularIn: TWEEN.Easing.Circular.In,      // fast
	QuinticIn: TWEEN.Easing.Quintic.In         // very fast
};

module.exports = Easing;