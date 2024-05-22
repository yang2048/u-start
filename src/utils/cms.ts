import _ from 'lodash';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { request } from '@/services/request'
import {parse, serialize} from 'forgiving-xml-parser';


/**
 * 获取资源分类 和 所有资源的总数, 分页等信息
 * @param {*} site 资源配置
 * @returns
 */
export const fetchClassify = async (site:any) => {
  try {
    let url, classData, page, pagecount, limit, total, filters: any

    if (site.type === 1 || site.type === 0) {
      url = buildUrl(site.api, `?ac=class`)
    } else if (site.type === 2) {
      url = buildUrl(site.api, `&t=1&ac=videolist`)
    } else if (site.type === 3) {
      url = buildUrl(site.api, `/nav`)
    } else if (site.type === 4) {
      url = buildUrl(site.api, `/types`)
    } else if (site.type === 5) {
      url = buildUrl(site.api, `&t=1&ac=videolist`);
    } else if (site.type === 6) {
      url = buildUrl(site.api, `&extend=${site.ext}&filter=true`)
    } else if (site.type === 7) {
      // const content: any = await t3Work({ type: 'home' });
      const res = {
        page: 1,
        pagecount: 9999,
        limit: 20,
        total: 9999
      };
      return res;
    } else if (site.type === 8) {
      url = buildUrl(site.api, `/home`)
    }

    let response
    if (site.type !== 8) {
      // response = await uni.$uv.http.get(url)
      response = await request.Get(url!, {
        // enableHttp2: true,
        // sslVerify: true,
        // withCredentials: true,
        // headers: {'Access-Control-Allow-Origin': '*'}
      })
    } else {
      response = await request.Post(url!)
    }

    const json:any = site.type === 0 ? parse(response) : response;

    const jsondata = json.rss || json

    //过滤
    const cmsFilterData = [
      {
        key: 'area',
        name: '地区',
        value: [
          {
            n: '全部',
            v: '',
          },
        ],
      },
      {
        key: 'year',
        name: '年份',
        value: [
          {
            n: '全部',
            v: '',
          },
        ],
      },
      {
        key: 'sort',
        name: '排序',
        value: [
          {
            n: '按更新时间',
            v: '按更新时间',
          },
          {
            n: '按上映年份',
            v: '按上映年份',
          },
          {
            n: '按片名',
            v: '按片名',
          },
        ],
      },
    ]

    if (site.type === 0) {
      // 有些网站返回的分类名里会含有一串包含在{}内的字符串,移除掉
      classData = jsondata.class.ty.map((item: { _id: any; _t: string; }) => ({
        type_id: item._id,
        type_name: item._t.replace(/\{.*\}/i, ''),
      }))
      classData.unshift({
        type_id: 0,
        type_name: '最新',
      })
      page = jsondata.list._page
      pagecount = jsondata.list._pagecount
      limit = parseInt(jsondata.list._pagesize)
      total = jsondata.list._recordcount

      filters = {}
      for (let item of classData) {
        const key = item.type_id
        filters[key] = cmsFilterData
      }
    } else if (site.type === 1) {
      classData = jsondata.class
      classData.unshift({
        type_id: 0,
        type_name: '最新',
      })
      page = jsondata.page
      pagecount = jsondata.pagecount
      limit = parseInt(jsondata.limit)
      total = jsondata.total

      filters = {}
      for (let item of classData) {
        const key = item.type_id
        filters[key] = cmsFilterData
      }
    } else if (site.type === 2) {
      const resClass = await request.Get(site.api)
      const jsonClass:any = resClass
      const jsondataClass = jsonClass?.rss === undefined ? jsonClass : jsonClass.rss
      classData = jsondataClass.class
      page = jsondata.page
      pagecount = jsondata.pagecount
      limit = parseInt(jsondata.limit)
      total = jsondata.total
      filters = jsonClass?.filters === undefined ? [] : jsonClass.filters
    } else if (site.type === 3 || site.type === 4) {
      if (site.type === 3) classData = jsondata.data || jsondata.list
      else if (site.type === 4) classData = jsondata.data.list
      page = 1
      pagecount = 9999
      limit = 20
      total = 9999
      filters = {}

      if (site.type === 4) {
        const response:any = await request.Get(removeTrailingSlash(site.api))
        
        limit = response.limit
        total = response.total
      }

      classData.forEach((classItem:any) => {
        if (classItem.type_extend) {
          const result: any = []
          for (const key in classItem.type_extend) {
            const value = classItem.type_extend[key]
            if (!_.isEmpty(value) && !['star', 'state', 'version', 'director'].includes(key)) {
              const valueList = value.split(',').map((item: string) => item.trim())
              const options = valueList.map((value: string) => ({ n: value === '全部' ? '全部' : value, v: value }))
              const name = (_.find(CLASS_FILTER_CONFIG, { key }) || {}).desc
              result.push({ key, name, value: [{ n: '全部', v: '' }, ...options] })
            }
          }
          filters[classItem.type_id] = result
        }
      })
    } else if (site.type === 6) {
      page = 1
      pagecount = 9999
      limit = 20
      total = 9999
      filters = {}

      classData = jsondata.class
      if (classData) {
        const url = buildUrl(site.api, `&extend=${site.ext}&ac=videolist&t=${classData[0].type_id}&pg=1`)
        const response:any = await request.Get(url!)
        page = response.page
        pagecount = response.pagecount
        limit = parseInt(response.limit)
        total = response.total
      }
      filters = jsondata?.filters === undefined ? [] : jsondata.filters
    } else if (site.type === 8) {
      page = 1
      pagecount = 9999
      limit = 20
      total = 9999
      filters = {}

      classData = jsondata.class
      // if (classData) {
      //   const category_url = buildUrl(site.api, `&extend=${site.ext}&ac=videolist&t=${classData[0].type_id}&pg=1`);
      //   const category_res = await axios.get(category_url);
      //   const category_json = category_res.data;
      //   page = category_json.page;
      //   pagecount = category_json.pagecount;
      //   limit = parseInt(category_json.limit);
      //   total = category_json.total;
      // }
      filters = jsondata?.filters === undefined ? [] : jsondata.filters
      Object.keys(filters).forEach((key) => {
        filters[key].forEach((item:any) => {
          if (!item.name) {
            item.name = item.key
          }
        })
      })
    }

    return {
      classData,
      page,
      pagecount,
      limit,
      total,
      filters,
    }
  } catch (err) {
    throw err
  }
}

