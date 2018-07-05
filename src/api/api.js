import axios from 'axios';

let base = '';
// let test='http://39.107.252.186:10005';
// let test='http://218.17.39.178:2040';
localStorage.setItem("parkId",'969878f1f1149e6a7afae38636c0abc');
localStorage.setItem("userId",'71f3df48263f4c74be2efbb83250e66b');
localStorage.setItem("upUrl",'http://218.17.39.178:2040');  //微品云（开发）
// localStorage.setItem("upUrl",'https://shbeta.vpclub.cn/api10005');//新阿里云
// localStorage.setItem("upUrl",'http://39.107.252.186:10005');//阿里云地址（正式）
// localStorage.setItem("upUrl",'http://192.168.7.109:2040');//another
// localStorage.setItem("upUrl",'http://172.16.0.7:2040');//本地


export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const showCircle=`/socialCircle/socialCircleList?parkId=`+localStorage.getItem("parkId");  //圈子列表
export const showActList=`/socialCircle/socialCircleActiveList?parkId=`+localStorage.getItem("parkId");  //圈子活动列表
export const delCir=`/socialCircle/deleteSocialCircle/`+localStorage.getItem("parkId")+'/';  //圈子 删除
export const addCir=`/socialCircle/addOrUpdateSocialCircle`;  //圈子增加
export const addAct=`/socialCircle/addOrUpdateActive`;  //活动增加
export const delAct=`/socialCircle/deleteSocialCircleActive/`;  //活动删除
export const userTarget=`/userTargetAssociation/userTargetAssociationList?targetId=`;  //用户目标关联（各种报名,申请信息）
export const uploadPic=`/OperFile/uploadFile/`;  //上传图片文件
export const showTopic=`/subject/subjectList?parkId=`+localStorage.getItem("parkId");  //话题列表
export const delTopic=`/subject/deleteSubject/`;  //话题屏蔽

export const subsUrl=`/subjectComment/subjectCommentList/`;  //查看某一话题的评论（包括评论对应的回复信息）
export const subComs=`/subjectComment/subjectCommentListByParkId/`+localStorage.getItem("parkId");  //查看评论（包括评论对应的回复信息）
export const delSubCom=`/subjectComment/deleteSubjectComment/`;  //删除评论（同时删除回复）
export const tipsOffUrl=`/tipOffs/tipOffsList/`;  //举报话题
export const showDisplay=`/displayContent/displayContentList?parkId=`+localStorage.getItem("parkId")+`&type=`;     //展示信息列表
export const addDisplay=`/displayContent/addOrUpdateDisplayContent`;    //添加展示型信息
export const deleteDisplay=`/displayContent/deleteDisplayContent/`;    //删除展示型信息
export const findDic=`/dict/findDictByName?parkId=`+localStorage.getItem("parkId")+`&name=`;  //类别管理通过名称查找记录
export const showDict=`/dict/dictList/`;  //类别管理列表
export const addDict=`/dict/addOrUpdateDict`;  //类别管理 添加

export const deleteDict=`/dict/deleteDict/`;  //类别管理 删除
export const proList=`/propertyApplication/propertyApplicationList/`+localStorage.getItem("parkId")+`/`;  //报修类列表
export const findSuggest=`/propertyApplication/findSuggestion?parkId=`+localStorage.getItem("parkId");  //用户反馈查询
export const findProperty=`/propertyApplication/findPropertyApplication?parkId=`+localStorage.getItem("parkId")+`&type=`;  //入驻申请等查询
export const repSuggest=`/propertyApplication/repairsAndSuggest?parkId=`+localStorage.getItem("parkId")+`&type=`;  //入驻申请等查询
export const inspectUrl=`/inspectionRecord/inspectionRecordList?parkId=`+localStorage.getItem("parkId");  //设备巡检列表
export const equipUrl=`/parkEquipment/equipmentList?parkId=`+localStorage.getItem("parkId");  //设备列表
export const delEquip=`/parkEquipment/deleteEquipment/`;  //删除设备
export const addEquip=`/parkEquipment/addOrUpdateEquipment`;  //添加设备
export const replyUrl=`/propertyApplication/suggestionReply?parkId=`+localStorage.getItem("parkId");  //设备列表

export const throughApply=`/propertyApplication/permitThroughApplication?parkId=`+localStorage.getItem("parkId");  //放行申请
export const adsUrl=`/advertisement/advertisementList?parkId=`+localStorage.getItem("parkId");  //广告列表
export const addAdsUrl=`/advertisement/addOrUpdateAdvertisement`;  //添加广告
export const delAdsUrl=`/advertisement/deleteAdvertisement/`;  //删除广告
export const attendList=`/clock/clockList?parkId=`+localStorage.getItem("parkId");  //打卡列表
export const unAttendList=`/attendance/unusualAttendanceList?parkId=`+localStorage.getItem("parkId");  //考勤异常接口
export const approvalList=`/advertisement/approvalList?parkId=`+localStorage.getItem("parkId");  //审批
export const userListUrl=`/parkUserPermission/parkUserList?parkId=`+localStorage.getItem("parkId")+'&type=2';  //查询用户列表
export const schedListUrl=`/scheduling/schedulingList?parkId=`+localStorage.getItem("parkId")+'&date=';  //查询用户列表
export const scheChange=`scheduling/operScheduling`;  //添加或修改某个人的排班信息

export const enterpriseUrl=`/settledEnterprise/settledEnterpriseList?parkId=`+localStorage.getItem("parkId");  //查找企业信息
export const addUpEnterUrl=`/settledEnterprise/addOrUpdatedEnterprise`;  //查找企业信息
export const delEnterUrl=`/settledEnterprise/deleteEnterprise/`;  //删除企业信息
export const treeUrl=`/parkInfoTree/parkInfoTreeList?parkId=`+localStorage.getItem("parkId");  //组织架构/区域列表
export const findUserUrl=`/parkUser/findUserByDepartmentId/`+localStorage.getItem("parkId")+'/';  //查找部门下员工信息
export const upSchUrl=`/parkUser/updateIfScheduling`;  //修改此用户是否排班信息
export const upParkTreeUrl=`/parkInfoTree/addOrUpdateParkInfoTree`;  //添加或修改组织架构/区域
export const delParkTreeUrl=`/parkInfoTree/deleteParkInfoTree/`;  //删除组织结构/区域



// 用户管理
export const parkStaffList = `/parkStaff/parkStaffList?parkId=` + localStorage.getItem("parkId"); // 获取用户列表
export const addOrUpdateParkStaff = `/parkStaff/addOrUpdateParkStaff`; // 添加或更新用户
export const deleteStaff = `/parkStaff/deleteStaff/`; // 删除用户
export const settledEnterpriseList = `/settledEnterprise/settledEnterpriseList?parkId=` + localStorage.getItem("parkId"); // 获取企业名单
export const parkUserList = `/parkUserPermission/parkUserList?parkId=` + localStorage.getItem("parkId") + `&type=2`; // 获取员工列表
export const parkInfoTreeList = `/parkInfoTree/parkInfoTreeList?parkId=` + localStorage.getItem("parkId") + `&type=`; // 获取组织架构树形结构
export const parkOperatorList = `/parkUser/parkOperatorList?parkId=` + localStorage.getItem("parkId") + `&type=3` // 获取操作员列表
export const addParkUser = `/parkUser/addParkUser`; // 添加员工/操作员
export const deleteUser = `/parkUser/deleteUser/`; // 删除员工/操作员
export const parkRoleList = `/parkRole/parkRoleList?parkId=` + localStorage.getItem("parkId"); // 查询角色列表

