// import axios from 'axios';

let base = '';
const parkId='969878f1f1149e6a7afae38636c0abc';

localStorage.setItem("parkId",parkId);
// const parkId = localStorage.getItem("parkId");

// export const showCircle=`/socialCircle/socialCircleList?parkId=`+localStorage.getItem("parkId");  //圈子列表
export const showCircle=`/socialCircle/socialCircleList?parkId=`;  //圈子列表
export const showActList=`/socialCircle/socialCircleActiveList?parkId=`;  //圈子活动列表
// export const showActList=`/socialCircle/socialCircleActiveList?parkId=`+localStorage.getItem("parkId");  //圈子活动列表
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
export const addOrUpdatedEnterprise = `/settledEnterprise/addOrUpdatedEnterprise`;  // 添加或修改企业
export const deleteEnterprise = `/settledEnterprise/deleteEnterprise/`;  //删除企业信息
export const treeUrl=`/parkInfoTree/parkInfoTreeList?parkId=`+localStorage.getItem("parkId");  //组织架构/区域列表
export const findUserUrl=`/parkUser/findUserByDepartmentId/`+localStorage.getItem("parkId")+'/';  //查找部门下员工信息
export const upSchUrl=`/parkUser/updateIfScheduling`;  //修改此用户是否排班信息
export const upParkTreeUrl=`/parkInfoTree/addOrUpdateParkInfoTree`;  //添加或修改组织架构/区域
export const delParkTreeUrl=`/parkInfoTree/deleteParkInfoTree/`;  //删除组织结构/区域
export const countsEnterUrl=`/settledEnterprise/findSettledEnterpriseCountByZoneId/`+localStorage.getItem("parkId")+'/';  //查询区域中企业的数量
export const inspectTaskListUrl=`/inspectionTask/inspectionTaskList?parkId=`+localStorage.getItem("parkId");  //巡检任务列表

export const delInsTaskUrl=`/inspectionTask/deleteInspectionTask/`;  //删除巡检任务
export const addUpdateInsTaskUrl=`/inspectionTask/addOrUpdateInspectionTask`;  //添加或修改巡检任务
export const loginUrl=`/logIn?parkId=`+localStorage.getItem("parkId");  //登录

// 用户管理
export const parkStaffList = `/parkStaff/parkStaffList?parkId=${parkId}`;                                   // 获取用户列表
export const addOrUpdateParkStaff = `/parkStaff/addOrUpdateParkStaff`;                                      // 添加或更新用户
export const deleteStaff = `/parkStaff/deleteStaff/`;                                                       // 删除用户
export const settledEnterpriseList = `/settledEnterprise/settledEnterpriseList?parkId=${parkId}`;           // 获取企业名单
export const parkUserList = `/parkUserPermission/parkUserList?parkId=${parkId}&type=2`;                     // 获取员工列表
export const parkOperatorList = `/parkUser/parkOperatorList?parkId=${parkId}&type=3`                        // 获取操作员列表
export const addParkUser = `/parkUser/addParkUser`;                                                         // 添加员工/操作员
export const updateParkUserInfo = `/parkUser/updateParkUserInfo`;                                           // 修改员工/操作员
export const deleteUser = `/parkUser/deleteUser/`;                                                          // 删除员工/操作员 
export const findUserByRoleId = `/parkUser/findUserByRoleId/${parkId}/`;                                    // 查找使用此角色的操作员
export const findUserNumByDepartmentId = `/parkUser/findUserNumByDepartmentId/${parkId}/`;                  // 通过部门Id查找用户数量
export const parkRoleList = `/parkRole/parkRoleList?parkId=${parkId}`                                       // 查询角色列表
export const addOrUpdateParkRole = `/parkRole/addOrUpdateParkRole`                                          // 添加或修改角色
export const deleteParkRole = `/parkRole/deleteParkRole/`;                                                  // 删除角色
export const parkInfoTreeList = `/parkInfoTree/parkInfoTreeList?parkId=${parkId}&type=`;                    // 获取组织架构树形结构
export const deleteParkInfoTree =`/parkInfoTree/deleteParkInfoTree/`;                                       // 删除组织结构/区域
export const parkInfoTreeAddZoneInfo = `/parkInfoTree/parkInfoTreeAddZoneInfo/${parkId}/`;                  // 查找组织架构所在区域信息
export const addOrUpdateParkInfoTree = `/parkInfoTree/addOrUpdateParkInfoTree`;                             // 添加或修改组织架构/区域
export const sendMessage = `/shortMessage/sendMessage`                                                      // 发送短信

export const housekeepingList = `/displayContent/housekeepingList?parkId=${parkId}`                             // 家政服务列表
export const addOrUpdateDisplayContent = `/displayContent/addOrUpdateDisplayContent`                            // 添加或修改展示性信息
export const crowdorderingApplication = `/propertyApplication/crowdorderingApplication?parkId=${parkId}`        // 拼单记录列表
export const updatePropertyApplication = `/propertyApplication/updatePropertyApplication`                       // 修改物业拼单记录列表
export const sharedResourceList = `/sharedResource/sharedResourceList?parkId=${parkId}`                         // 共享资源列表
export const addOrUpdateSharedResource = `/sharedResource/addOrUpdateSharedResource`                            // 添加或修改共享资源对象
export const deleteSharedResource = `/sharedResource/deleteSharedResource/`                                     // 删除共享资源对象
export const sharedResourceReservationList = `/sharedResourceReservation/sharedResourceReservationList`         // 查询共享资源列表
export const bookSharedResourceList = `/userTargetAssociation/bookSharedResourceList?parkId=${parkId}&type=USER_ORDER_SHARED_RESOURCE`          // 共享资源申请列表
export const updateUserTargetAssociation = `/userTargetAssociation/updateUserTargetAssociation`                 // 修改共享资源申请列表
export const addSharedResourceReservation = `/sharedResourceReservation/addSharedResourceReservation`           // 添加共享资源预定
export const deleteSharedResourceReservation = `/sharedResourceReservation/deleteSharedResourceReservation/`    // 删除共享资源预定信息
export const apartmentResourcesList = `/displayContent/apartmentResourcesList?parkId=${parkId}`                 // 公寓租赁列表

// 商务服务
export const commerceCourseListByTime = `/commerceCourse/commerceCourseListByTime?parkId=${parkId}`                     // 预约管理列表
export const addOrUpCommerceCourse = `/commerceCourse/addOrUpCommerceCourse?parkId=${parkId}`                           // 添加或修改上门预约课程
export const deleteCommerceCourse = `/commerceCourse/deleteCommerceCourse/`                                             // 删除上门预约课程
export const commerceCourseList = `/commerceCourseList/${parkId}`                                                       // 上门预约课程列表
export const deleteUserTargetAssociation = `/userTargetAssociation/deleteUserTargetAssociation/`                        // 删除用户目标关联
export const businessServerOrderHistoryList = `/userTargetAssociation/businessServerOrderHistoryList?parkId=${parkId}`  // 商务课程预约管理历史记录

export const policyList = `/displayContent/policyList?parkId=${parkId}&type=政策解读`                                    // 查询政策解读
export const PolicyServiceApplication = `/propertyApplication/serviceApplication?parkId=${parkId}&type=政务服务`         // 查询政策解读申请记录
export const ITServiceApplication = `/propertyApplication/serviceApplication?parkId=${parkId}&type=IT服务`               // 查询IT服务申请记录
export const TalentServiceApplication = `/propertyApplication/serviceApplication?parkId=${parkId}&type=人才服务`               // 查询IT服务申请记录