/**
 * 检查资源
 * @param {*} site 资源配置
 * @returns boolean
 */
export const checkValid = async (site:any) => {
  try {
    const data:any = await fetchClassify(site);
    return {
      status: !_.isEmpty(data.classData),
      resource: data.total,
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      resource: 0,
    };
  }
};

/**
 * 获取资源列表
 * @param site 
 * @param pg 
 * @param t 
 * @param f 
 * @returns 
 */
export const fetchList = async (site:any, pg = 1, t:number, f = {}) => {
  try {
    let url, postData;
    if (site.type === 3) {
      url = buildUrl(site.api, `video?tid=${t}&pg=${pg}`);
      if (Object.keys(f).length !== 0) {
        url = buildUrl(url, `&${f}`);
      }
    } else if (site.type === 4) {
      url = buildUrl(site.api, `?tid=${t}&page=${pg}`);
      if (Object.keys(f).length !== 0) {
        url = buildUrl(url, `&${f}`);
      }
    } else if (site.type === 6) {
      url = buildUrl(site.api, `?ac=videolist&t=${t}&pg=${pg}&extend=${site.ext}`);
      if (Object.keys(f).length !== 0) {
        const encodedStr = Base64.stringify(Utf8.parse(JSON.stringify(f)));
        url = buildUrl(url, `&ext=${encodedStr}`);
      }
    } else if (site.type === 7) {
      // const res: any = await t3Work({
      //   type: 'category',
      //   data: { tid: t, pg, filter: _.size(f) ? true : false, extend: _.size(f) ? f : {} },
      // });
      return [];
    } else if (site.type === 8) {
      url = buildUrl(site.api, `/category`);
      postData = {
        id: t,
        page: pg,
        filters: f,
      };
    } else {
      url = buildUrl(site.api, `?ac=videolist&t=${t}&pg=${pg}`);
      if (Object.keys(f).length !== 0 && site.type === 2) {
        url = buildUrl(url, `&f=${JSON.stringify(f)}`);
      }
    }
    console.info("fetchList==", url);
    let response;
    if (site.type !== 8) {
      response = await request.Get(url!)
    } else {
      response = await request.Post(url, postData)
    }

    const json = site.type === 0 ? parse(response) : response;

    const jsondata = json.rss || json;
    let videoList = jsondata.list || jsondata.data || [];

    if (site.type === 0) {
      videoList = convertVideoList(jsondata.list.video);
    } else if (site.type === 3) {
      videoList = jsondata.data || jsondata.list;
    } else if (site.type === 4) {
      videoList = jsondata.data.list;
    }
    return videoList;
  } catch (err) {
    throw err;
  }
};

