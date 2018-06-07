import axios from 'axios';

let base = '';
// let test='http://39.107.252.186:10005';
let test='http://218.17.39.178:2036';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const showCircle=`/api/socialCircle/socialCircleList?parkId=`+localStorage.getItem("parkId");  //圈子列表
export const showActList=`/api/socialCircle/socialCircleActiveList?parkId=`+localStorage.getItem("parkId");  //圈子活动列表
export const delCir=`/api/socialCircle/deleteSocialCircle`;  //圈子 删除
// export const addCir=`/api/socialCircle/addSocialCircle`;  //圈子增加
export const addCir=`/api/socialCircle/addOrUpdateSocialCircle`;  //圈子增加
// export const addAct=`/api/socialCircle/addSocialCircleActive`;  //活动增加
export const addAct=`/api/socialCircle/addOrUpdateActive`;  //活动增加
export const delAct=`/api/socialCircle/deleteSocialCircleActive/`;  //活动删除

export const uploadPic=`/api/OperFile/uploadFile/`;  //上传图片文件

export const showTopic=`/api/subject/subjectList?parkId=`+localStorage.getItem("parkId");  //话题列表
export const delTopic=`/api/subject/deleteSubject/`;  //话题屏蔽
export const subsUrl=`/api/subjectComment/subjectCommentList/`;  //查看某一话题的评论（包括评论对应的回复信息）
export const tipsOffUrl=`/api/tipOffs/tipOffsList/`;  //举报话题

export const showDisplay=`/api/displayContent/displayContentList?parkId=`+localStorage.getItem("parkId")+`&type=`;     //展示信息列表
// export const addDisplay=`/api/displayContent/addDisplayContent`;    //添加展示型信息
export const addDisplay=`/api/displayContent/addOrUpdateDisplayContent`;    //添加展示型信息
export const deleteDisplay=`/api/displayContent/deleteDisplayContent/`;    //删除展示型信息

export const findDic=`/api/dict/findDictByName?parkId=`+localStorage.getItem("parkId")+`&name=`;  //类别管理通过名称查找记录
export const showDict=`/api/dict/dictList/`;  //类别管理列表
export const addDict=`/api/dict/addDict`;  //类别管理 添加
export const deleteDict=`/api/dict/deleteDict/`;  //类别管理 删除

export const proList=`/api/propertyApplication/propertyApplicationList/`+localStorage.getItem("parkId")+`/`;  //报修类列表
