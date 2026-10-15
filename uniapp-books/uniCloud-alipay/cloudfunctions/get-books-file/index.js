'use strict';

/**
 * get-books-file
 * 读取云存储文件内容并返回文本
 * 
 * 支付宝云/阿里云版本
 */

const LOG_TAG = '[get-books-file]';

function pickFileID(event) {
  if (!event || typeof event !== 'object') return '';
  
  if (event.fileID) return String(event.fileID);
  if (event.fileId) return String(event.fileId);
  
  const q = event.queryStringParameters || {};
  if (q.fileID) return String(q.fileID);
  if (q.fileId) return String(q.fileId);
  
  if (event.data && typeof event.data === 'object') {
    return pickFileID(event.data);
  }
  return '';
}

exports.main = async (event = {}, context = {}) => {
  try {
    const fileID = pickFileID(event);
    console.log(LOG_TAG, '收到请求', { 
      fileID, 
      hasUniCloud: typeof uniCloud !== 'undefined',
      eventKeys: Object.keys(event)
    });

    if (!fileID) {
      return {
        code: 400,
        message: '缺少 fileID 参数',
      };
    }

    if (!fileID.startsWith('cloud://')) {
      return {
        code: 400,
        message: 'fileID 必须以 cloud:// 开头',
      };
    }

    // 支付宝云环境检查
    if (typeof uniCloud === 'undefined') {
      console.error(LOG_TAG, 'uniCloud 全局对象不存在');
      return {
        code: 500,
        message: '运行环境缺少 uniCloud 对象',
      };
    }

    // 支付宝云使用 getTempFileURL 获取临时下载链接，再通过 HTTP 下载
    console.log(LOG_TAG, '开始获取临时下载链接');
    
    let tempUrl = '';
    try {
      const result = await uniCloud.getTempFileURL({
        fileList: [fileID]
      });
      console.log(LOG_TAG, 'getTempFileURL 返回', JSON.stringify(result));
      
      if (result && result.fileList && result.fileList[0]) {
        tempUrl = result.fileList[0].tempFileURL || result.fileList[0].download_url;
      }
    } catch (err) {
      console.error(LOG_TAG, 'getTempFileURL 失败', err);
      return {
        code: 500,
        message: 'getTempFileURL 失败: ' + (err.message || String(err)),
      };
    }

    if (!tempUrl) {
      return {
        code: 500,
        message: '无法获取云存储文件的临时链接',
      };
    }

    console.log(LOG_TAG, '临时链接获取成功，开始下载', tempUrl);

    // 通过 uniCloud.httpclient 下载文件内容
    let content = '';
    try {
      const httpRes = await uniCloud.httpclient.request(tempUrl, {
        method: 'GET',
        dataType: 'text',
        timeout: 30000
      });
      
      console.log(LOG_TAG, 'HTTP 下载完成', {
        status: httpRes.status,
        contentLength: httpRes.data ? httpRes.data.length : 0
      });
      
      if (httpRes.status === 200 && httpRes.data) {
        content = String(httpRes.data);
      } else {
        return {
          code: 500,
          message: `HTTP 下载失败，状态码: ${httpRes.status}`,
        };
      }
    } catch (err) {
      console.error(LOG_TAG, 'HTTP 下载失败', err);
      return {
        code: 500,
        message: 'HTTP 下载失败: ' + (err.message || String(err)),
      };
    }

    console.log(LOG_TAG, '成功返回内容', { contentLength: content.length });
    
    return {
      code: 0,
      fileID,
      content,
      contentLength: content.length,
    };

  } catch (error) {
    console.error(LOG_TAG, '未捕获的异常', error);
    return {
      code: 500,
      message: '云函数执行异常: ' + (error.message || String(error)),
      stack: error.stack
    };
  }
};
