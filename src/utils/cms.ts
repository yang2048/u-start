import _ from 'lodash';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { request } from '@/services/request'


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
      // url = buildUrl(site.api, `&t=1&ac=videolist`);
    } else if (site.type === 6) {
      url = buildUrl(site.api, `&extend=${site.ext}&filter=true`)
    } else if (site.type === 8) {
      url = buildUrl(site.api, `/home`)
    }

    let response
    if (site.type !== 8) {
      response = await request.Get(url!)
    } else {
      response = await request.Post(url!)
    }

    //0需处理xml parser.parse(response)
    if (site.type === 0 ) {
      console.warn('TODO: type0需处理xml ')
    }
    const json:any = response
    // const json = site.type !== 0 ? parser.parse(response) : response

    const jsondata = json.rss || json

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
        filters[key].forEach((item) => {
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

    //0需处理xml parser.parse(response)
    if (site.type === 0 ) {
      console.warn('TODO: type0需处理xml ')
    }
    const json:any = response
    // const json = site.type === 0 ? JSON.parse(response) : response;

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
 * 获取资源列表
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