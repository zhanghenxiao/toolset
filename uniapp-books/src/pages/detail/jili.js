'use strict';
/**
 * uni-ad激励视频 服务端回调
 * 广告平台请求此云函数，验证签名，校验成功发放奖励
 */
exports.main = async (event, context) => {
	// ========== 配置项，请修改这2个值 ==========
	const callbackSecret = "你的uni-ad广告位callbackSecret"; // uni-ad后台广告位获取
	const db = uniCloud.database();
	// ===========================================

	const query = event.queryStringParameters;
	const body = event.body;
	const sign = query.sign;

	try {
		// 1. 校验参数
		if (!sign) {
			return {
				code: 400,
				msg: "缺少签名sign"
			}
		}

		// 2. 拼接签名原文（uni-ad签名规则）
		// 参数按key升序拼接 + callbackSecret，然后md5
		const params = {
			adpid: query.adpid,
			appid: query.appid,
			channel: query.channel,
			create_time: query.create_time,
			openid: query.openid,
			order_id: query.order_id,
			reward_name: query.reward_name,
			reward_num: query.reward_num,
			uid: query.uid
		};
		// 按key排序拼接字符串
		const keys = Object.keys(params).sort();
		let str = "";
		for (let k of keys) {
			if (params[k] !== undefined) {
				str += `${k}=${params[k]}`;
			}
		}
		str += callbackSecret;

		// md5加密
		const crypto = require('crypto');
		const calcSign = crypto.createHash('md5').update(str).digest('hex');

		// 3. 校验签名是否一致
		if (calcSign.toLowerCase() !== sign.toLowerCase()) {
			console.log("签名校验失败", calcSign, sign);
			return {
				code: 401,
				msg: "签名错误"
			}
		}

		// 4. 签名校验通过，订单唯一id，防止重复发放奖励（幂等！非常重要）
		const orderId = query.order_id;
		const uid = query.uid; // 用户id，前端传过来的uid
		const adpid = query.adpid;

		// 查询数据库，判断该订单是否已经发放过奖励，避免重复发奖
		const orderRes = await db.collection("ad_reward_record").where({
			order_id: orderId
		}).get();

		if (orderRes.data.length > 0) {
			// 订单已处理，直接返回成功，不要再发奖励
			return {
				code: 0,
				msg: "success"
			}
		}

		// ====== 这里写你的业务逻辑：给用户发奖励 ======
		// 示例：给用户增加阅读次数 / 解锁章节 / 增加积分
		/*
		await db.collection("user").doc(uid).update({
			inc: {
				read_count: 1
			}
		})
		*/

		// 5. 记录奖励发放记录（幂等表，必须建！）
		await db.collection("ad_reward_record").add({
			order_id: orderId,
			uid: uid,
			adpid: adpid,
			create_time: Date.now(),
			query: query
		})

		// 6. 返回uni-ad要求的格式：code=0 代表成功
		return {
			code: 0,
			msg: "success"
		}

	} catch (e) {
		console.error("回调异常", e);
		return {
			code: 500,
			msg: "server error"
		}
	}
}
