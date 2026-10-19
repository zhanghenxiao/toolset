'use strict';

/**
 * 解析网盘分享链接并返回直链
 * 支持夸克网盘和百度网盘
 * 
 * 输入参数：
 * - readUrl: 网盘分享链接（必填）
 * - password: 提取码（选填）
 * 
 * 返回：
 * - success: 是否成功
 * - data.url: 直接下载地址
 * - data.filename: 文件名
 * - data.expires: 有效期（秒）
 */

function isQuarkUrl(url) {
  return /pan\.quark\.cn/i.test(url);
}

function isBaiduUrl(url) {
  return /pan\.baidu\.com|pcs\.baidu\.com|pcsdata\.baidu\.com/i.test(url);
}

// 已是百度下载节点直链（pcs.baidu.com / pcsdata.baidu.com），可直接下载
function isBaiduDirectUrl(url) {
  return /pcs\.baidu\.com|pcsdata\.baidu\.com/i.test(url);
}

function extractPassword(url) {
  // 从 URL 中提取提取码，如 ?pwd=xxxx
  const match = url.match(/[?&]pwd=([^&]+)/i);
  return match ? match[1] : '';
}

/**
 * 解析夸克网盘直链
 * 注意：需要夸克网盘 Cookie 或 API Token
 */
async function parseQuarkDirectUrl(shareUrl, password) {
  try {
    // 1. 从分享链接提取 share_id
    const shareId = extractQuarkShareId(shareUrl);
    if (!shareId) {
      return {
        success: false,
        errCode: 'INVALID_SHARE_URL',
        errMsg: '无效的夸克分享链接'
      };
    }

    // 2. 获取夸克 Cookie（从环境变量或远程 URL）
    let quarkCookie = process.env.QUARK_COOKIE;
    
    // 如果配置了 QUARK_COOKIE_URL，从远程获取
    if (!quarkCookie && process.env.QUARK_COOKIE_URL) {
      try {
        const res = await uniCloud.httpclient.request(process.env.QUARK_COOKIE_URL, {
          method: 'GET',
          dataType: 'text',
          timeout: 5000
        });
        if (res.status === 200 && res.data) {
          quarkCookie = res.data.trim();
        }
      } catch (error) {
        console.error('从远程获取 Cookie 失败:', error);
      }
    }
    
    if (!quarkCookie) {
      return {
        success: false,
        errCode: 'MISSING_COOKIE',
        errMsg: '未配置夸克网盘 Cookie，请在云函数环境变量中设置 QUARK_COOKIE 或 QUARK_COOKIE_URL'
      };
    }

    // 3. 调用夸克 API 获取分享详情
    const shareDetail = await getQuarkShareDetail(shareId, password, quarkCookie);
    if (!shareDetail || !shareDetail.fid) {
      return {
        success: false,
        errCode: 'SHARE_NOT_FOUND',
        errMsg: '无法获取分享文件信息'
      };
    }

    // 4. 获取下载直链
    const downloadUrl = await getQuarkDownloadUrl(shareId, shareDetail.fid, quarkCookie);
    if (!downloadUrl) {
      return {
        success: false,
        errCode: 'NO_DOWNLOAD_URL',
        errMsg: '无法生成下载直链'
      };
    }

    return {
      success: true,
      data: {
        url: downloadUrl,
        filename: shareDetail.filename || '',
        expires: 3600 // 直链通常有效期 1 小时
      }
    };

  } catch (error) {
    console.error('解析夸克网盘失败:', error);
    return {
      success: false,
      errCode: 'QUARK_PARSE_ERROR',
      errMsg: error.message || '解析夸克网盘失败'
    };
  }
}

/**
 * 从夸克分享链接提取 share_id
 */
