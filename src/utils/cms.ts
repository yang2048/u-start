const fetchList = async (site, pg = 1, t, f = {}) => {
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
      }
    //    else if (site.type === 6) {
    //     url = buildUrl(site.api, `?ac=videolist&t=${t}&pg=${pg}&extend=${site.ext}`);
    //     if (Object.keys(f).length !== 0) {
    //       const encodedStr = Base64.stringify(Utf8.parse(JSON.stringify(f)));
    //       url = buildUrl(url, `&ext=${encodedStr}`);
    //     }
    //   } else if (site.type === 7) {
    //     const res: any = await t3Work({
    //       type: 'category',
    //       data: { tid: t, pg, filter: _.size(f) ? true : false, extend: _.size(f) ? f : {} },
    //     });
    //     return res.data.list;
    //   }
       else if (site.type === 8) {
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
  
      //请求数据
    //   let res;
    //   if (site.type !== 8) res = await axios.get(url);
    //   else res = await axios.post(url, postData);
  
    //   let json;
    //   if (site.type === 0) json = parser.parse(res.data);
    //   else json = res.data;
  
    //   const jsondata = json.rss || json;
    //   let videoList = jsondata.list || jsondata.data || [];
  
    //   if (site.type === 0) {
    //     videoList = convertVideoList(jsondata.list.video);
    //   } else if (site.type === 3) {
    //     videoList = jsondata.data || jsondata.list;
    //   } else if (site.type === 4) {
    //     videoList = jsondata.data.list;
    //   }
    //   return videoList;
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
const convertVideoList = (videoItems) => {
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

  const removeHTMLTagsAndSpaces = (str) => {
    // 去除HTML标签
    const strippedString = str.replace(/(<([^>]+)>)/gi, '');
    // 去除空格
    const trimmedString = strippedString.replace(/\s+/g, '');
    return trimmedString;
  };

  const buildUrl = (url, paramsStr) => {
    const u = new URL(url);
    const api = u.origin + u.pathname.replace(/\/$/, '');
    const params = new URLSearchParams(u.search);
  
    if (paramsStr.startsWith('?') || paramsStr.startsWith('&')) {
      const p = new URLSearchParams(paramsStr);
      p.forEach((value, key) => params.set(key, value));
      return api + '?' + params.toString();
    } else {
      const cleanParamsStr = paramsStr.startsWith('/') ? paramsStr.slice(1) : paramsStr;
      return api + (cleanParamsStr ? '/' + cleanParamsStr : '');
    }
  };