/**
 * 随机函数
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */

export function randomFun (lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower
}