function extractQuarkShareId(url) {
  // https://pan.quark.cn/s/bf5bff7779c4 -> bf5bff7779c4
  const match = url.match(/pan\.quark\.cn\/s\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * 获取夸克分享详情
 */
async function getQuarkShareDetail(shareId, password, cookie) {
  const apiUrl = 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail';
  
  try {
    const res = await uniCloud.httpclient.request(apiUrl, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      data: {
        pwd_id: shareId,
        passcode: password || ''
      },
      dataType: 'json',
      timeout: 10000
    });

    if (res.status === 200 && res.data && res.data.data) {
      const files = res.data.data.list || [];
      // 通常第一个文件就是分享的文件
      const firstFile = files[0];
      return {
        fid: firstFile?.fid,
        filename: firstFile?.file_name
      };
    }

    return null;
  } catch (error) {
    console.error('获取夸克分享详情失败:', error);
    throw error;
  }
}

/**
 * 获取夸克下载直链
 */
async function getQuarkDownloadUrl(shareId, fid, cookie) {
  const apiUrl = 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/download';
  
  try {
    const res = await uniCloud.httpclient.request(apiUrl, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      data: {
        pwd_id: shareId,
        fid_list: [fid]
      },
      dataType: 'json',
      timeout: 10000
    });

    if (res.status === 200 && res.data && res.data.data) {
      const downloadInfo = res.data.data[0];
      return downloadInfo?.download_url || null;
    }

    return null;
  } catch (error) {
    console.error('获取夸克下载链接失败:', error);
    throw error;
  }
}

/**
 * 解析百度网盘直链
 * 注意：需要百度网盘 Cookie 或开放平台 API
 */
async function parseBaiduDirectUrl(shareUrl, password) {
  try {
    // 1. 提取分享 ID
    const shareId = extractBaiduShareId(shareUrl);
    if (!shareId) {
      return {
        success: false,
        errCode: 'INVALID_SHARE_URL',
        errMsg: '无效的百度网盘分享链接'
      };
    }

    // 2. 获取百度网盘 Cookie（从环境变量或远程 URL）
    let baiduCookie = process.env.BAIDU_COOKIE;
    
    // 如果配置了 BAIDU_COOKIE_URL，从远程获取
    if (!baiduCookie && process.env.BAIDU_COOKIE_URL) {
      try {
        const res = await uniCloud.httpclient.request(process.env.BAIDU_COOKIE_URL, {
          method: 'GET',
          dataType: 'text',
          timeout: 5000
        });
        if (res.status === 200 && res.data) {
          baiduCookie = res.data.trim();
        }
      } catch (error) {
        console.error('从远程获取百度 Cookie 失败:', error);
      }
    }
    
    if (!baiduCookie) {
      return {
        success: false,
        errCode: 'MISSING_COOKIE',
        errMsg: '未配置百度网盘 Cookie，请在云函数环境变量中设置 BAIDU_COOKIE 或 BAIDU_COOKIE_URL'
      };
    }

    // 3. 验证提取码（如果有）
    if (password) {
      const verifyResult = await verifyBaiduPassword(shareId, password, baiduCookie);
      if (!verifyResult) {
        return {
          success: false,
          errCode: 'PASSWORD_ERROR',
          errMsg: '提取码错误'
        };
      }
    }

    // 4. 获取文件列表
    const fileList = await getBaiduFileList(shareId, baiduCookie);
    if (!fileList || fileList.length === 0) {
      return {
        success: false,
        errCode: 'NO_FILES',
        errMsg: '未找到分享文件'
      };
    }

    // 5. 获取下载直链
    const firstFile = fileList[0];
    const downloadUrl = await getBaiduDownloadUrl(shareId, firstFile.fs_id, baiduCookie);
    if (!downloadUrl) {
      return {
        success: false,
        errCode: 'NO_DOWNLOAD_URL',
        errMsg: '无法生成下载直链'
      };
    }

    return {
      success: true,
      data: {
        url: downloadUrl,
        filename: firstFile.server_filename || '',
        expires: 3600
      }
    };

  } catch (error) {
    console.error('解析百度网盘失败:', error);
    return {
      success: false,
      errCode: 'BAIDU_PARSE_ERROR',
      errMsg: error.message || '解析百度网盘失败'
    };
  }
}

/**
 * 从百度网盘分享链接提取 share_id
 */
function extractBaiduShareId(url) {
  // https://pan.baidu.com/s/1abc123 -> 1abc123
  const match = url.match(/pan\.baidu\.com\/s\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * 验证百度网盘提取码
 */
async function verifyBaiduPassword(shareId, password, cookie) {
  const apiUrl = 'https://pan.baidu.com/share/verify';
  
  try {
    const res = await uniCloud.httpclient.request(apiUrl, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      data: `pwd=${password}&surl=${shareId}`,
      dataType: 'json',
      timeout: 10000
    });

    return res.status === 200 && res.data && res.data.errno === 0;
  } catch (error) {
    console.error('验证百度提取码失败:', error);
    return false;
  }
}

/**
 * 获取百度网盘文件列表
 */
async function getBaiduFileList(shareId, cookie) {
  const apiUrl = `https://pan.baidu.com/share/list?shorturl=${shareId}&root=1`;
  
  try {
    const res = await uniCloud.httpclient.request(apiUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      dataType: 'json',
      timeout: 10000
    });

    if (res.status === 200 && res.data && res.data.list) {
      return res.data.list;
    }

    return [];
  } catch (error) {
    console.error('获取百度文件列表失败:', error);
    throw error;
  }
}