/**
 * 资源列表转换
 * @param {*} site 资源配置
 * @param {number} [pg=1] 翻页 page
 * @param {*} t 分类 type
 * @returns
 */
const convertVideoList = (videoItems:any) => {
  return videoItems.map(
    ({
      id: vod_id,
      tid: type_id,
      type: type_name,
      pic: vod_pic,
      note: vod_remark,
      name: vod_name,
      des: vod_content,
      year: vod_year,
      area: vod_area,
      director: vod_director,
      actor: vod_actor,
    }) => ({
      vod_id,
      type_id,
      type_name,
      vod_pic,
      vod_remark,
      vod_name,
      vod_blurb: removeHTMLTagsAndSpaces(vod_content),
      vod_year: _.toString(vod_year),
      vod_area,
      vod_content,
      vod_director,
      vod_actor,
    }),
  );
};

/**
 * 搜索资源转换
 * @param {*} site 资源配置
 * @param {*} wd 搜索关键字
 * @returns
 */
const convertSearchList = (searchItem:any) => {
  const result = searchItem.map((item:any) => {
    const {
      id: vod_id,
      tid: type_id,
      type: type_name,
      note: vod_remark,
      name: vod_name,
      last: vod_time,
      dt: vod_play_from,
    } = item;
    return {
      vod_id,
      type_id,
      type_name,
      vod_remark,
      vod_name,
      vod_time,
      vod_play_from,
    };
  });

  return result;
};

/**
 * 获取资源详情转换
 * @param {*} site 资源配置
 * @param {*} id 资源唯一标识符 id
 * @returns
 */
const convertDetailList = (detailItems:any) => {
  const vodPlayFrom = (dldd:any) => {
    if (_.isArray(dldd)) {
      return dldd.map((item) => item._flag).join('$$$');
    } else {
      return dldd._flag;
    }
  };
  const vodPlayUrl = (dldd:any) => {
    if (_.isArray(dldd)) {
      return dldd.map((item) => item._t).join('$$$');
    } else {
      return dldd._t;
    }
  };

  return detailItems.map(
    ({
      id: vod_id,
      tid: type_id,
      type: type_name,
      pic: vod_pic,
      note: vod_remark,
      name: vod_name,
      des: vod_content,
      year: vod_year,
      area: vod_area,
      director: vod_director,
      actor: vod_actor,
      dl: { dd: dldd },
    }) => ({
      vod_id,
      type_id,
      type_name,
      vod_pic,
      vod_remark,
      vod_name,
      vod_blurb: removeHTMLTagsAndSpaces(vod_content),
      vod_year,
      vod_area,
      vod_content,
      vod_director,
      vod_actor,
      vod_play_from: vodPlayFrom(dldd),
      vod_play_url: vodPlayUrl(dldd),
    }),
  );
};

