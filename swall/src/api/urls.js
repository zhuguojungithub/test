/**
 * @file 接口
 * @author 徐忠元
 */

const apis = {

    // 前台
    suitList: 'suit.list',
    suitDetail: 'suit.getDetail',
    adverlist: 'adver.adverlist',
    login: 'index.login',
    register: 'index.InsentUser',
    getUser: 'MktSysUser.getUserInfo',
    logout: 'index.logout',
    getCode: 'index.code',
    getMCode: 'index.Registered',

    // 基础
    getUserNewMessage: 'MktUserMessage.getUserNewMessage',
    getMessageList: 'MktUserMessage.getUserMessage',
    getMenu: 'MktSysUser.getMenus',
    addMessage: 'MessageRemind.addMessage',
    readedMessage: 'MktUserMessage.readMessage',
   
    // 广告投放 - 运营
    adtemplist: 'adver.adtemplist',
    searchUser: 'MktAdvertiser.getSearchList',
    getCustomer: 'MktAdvertiser.advertisers',
    getPlanList: 'mktBusiness.getCampaigns',
    getPlanDetail: 'MktBusiness.getCampaignsDetail',
    getPlanData: 'MktBusiness.getCampaignsShow',
    getCampaignsBaseData: 'MktBusiness.getCampaignsBaseData',
    addPlan: 'MktBusiness.operCampaigns',
    getRegion: 'MktBusiness.getRegionTag',
    getAdvertData: 'MktAdGroup.getVariable',
    getCompanyInfos:'MktAdvertiser.getAdvertiserDetail',
    getHobby:'MktBusiness.getBussinessHobby',
    addAdvert: 'MktAdGroup.addAdgroup',
    updateAdvert: 'MktAdGroup.updateAdgroup',
    removeAdvert: 'MktAdGroup.delAdgroup',
    updateContact: 'MktAdvertiser.updateContact',
    addContact: 'MktAdvertiser.addContact',
    getAdvertList: 'MktAdGroup.GetAdgroups',
    getPlanAdvertList: 'MktAdGroup.getCampaignsAdGroupList',
    getAdvertDetail: 'MktAdGroup.GetAdgroup',
    getAdvertOrigin: 'MktAdGroup.GetAdgroupInfo',
    getCreateIdeaData: 'MktCreative.getCreativeBaseData',
    addAdvertIdea: 'MktCreative.operateCreative',
    uploadImage: 'MktImage.uploadImages',
    getIdeaData: 'MktCreative.getCreativeRow',
    getRecommendPage: 'MktRecommendPage.getRecommendPageList',
    addRecommendPage: 'MktRecommendPage.recommendPage',
    getAllRecommendPage: 'MktRecommendPage.getAllPage',
    removePlanItem: 'MktBusiness.delCampaigns',
    getService: 'MktAdvertiser.getServices',
    getUserService: 'MktAdvertiser.getMaidServices',
    actionAdvert: 'MktAdGroup.up',
    delRecommendPage: 'MktRecommendPage.delRecommendPage',
    getCredentialsList: 'MktCertificate.getCertificateList',
    addCredentials: 'MktCertificate.operateCertificate',
    removeCredentials: 'MktCertificate.delCertificate',
    submitCredentials: 'MktCertificate.up',
    getAdvertiserInfo: 'MktAdvertiser.getAdvertiserInfo',
    matchAdvertiser: 'MktAdvertiser.matchAdvertiser',
    getAdvertiserBaseData: 'MktAdvertiser.getAdvertiserBaseData',
    registerAdverter: 'MktAdvertiser.operateAdvertiser',
    getPlatformList: 'MktAdvertiser.getPlatformList',
    updateWxId: 'MktAdvertiser.fullPlatformData',
    bindWx: 'MktAdvertiser.bindWx',
    getPlatformInfo: 'MktAdvertiser.getPlatformInfo',
    reloadWXItem: 'MktAdvertiser.plaformAgainUp',
    getUserDetails: 'MktUserInfo.getUserInfo',
    updateUserinfo: 'MktUserInfo.operateCenter',

    // 广告投放 - 客户端
    getClientPlans: 'MktBusiness.getClientCampaigns',

    // 账户管理
    getClientList: 'mktAdvertiser.mktuserinfo',
    onChangeUserStatus: 'MktSysUser.updateStatus',
    getSelectServices: 'MktAdvertiser.getSelectServices',
    addServices: 'MktAdvertiser.allotServices',
    delSerices: 'MktAdvertiser.delSerices',
    uploadAdvert: 'MktImport.importAdvertiser',
    openAccount: 'MktAdvertiser.up',
    getAdvertCredentials: 'MktAdvertiser.getDBOAdvertiserInfo',

    // 消息管理
    getMsgList: 'MktMessage.getMessageList',
    getMsgUserGroup: 'MktMessage.getScope',
    postMessage: 'MktMessage.addMessage',
    getMsgTemp: 'MktMsgTemplate.getMsgTemplateList',
    changeMsgStatus: 'MktMsgTemplate.changeSendStatus',
    editMsgTemp: 'MktMsgTemplate.editMsgTemplate',

    // 日志
    getLoginLog: 'Log.getLoginLogList',
    getOperateLog: 'Log.getActionLogList',

    //数据中心 - 运营端
    getDBOAdGroup:'MktDataShow.getDBOAdGroupData',
    getDBOAdGroupDetail:'MktDataShow.getDBOAdGroupDetail',
    getDBOAdvertiserData:'MktDataShow.getDBOAdvertiserData',
    getDBOCampaignsData:'MktDataShow.getDBOCampaignsData',
    getDBOAdvertiserDetail:'MktDataShow.getDBOAdvertiserDetail',
    getDBOCampaignsDetail:'MktDataShow.getDBOCampaignsDetail',
    exportDBOCampaignsData: 'MktDataShow.exportDBOCampaignsData',
    exportDBOAdGroupData: 'MktDataShow.exportDBOAdGroupData',

    // 数据中心 - 客户端
    getClientAdGroupData: 'MktDataShow.getClientAdGroupData',
    exportClientAdGroupData: 'MktDataShow.exportClientAdGroupData',
    getClientAdGroupDetail: 'MktDataShow.getClientAdGroupDetail',
    exportClientAdGroupDetail: 'MktDataShow.exportClientAdGroupDetail',
    getClientCampaignsData: 'MktDataShow.getClientCampaignsData',
    exportClientCampaignsData: 'MktDataShow.exportClientCampaignsData',
    getClientCampaignsDetail: 'MktDataShow.getClientCampaignsDetail',
    exportClientCampaignsDetail: 'MktDataShow.exportClientCampaignsDetail',
    exportDBOAdGroupDetail: 'MktDataShow.exportDBOAdGroupDetail',
    exportDBOAdvertiserData: 'MktDataShow.exportDBOAdvertiserData',
    exportDBOAdvertiserDetail: 'MktDataShow.exportDBOAdvertiserDetail',

    // 系统设置
    importExpend: 'MktImport.importExpend',
    getManagerIndexData: 'MktIndex.getDBOIndex',
    getClientIndexData: 'MktIndex.getClientIndex',
}

const urls = {}
const web = '/web/'

for (let k in apis) {
    urls[k] = web + apis[k]
}

export default urls