/**
 * 获取百度网盘下载直链
 */
async function getBaiduDownloadUrl(shareId, fsId, cookie) {
  const apiUrl = 'https://pan.baidu.com/api/sharedownload';
  
  try {
    const res = await uniCloud.httpclient.request(apiUrl, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      data: `sign=&timestamp=&fid_list=[${fsId}]&shorturl=${shareId}`,
      dataType: 'json',
      timeout: 10000
    });

    if (res.status === 200 && res.data && res.data.dlink) {
      return `https://pan.baidu.com${res.data.dlink}`;
    }

    return null;
  } catch (error) {
    console.error('获取百度下载链接失败:', error);
    throw error;
  }
}


/**
 * 通过 HTTP 请求获取直链（适用于已有解析服务的情况）
 */
async function parseViaHttpService(shareUrl, password) {
  // 如果有第三方解析服务，可以在这里调用
  // 例如自建的网盘解析 API
  
  const parseApiUrl = process.env.PAN_PARSE_API;
  if (!parseApiUrl) {
    return {
      success: false,
      errCode: 'NO_PARSE_SERVICE',
      errMsg: '未配置网盘解析服务'
    };
  }

  try {
    const res = await uniCloud.httpclient.request(parseApiUrl, {
      method: 'POST',
      data: {
        url: shareUrl,
        password: password
      },
      dataType: 'json',
      timeout: 10000
    });

    if (res.status === 200 && res.data && res.data.url) {
      return {
        success: true,
        data: {
          url: res.data.url,
          filename: res.data.filename || '',
          expires: res.data.expires || 3600
        }
      };
    }

    return {
      success: false,
      errCode: 'PARSE_FAILED',
      errMsg: res.data?.message || '解析失败'
    };
  } catch (error) {
    return {
      success: false,
      errCode: 'PARSE_SERVICE_ERROR',
      errMsg: error.message || '解析服务异常'
    };
  }
}

exports.main = async (event = {}) => {
  try {
    const readUrl = event.readUrl || event.url || event.shareUrl;
    
    if (!readUrl) {
      return {
        success: false,
        errCode: 'INVALID_PARAMS',
        errMsg: '缺少网盘分享链接'
      };
    }

    // 提取提取码
    const password = event.password || event.pwd || extractPassword(readUrl);

    // 判断网盘类型
    if (isQuarkUrl(readUrl)) {
      console.log('解析夸克网盘链接:', readUrl);
      
      // 优先尝试第三方解析服务
      if (process.env.PAN_PARSE_API) {
        const result = await parseViaHttpService(readUrl, password);
        if (result.success) return result;
      }
      
      // 回退到内置解析（需要配置）
      return await parseQuarkDirectUrl(readUrl, password);
      
    } else if (isBaiduDirectUrl(readUrl)) {
      // 已是百度下载节点直链，直接使用，不再走分享页解析
      console.log('百度直链，直接使用:', readUrl);
      return {
        success: true,
        data: {
          url: readUrl,
          filename: '',
          expires: 3600
        }
      };

    } else if (isBaiduUrl(readUrl)) {
      console.log('解析百度网盘链接:', readUrl);
      
      // 优先尝试第三方解析服务
      if (process.env.PAN_PARSE_API) {
        const result = await parseViaHttpService(readUrl, password);
        if (result.success) return result;
      }
      
      // 回退到内置解析（需要配置）
      return await parseBaiduDirectUrl(readUrl, password);
      
    } else {
      // 其他链接直接返回
      return {
        success: true,
        data: {
          url: readUrl,
          filename: '',
          expires: 3600
        }
      };
    }

  } catch (error) {
    console.error('解析网盘链接失败:', error);
    return {
      success: false,
      errCode: error.code || 'PARSE_ERROR',
      errMsg: error.message || '解析网盘链接失败'
    };
  }
};