const removeHTMLTagsAndSpaces = (str:string) => {
  // 去除HTML标签
  const strippedString = str.replace(/(<([^>]+)>)/gi, '')
  // 去除空格
  const trimmedString = strippedString.replace(/\s+/g, '')
  return trimmedString
}

const buildUrl = (url:string, paramsStr:string) => {
  // const u = new URL(url)
  // const api = u.origin + u.pathname.replace(/\/$/, '')
  // const params = new URLSearchParams(u.search)

  // if (paramsStr.startsWith('?') || paramsStr.startsWith('&')) {
  //   const p = new URLSearchParams(paramsStr)
  //   p.forEach((value, key) => params.set(key, value))
  //   return api + '?' + params.toString()
  // } else {
    const cleanParamsStr = paramsStr.startsWith('/') ? paramsStr.slice(1) : paramsStr
    // return api + (cleanParamsStr ? '/' + cleanParamsStr : '')
  // }
  url = url.endsWith('/') ? url.substring(0, url.length - 1) : paramsStr
  return url + (cleanParamsStr ? '/' + cleanParamsStr : '')
}

const removeTrailingSlash = (url:string) => {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const reptileApiFormat = (item:any, key:string) => {
  try {
    const itemJson = JSON.parse(item);
    const marryRes = itemJson[key];
    if (marryRes) {
      const formatRes = marryRes.replace(/&&&/g, "'");
      return formatRes;
    }
  } catch (error) {
    console.error('Error occurred while parsing JSON:', error);
    return '';
  }
};

const reptileXpathFormat = (item:any, pat:any) => {
  try {
    // const doc = new DOMParser().parseFromString(item);
    // const res: any = xpath.select(pat, doc);
    const res: any = null;
    if (res && res.length > 0) {
      return res.map((item: any) => item.textContent);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error occurred while parsing or selecting XPath:', error);
    return [];
  }
};

/**
 * 查询热门词
 * @param date 日期
 * @param type 1全部 2aqy 3tx 4yk 5mg
 */
export const fetchFullHot = async (date: string, type: number) => {
  let response = await request.Get('https://www.ky.live/api/fullhot', {
    params: {
      vt: 2,
      sd: date,
      plt: type
    }
  })
  return response;
}

/**
 * 获取搜索结果
 * @param site 
 * @param wd 
 */
export const fetchSearch = async (site:any, wd:string) => {
  if (site.type === 7) {
    // const res: any = await t3Work({ type: 'search', data: { wd, quick: false, pg: 1 } });
    const res: any = {}
    return res.data?.list;
  }

  let url, postData;
  if (site.type === 3) url = buildUrl(site.api, `/search?text=${encodeURIComponent(wd)}`);
  else if (site.type === 5) url = `${reptileApiFormat(site.api, 'websearchurl')}${encodeURIComponent(wd)}`;
  else if (site.type === 6) url = buildUrl(site.api, `?wd=${encodeURIComponent(wd)}&extend=${site.ext}`);
  else if (site.type === 8) {
    url = buildUrl(site.api, `/search`);
    postData = {
      wd,
      pg: 1,
    };
  } else url = buildUrl(site.api, `?wd=${encodeURIComponent(wd)}`);

  let response;
  if (site.type !== 8) {
    response = await request.Get(url)
  } else {
    response = await request.Post(url, postData)
  }

  const json = site.type === 0 ? parse(response) : response;

  //爬虫解析
  if (site.type === 5) {
    const searchnamePat = reptileApiFormat(site.api, 'searchname');
    const searchnameRes = reptileXpathFormat(json, searchnamePat);
    const searchidPat = reptileApiFormat(site.api, 'searchid');
    const searchidRes = reptileXpathFormat(json, searchidPat);
    const searchpicPat = reptileApiFormat(site.api, 'searchpic');
    const searchpicRes = reptileXpathFormat(json, searchpicPat);
    const searchstarrPat = reptileApiFormat(site.api, 'searchstarr');
    const searchstarrRes = reptileXpathFormat(json, searchstarrPat);

    let zippedData = _.zip(searchnameRes, searchidRes, searchpicRes, searchstarrRes);
    let list = zippedData.map((item) => {
      return {
        vod_name: item[0],
        vod_id: item[1],
        vod_pic: item[2],
        vod_remarks: item[3],
      };
    });
    return list;
  }

  const jsondata = json?.rss ?? json;
  if (!jsondata) return null;

  let videoList = jsondata.data || jsondata.list || [];
  if (site.type === 0) {
    videoList = jsondata.list.video;
    if (!_.isArray(videoList)) videoList = [videoList];
    videoList = convertSearchList(videoList);
  } else if (site.type === 4) {
    videoList = jsondata.data.list;
  }
  if (videoList.length === 0) return null;

  return videoList;
}

/**
 * 查询搜索结果详情
 * @param site 
 * @param id 
 */
export const fetchDetail = async (site:any, id:string)  => {
  let url, postData;
  if (site.type === 3) {
    url = buildUrl(site.api, `/video_detail?id=${id}`);
  } else if (site.type === 4) {
    url = buildUrl(site.api, `/detail?vod_id=${id}`);
  } else if (site.type === 5) {
    url = id.startsWith('http') ? id : `${reptileApiFormat(site.api, 'searchUrl')}${id}`;
  } else if (site.type === 6) {
    url = buildUrl(site.api, `?ac=detail&ids=${id}&extend=${site.ext}`);
  } else if (site.type === 7) {
    // const res: any = await t3Work({ type: 'detail', data: `${id}` });
    return [];
  } else if (site.type === 8) {
    url = buildUrl(site.api, `/detail`);
    postData = {
      id,
    };
  } else {
    url = buildUrl(site.api, `?ac=detail&ids=${id}`);
  }

  let response;
  if (site.type !== 8) {
    response = await request.Get(url)
  } else {
    response = await request.Post(url, postData)
  }

  const json = site.type === 0 ? parse(response) : response;

  if (site.type === 5) {
    const detaillistPat = reptileApiFormat(site.api, 'detaillist');
    const detaillistRes = reptileXpathFormat(json, detaillistPat);
    const detailxlPat = reptileApiFormat(site.api, 'detailxl');
    const detailxlRes = reptileXpathFormat(json, detailxlPat);
    const detailjsPat = reptileApiFormat(site.api, 'detailjs');
    const detailjsRes = reptileXpathFormat(json, detailjsPat);
    const detailjsurlPat = reptileApiFormat(site.api, 'detailjsurl');
    const detailjsurlRes = reptileXpathFormat(json, detailjsurlPat);

    const vod_from = detailxlRes.join('$$$');
    let zippedData = _.zip(detaillistRes, detailjsurlRes);
    console.log(detaillistRes, detailjsurlRes);
    console.log(vod_from);
    let list = {
      vod_from,
      vod_url: [],
    };
    return list;
  }

  const jsondata = json?.rss ?? json;
  let videoList = jsondata.data || jsondata.list || [];
  // 坑: 单条结果是dict 多条结果list
  if (site.type === 0) {
    videoList = jsondata.list.video;
    if (!_.isArray(videoList)) videoList = [videoList];
    videoList = convertDetailList(videoList);
  } else if (site.type === 3) {
    videoList = jsondata.data;
    if (!_.isArray(videoList)) videoList = [videoList];
  } else if (site.type === 4) {
    videoList = jsondata.data.list;
  }

  return videoList ? videoList : [];
}

export const parseChannel = async (type: 'local' | 'remote' | 'url', path: string) => {
  try {
    let fileContent:any;
    if (type === 'local') {
      console.info('不支持本地')
    } else if (type === 'remote') {
      const response = await request.Get(path)
      fileContent = response;
    } else {
      fileContent = path;
    }
    if (fileContent) {
      fileContent = fileContent.trim();
      let channelContent;

      if (fileContent.startsWith('#EXTM3U')) {
        channelContent = m3u(fileContent);
      } else {
        channelContent = txt(fileContent);
      }

      for (let i = 0; i < channelContent.length; i++) {
        const dataItem = channelContent[i];
        if (_.has(dataItem, 'id')) {
          // 使用 _.isString() 检查 dataItem.id 是否为字符串类型
          if (!_.isString(dataItem.id)) {
            channelContent[i].id = `${channelContent[i].id.id}`;
          }
        } else {
          channelContent[i].id = Math.floor(Math.random() * 9999999999).toString(32);
        }
      }

      return channelContent;
    }
    return [];
  } catch (err) {
    throw err;
  }
};

export const checkChannel = async (url: string) => {
  try {
    const startTime: Date = new Date(); // 记录开始请求的时间
    await await request.Get(url)
    const endTime: Date = new Date(); // 记录接收到响应的时间
    const delay: number = endTime.getTime() - startTime.getTime(); // 计算延迟
    return delay;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const m3u = (text: string) => {
  const GROUP = /.*group-title="(.?|.+?)".*/i;
  const LOGO = /.*tvg-logo="(.?|.+?)".*/i;
  const NAME = /.*,(.+?)(?:$|\n|\s)/i;

  const docs:any = [];
  let doc: { name?: any; logo?: any; group?: any; url?: any };
  const splitList = text.split('\n');
  splitList.forEach((line: string) => {
    if (line.startsWith('#EXTINF:')) {
      doc = {}; // 切断指针的联系
      doc.name = line.match(NAME) ? line.match(NAME)[1] : '';
      doc.logo = line.match(LOGO) ? line.match(LOGO)[1] : '';
      doc.group = line.match(GROUP) ? line.match(GROUP)[1] : '';
    } else if (line.indexOf('://') > -1) {
      if (line.startsWith('#EXT-X-SUB-URL')) return; // #EXT-X-SUB-URL https://ghproxy.com/https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u
      if (line.startsWith('#EXTM3U')) return; // #EXTM3U url-tvg="http://epg.51zmt.top:8000/e.xml,https://epg.112114.xyz/pp.xml
      doc.url = line;
      docs.push(doc);
    }
  });
  return docs;
};

const txt = (text: string) => {
  const docs:any = [];
  let group: any;
  const splitList = text.split('\n');
  splitList.forEach((line: string) => {
    const split = line.split(',');
    if (split.length < 2) return;
    if (line.indexOf('#genre#') > -1) [group] = split;
    if (split[1].indexOf('://') > -1) {
      const doc = {
        name: split[0],
        url: split[1],
        group,
      };
      docs.push(doc);
    }
  });
  return docs;
};

const CLASS_FILTER_CONFIG = [
  {
    key: 'area',
    desc: '地区',
  },
  {
    key: 'class',
    desc: '剧情',
  },
  {
    key: 'director',
    desc: '导演',
  },
  {
    key: 'lang',
    desc: '语言',
  },
  {
    key: 'star',
    desc: '明星',
  },
  {
    key: 'state',
    desc: '状态',
  },
  {
    key: 'version',
    desc: '版本',
  },
  {
    key: 'year',
    desc: '年份',
  },
  {
    key: 'sort',
    desc: '排序',
  },
];

const typeEum = [
  {id: 0, text: 'cms[xml]'},
  {id: 1, text: 'cms[json]'},
  {id: 2, text: 'drpy[js0]'},
  {id: 3, text: 'app[v3]'},
  {id: 4, text: 'app[v1]'},
  {id: 5, text: '爬虫'},
  {id: 6, text: 'hipy[t4]'},
  {id: 7, text: 'js[t3]'},
  {id: 8, text: 'catvod[nodejs]'},
]