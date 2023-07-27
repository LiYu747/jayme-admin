import axios from './http.js'
import base from './base.js'
export default {
  // /**
  //  * 获取栏目（侧导航权限控制）
  //  */
  // findColumn(){
  //     return axios.get(`${base.stateServer}/column/findColumn`);
  // },
  // /**
  //  * 会员注册
  //  */
  // register(params){
  //     return axios.post(`${base.apiServer}/web/user/register`,params);
  // },
  // /**
  //  * 验证升级/激活积分是否足够
  //  */
  // verificationIntegral(params){
  //     return axios.get(`${base.apiServer}/web/user/verificationIntegral`,{
  //         params: params
  //     });
  // },
  /**
   * 查询站点是否关闭
   */
  // findWebsite(){
  //     return axios.get(`${base.stateServer}/server/find`);
  // },
  /**
   * 登录
   */
  login(params) {
    return axios.post(`${base.apiServer}/back/admin/login`, params)
  },
  /**
   * 注册
   */
  register(params) {
    return axios.post(`${base.apiServer}/back/admin/register`, params)
  },
  /**
   * 退出登录
   */
  logouting(params) {
    return axios.post(`${base.apiServer}/common/logouting`, params)
  },
  /**
   * 创建后台操作日志
   */
  operateLogSave(params) {
    return axios.post(`${base.apiServer}/back/operateLog/save`, params)
  },
  /**
   * 分页查询后台操作日志
   */
  operateLogAll(params) {
    return axios.get(`${base.apiServer}/back/operateLog/findAll`, {
      params: params,
    })
  },
  /**
   * 后台操作日志批量删除
   */
  operateLogBatchDelete(params) {
    return axios.post(`${base.apiServer}/back/operateLog/batchDelete`, params)
  },
  /**
   * 后台操作日志明细删除(单条)
   */
  operateLogDelete(params) {
    return axios.post(`${base.apiServer}/back/operateLog/delete`, params)
  },
  /**
   * 根据ID删除权限
   */
  authorityDelete(params) {
    return axios.post(`${base.apiServer}/back/authority/delete`, params)
  },
  /**
   * 权限新增
   */
  authoritySave(params) {
    return axios.post(`${base.apiServer}/back/authority/save`, params)
  },
  /**
   * 权限更新
   */
  authorityUpdate(params) {
    return axios.post(`${base.apiServer}/back/authority/update`, params)
  },
  /**
   * 获取所有权限
   */
  authorityAll() {
    return axios.get(`${base.apiServer}/back/authority/findAll`)
  },
  /**
   * 修改密码
   */
  updatePassword(params) {
    return axios.post(`${base.apiServer}/back/admin/updatePassword`, params)
  },
  /**
   * 重置密码
   */
  resetPassword(params) {
    return axios.post(`${base.apiServer}/back/admin/resetPassword`, params)
  },
  /**
   * 获取管理员信息
   */
  adminInfo() {
    return axios.get(`${base.apiServer}/back/admin/getAdminInfo`)
  },
  /**
   * 获取用户角色
   */
  findByAdmin(params) {
    return axios.get(`${base.apiServer}/back/role/findByAdmin`, {
      params: params,
    })
  },
  /**
   * 后台用户更新
   */
  updateAdmin(params) {
    return axios.post(`${base.apiServer}/back/admin/update`, params)
  },
  /**
   * 获取所有角色
   */
  roleAll() {
    return axios.get(`${base.apiServer}/back/role/findAll`)
  },
  /**
   * 根据用户获取角色
   */
  roleFindByAdmin(params) {
    return axios.get(`${base.apiServer}/back/role/findByAdmin`, {
      params: params,
    })
  },
  /**
   * 根据角色获取权限
   */
  authorityFindByRole(params) {
    return axios.get(`${base.apiServer}/back/authority/findByRole`, {
      params: params,
    })
  },
  /**
   * 角色新增
   */
  roleSave(params) {
    return axios.post(`${base.apiServer}/back/role/save`, params)
  },
  /**
   * 角色更新
   */
  roleUpdate(params) {
    return axios.post(`${base.apiServer}/back/role/update`, params)
  },
  /**
   * 角色删除
   */
  roleDelete(params) {
    return axios.post(`${base.apiServer}/back/role/delete`, params)
  },
  /**
   * 根据ID删除后台用户
   */
  adminDelete(params) {
    return axios.post(`${base.apiServer}/back/admin/delete`, params)
  },
  /**
   * 注册后台用户
   */
  adminRegister(params) {
    return axios.post(`${base.apiServer}/back/admin/register`, params)
  },
  /**
   * 后台用户更新
   */
  adminUpdate(params) {
    return axios.post(`${base.apiServer}/back/admin/update`, params)
  },
  /**
   * 获取所有后台用户
   */
  adminAll(params) {
    return axios.get(`${base.apiServer}/back/admin/findAll`, {
      params: params,
    })
  },
  /**
   * 文件检查
   */
  fileCheck(params) {
    return axios.post(`${base.apiServer}/common/file/check`, params)
  },
  /**
   * 上传文件
   */
  fileUpload(params) {
    return axios.post(`${base.apiServer}/common/file/upload`, params)
  },
  /**
   * 获取异步任务
   */
  asyncTaskFind(params) {
    return axios.get(`${base.apiServer}/back/asyncTask/find`, {
      params: params,
    })
  },
  /**
   * 生成分片上传唯一标识
   */
  generateUploadId(params) {
    return axios.post(`${base.apiServer}/common/file/generateUploadId`, params)
  },
  /**
   * 分片上传
   */
  chunkUpload(params) {
    return axios.post(`${base.apiServer}/common/file/chunkUpload`, params, {
      notLoadding: true,
    })
  },
  /**
   * 合并分片
   */
  completeUpload(params) {
    return axios.post(`${base.apiServer}/common/file/completeUpload`, params, {
      notLoadding: true,
    })
  },
  /**
   * 文件上传
   */
  cosUpload(params) {
    return axios.post(`${base.apiServer}/common/file/upload`, params, {
      notLoadding: true,
    })
  },
  /**
   * 查服务器管理
   */
  serverStatus(params) {
    return axios.get(`${base.apiServer}/back/server/status`, params)
  },
  /**
   * 文件检查
   */
  knobbleFileCheck(params) {
    return axios.post(`${base.knobbleServer}/common/file/check`, params)
  },
  /**
   * 上传文件
   */
  knobbleFileUpload(params) {
    return axios.post(`${base.knobbleServer}/common/file/upload`, params)
  },
  /**
    /**
     * 解压内容
     */
  sectionLessonUnpack(params) {
    return axios.post(`${base.knobbleServer}/common/unpack`, params)
  },

  /**
   * 查询所有用户
   */
  getUser(params) {
    return axios.get(`${base.apiServer}/back/user/findAll`, {
      params: params,
    })
  },
  /** 新增用户 */
  addUser(params) {
    return axios.post(`${base.apiServer}/back/user/save`, params)
  },
  /** 重置用户密码 */
  resetUserPassword(params) {
    return axios.post(`${base.apiServer}/back/user/resetPassword`, params)
  },
  /** 更新用户 */
  updateUser(params) {
    return axios.post(`${base.apiServer}/back/user/update`, params)
  },
  /** 删除销售代理用户 */
  deleteUser(params) {
    return axios.post(`${base.apiServer}/back/user/delete`, params)
  },
  /** 删除仓库用户 */
  deleteLibraryUser(params) {
    return axios.post(`${base.apiServer}/back/keeper/delete`, params)
  },
  /* 获取所有用户权限 */
  getAuth(params) {
    return axios.get(`${base.apiServer}/back/userGroup/findUserAuthority`, {
      params: params,
    })
  },
  /** 获取所有用户组 */
  getUserGroup(params) {
    return axios.get(`${base.apiServer}/back/userGroup/findAll`, {
      params: params,
    })
  },
  /** 新增用户组 */
  addUserGroup(params) {
    return axios.post(`${base.apiServer}/back/userGroup/save`, params)
  },
  /** 根据用户组获取权限 */
  getUserGroupById(params) {
    return axios.get(`${base.apiServer}/back/userGroup/findByUserGroup`, {
      params: params,
    })
  },
  /** 用户组更新 */
  updateUserGroup(params) {
    return axios.post(`${base.apiServer}/back/userGroup/update`, params)
  },
  /** 用户组删除 */
  deleteUserGroup(params) {
    return axios.post(`${base.apiServer}/back/userGroup/delete`, params)
  },
  /** 查询所有分类 */
  getCategory(params) {
    return axios.get(`${base.apiServer}/back/classification/findAll`, {
      params: params,
    })
  },
  /** 创建分类 */
  addCategory(params) {
    return axios.post(`${base.apiServer}/back/classification/save`, params)
  },
  /** 更新分类 */
  updateCategory(params) {
    return axios.post(`${base.apiServer}/back/classification/update`, params)
  },
  /** 更新分类排序 */
  updateCategoryOrder(params) {
    return axios.post(
      `${base.apiServer}/back/classification/updateSerialNumber`,
      params
    )
  },
  /** 分类上下架 */
  updateCategoryState(params) {
    return axios.post(
      `${base.apiServer}/back/classification/UpDownShelves`,
      params
    )
  },
  /** 删除分类 */
  deleteCategory(params) {
    return axios.post(`${base.apiServer}/back/classification/delete`, params)
  },
  /** 根据分类查询分类商品关联 */
  getCategoryInId(params) {
    return axios.get(`${base.apiServer}/back/classification/findCommodity`, {
      params: params,
    })
  },
  /** 分类下添加商品 */
  addGoodsInCategory(params) {
    return axios.post(
      `${base.apiServer}/back/classification/joinCommodity`,
      params
    )
  },
  /** 查询所有商品 */
  getGoods(params) {
    return axios.get(`${base.apiServer}/back/commodity/findAll`, {
      params: params,
    })
  },
  /** 根据id查询商品 */
  getGoodsById(params) {
    return axios.get(`${base.apiServer}/back/commodity/findById`, {
      params: params,
    })
  },
  /** 根据商品id查询商品审核设置 */
  getGoodsConfigById(params) {
    return axios.get(
      `${base.apiServer}/back/commodityAuditSetUp/findByCommodityId`,
      {
        params: params,
      }
    )
  },
  /** 更新商品审核设置  */
  updateGoodsConfig(params) {
    return axios.post(
      `${base.apiServer}/back/commodityAuditSetUp/update`,
      params
    )
  },
  /** 更新分类下商品排序 */
  updateGoodsInCategoryOrder(params) {
    return axios.post(
      `${base.apiServer}/back/classification/updateCommoditySerialNumber`,
      params
    )
  },
  /** 根据id删除关联 */
  deleteGoodsInCategory(params) {
    return axios.post(
      `${base.apiServer}/back/classification/deleteRelation`,
      params
    )
  },
  /** 根据id批量删除关联 */
  deleteGoodsInCategorys(params) {
    return axios.post(
      `${base.apiServer}/back/classification/deleteRelationBatch`,
      params
    )
  },
  /** 查询所有仓库用户 */
  getlibraryUser(params) {
    return axios.get(`${base.apiServer}/back/keeper/findAll`, {
      params: params,
    })
  },
  /** 新增仓管 */
  addlibraryUser(params) {
    return axios.post(`${base.apiServer}/back/keeper/save`, params)
  },
  /** 更新仓管 */
  updatelibraryUser(params) {
    return axios.post(`${base.apiServer}/back/keeper/update`, params)
  },
  /** 获取所有仓库 */
  getlibrary(params) {
    return axios.get(`${base.apiServer}/back/warehouse/findAll`, {
      params: params,
    })
  },
  /** 新增商品 */
  addGoods(params) {
    return axios.post(`${base.apiServer}/back/commodity/save`, params)
  },
  /** 商品上下架 */
  updateGoodsState(params) {
    return axios.post(`${base.apiServer}/back/commodity/UpDownShelves`, params)
  },
  /** 修改商品 */
  updateGoods(params) {
    return axios.post(`${base.apiServer}/back/commodity/update`, params)
  },
  /** 删除商品 */
  deleteGoods(params) {
    return axios.post(`${base.apiServer}/back/commodity/delete`, params)
  },

  /** 批量删除商品 */
  batchDeleteGoods(params) {
    return axios.post(`${base.apiServer}/back/commodity/batchDelete`, params)
  },
  /** 查询所有库存 */
  getStocks(params) {
    return axios.get(`${base.apiServer}/back/commodityInventory/findAll`, {
      params: params,
    })
  },
  /** 根据商品id查询库存 */
  getStocksById(params) {
    return axios.get(
      `${base.apiServer}/back/commodityInventory/findCommodityInventory`,
      {
        params: params,
      }
    )
  },
  /** 出入库 */
  goodsInOrOutStock(params) {
    return axios.post(
      `${base.apiServer}/back/commodityInventory/warehouseOutOrJoin`,
      params
    )
  },
  /** 获取所有采购单  */
  getPurchaseOrder(params) {
    return axios.get(`${base.apiServer}/back/purchaseOrder/findAll`, {
      params: params,
    })
  },
  /** 新增采购单 */
  addPurchasOrder(params) {
    return axios.post(`${base.apiServer}/back/purchaseOrder/save`, params)
  },
  /** 查询子采购单 */
  getPurchasOrderById(params) {
    return axios.get(
      `${base.apiServer}/back/purchaseOrder/findSubPurchaseOrder`,
      {
        params: params,
      }
    )
  },
  /** 签收 */
  signIn(params) {
    return axios.post(`${base.apiServer}/back/purchaseOrder/sign`, params)
  },
  /** 完成采购单 */
  completePurchaseOrder(params) {
    return axios.post(`${base.apiServer}/back/purchaseOrder/complete`, params)
  },
  /** 删除采购单 */
  deletePurchaseOrder(params) {
    return axios.post(`${base.apiServer}/back/purchaseOrder/delete`, params)
  },
  /** 查询出入库记录 */
  getWarehouseRecord(params) {
    return axios.get(`${base.apiServer}/back/warehouseRecord/findAll`, {
      params: params,
    })
  },
  /** 查询子出入库记录 */
  getWarehouseRecordById(params) {
    return axios.get(
      `${base.apiServer}/back/warehouseRecord/findSubWarehouseRecord`,
      {
        params: params,
      }
    )
  },
  /** 获取所有商品订单  */
  allOrders(params) {
    return axios.get(`${base.apiServer}/back/commodityOrder/findAll`, {
      params: params,
    })
  },
  /** 订单详情  */
  orderDetail(params) {
    return axios.get(`${base.apiServer}/back/commodityOrder/v2/findDetails`, {
      params: params,
    })
  },
  /** 订单结算 */
  orderSettle(params) {
    return axios.post(
      `${base.apiServer}/back/commodityOrder/settlement`,
      params
    )
  },
  /** 关闭订单 */
  orderDelete(params) {
    return axios.post(`${base.apiServer}/back/commodityOrder/delete`, params)
  },
  /** 根据子订单id查询订单物流信息 */
  findLogistics(params) {
    return axios.post(
      `${base.apiServer}/back/commodityOrder/findLogistics`,
      params
    )
  },
  /** 订单关闭 */
  closeAudit(params) {
    return axios.post(`${base.apiServer}/back/commodityOrder/close`, params)
  },
  /** 订单审核不通过 */
  failAudit(params) {
    return axios.post(`${base.apiServer}/back/orderAudit/failAudit`, params)
  },
  /** 订单审核通过 */
  passAudit(params) {
    return axios.post(`${base.apiServer}/back/orderAudit/passAudit`, params)
  },
  /** 导出Excel */
  exportExcel(params, apiUrl) {
    return axios.get(`${base.apiServer}${apiUrl}`, {
      params: params,
    })
  },
  /** 根据id查询异步任务 */
  getExcelTask(params) {
    return axios.get(`${base.apiServer}/back/asyncTask/getAsyncTask`, {
      params: params,
      notLoadding: true,
    })
  },
  /** 根据订单查询审核信息 */
  getOrderAudit(params) {
    return axios.get(`${base.apiServer}/back/orderAudit/findOrder`, {
      params: params,
    })
  },
  /** 根据文件名获取文件URL */
  getImgUrl(params) {
    return axios.get(`${base.apiServer}/common/getUrl`, {
      params: params,
    })
  },
  /** 获取配置表数据  */
  getSetting(params) {
    return axios.get(`${base.apiServer}/back/config/findAll`, params)
  },
  /** 根据名称获取配置表数据  */
  getSettingByName(params) {
    return axios.get(`${base.apiServer}/back/config/findByName`, {
      params: params,
    })
  },
  /** 子订单详情  */
  findSubCommodityOrderDetails(params) {
    return axios.get(
      `${base.apiServer}/back/commodityOrder/findSubCommodityOrderDetails`,
      {
        params: params,
      }
    )
  },
  /** 通过申请取消订单  */
  passCancelAudit(params) {
    return axios.post(
      `${base.apiServer}/back/orderAudit/v2/passCancelAudit`,
      params
    )
  },
  /** 不通过申请取消订单  */
  failCancelAudit(params) {
    return axios.post(
      `${base.apiServer}/back/orderAudit/failCancelAudit`,
      params
    )
  },
  /** 文件下载  */
  fileDownload(params) {
    return axios.get(`${base.apiServer}/common/file/download`, {
      params: params,
    })
  },
  /** 获取所有预售商品订单  */
  getAllPreOrders(params) {
    return axios.get(`${base.apiServer}/back/preOrderCommodityOrder/findAll`, {
      params: params,
    })
  },
  /** 更改预售商品订单状态  */
  editPreOrderState(params) {
    return axios.post(
      `${base.apiServer}/back/preOrderCommodityOrder/editState`,
      params
    )
  },
  /** 订单详情  */
  getPreOrderDetail(params) {
    return axios.get(
      `${base.apiServer}/back/preOrderCommodityOrder/findDetails`,
      {
        params: params,
      }
    )
  },
  /** 预订单下单  */
  approvedPreOrder(params) {
    return axios.post(
      `${base.apiServer}/back/preOrderCommodityOrder/approved`,
      params
    )
  },
  /** 获取全部资源  */
  findAllRes(params) {
    return axios.get(`${base.apiServer}/back/resources/findAll`, { params })
  },
  /** 删除资源  */
  deleteRes(params) {
    return axios.post(`${base.apiServer}/back/resources/delete`, params)
  },
  /** 批量删除资源  */
  batchDeleteeRes(params) {
    return axios.post(`${base.apiServer}/back/resources/batchDelete`, params)
  },
  /** 新增资源  */
  saveRes(params) {
    return axios.post(`${base.apiServer}/back/resources/save`, params)
  },
  /** 查询资源资源详情  */
  findResById(params) {
    return axios.get(`${base.apiServer}/back/resources/findById`, { params })
  },
  /** 修改资源  */
  updateRes(params) {
    return axios.post(`${base.apiServer}/back/resources/update`, params)
  },

  /** 根据分类id查询资源  */
  findByResources(params) {
    return axios.get(`${base.apiServer}/back/resources/findByResources`, {
      params,
    })
  },
  /** 根据分类id添加资源  */
  addResources(params) {
    return axios.post(
      `${base.apiServer}/back/classification/addResources`,
      params
    )
  },
  /** 根据分类id批量删除资源  */
  batchDelete(params) {
    return axios.post(
      `${base.apiServer}/back/classification/batchDelete`,
      params
    )
  },
  /** Banner上下架 */
  bannerShelves(params) {
    return axios.post(`${base.apiServer}/back/banner/UpDownShelves`, params)
  },
  /** 删除Banner */
  bannerDel(params) {
    return axios.post(`${base.apiServer}/back/banner/delete`, params)
  },
  /** 新增Banner */
  bannerAdd(params) {
    return axios.post(`${base.apiServer}/back/banner/save`, params)
  },
  /** 更新Banner */
  bannerUpdate(params) {
    return axios.post(`${base.apiServer}/back/banner/update`, params)
  },
  /** 查询所有Banner */
  getBannerList(params) {
    return axios.get(`${base.apiServer}/back/banner/findAll`, {
      params: params,
    })
  },
  /** 查询推荐分类 */
  getResourceList(params) {
    return axios.get(`${base.apiServer}/back/recommendClassification/findAll`, {
      params,
    })
  },
  /** 查询新书上架 */
  getNewBookList(params) {
    return axios.get(`${base.apiServer}/back/newBookClassification/findAll`, {
      params,
    })
  },
  /** 新增推荐分类 */
  addResource(params) {
    return axios.post(
      `${base.apiServer}/back/recommendClassification/save`,
      params
    )
  },
  /** 一键设置封面 */
  setAllCover(params) {
    return axios.post(
      `${base.apiServer}/back/classification/onekeyCover`,
      params
    )
  },
  /** 修改推荐分类排序 */
  updateSerialNumber(params) {
    return axios.post(
      `${base.apiServer}/back/recommendClassification/update`,
      params
    )
  },
  /** 删除推荐分类 */
  deleteResource(params) {
    return axios.post(
      `${base.apiServer}/back/recommendClassification/delete`,
      params
    )
  },
  /** 新增新书上架 */
  addNewBook(params) {
    return axios.post(
      `${base.apiServer}/back/newBookClassification/save`,
      params
    )
  },
  /** 删除新书上架*/
  deleteNewBook(params) {
    return axios.post(
      `${base.apiServer}/back/newBookClassification/delete`,
      params
    )
  },
  /** 修改推荐分类排序 */
  updateNewBook(params) {
    return axios.post(
      `${base.apiServer}/back/newBookClassification/update`,
      params
    )
  },
  /** 查询 听歌识曲   */
  findAllMusic(params) {
    return axios.get(`${base.apiServer}/back/listenSong/findAll`, {
      params,
    })
  },
  /** 上架  听歌识曲 */
  shelvesMusic(params) {
    return axios.post(`${base.apiServer}/back/listenSong/shelves`, params)
  },
  /** 下架  听歌识曲 */
  cancelShelvesMusic(params) {
    return axios.post(`${base.apiServer}/back/listenSong/cancelShelves`, params)
  },
  /** 新增  听歌识曲 */
  addListenMusic(params) {
    return axios.post(`${base.apiServer}/back/listenSong/save`, params)
  },
  /** 删除  听歌识曲 */
  deleteListenMusic(params) {
    return axios.post(`${base.apiServer}/back/listenSong/delete`, params)
  },
  /** 修改  听歌识曲 */
  modifyListenMusic(params) {
    return axios.post(`${base.apiServer}/back/listenSong/update`, params)
  },

  /** 查询 歌曲接龙   */
  findAllSongRelay(params) {
    return axios.get(`${base.apiServer}/back/songSolitaire/findAll`, {
      params,
    })
  },
  /** 新增  歌曲接龙 */
  addsongSolitaire(params) {
    return axios.post(`${base.apiServer}/back/songSolitaire/save`, params)
  },
  /** 上架  歌曲接龙 */
  shelvesSongSolitaire(params) {
    return axios.post(`${base.apiServer}/back/songSolitaire/shelves`, params)
  },
  /** 下架  歌曲接龙 */
  cancelShelvesSongSolitaire(params) {
    return axios.post(
      `${base.apiServer}/back/songSolitaire/cancelShelves`,
      params
    )
  },
  /** 删除  歌曲接龙 */
  deletesongSolitaire(params) {
    return axios.post(`${base.apiServer}/back/songSolitaire/delete`, params)
  },
  /** 修改  歌曲接龙 */
  modifySongSolitaire(params) {
    return axios.post(`${base.apiServer}/back/songSolitaire/update`, params)
  },

  /** 查询 活动   */
  findAllActivity(params) {
    return axios.get(
      `${base.apiServer}/back/activity/findAll?sort=serialNumber,desc`,
      {
        params,
      }
    )
  },
  /** 上架  活动 */
  shelvesActivity(params) {
    return axios.post(`${base.apiServer}/back/activity/shelves`, params)
  },
  /** 下架  活动 */
  cancelShelvesActivity(params) {
    return axios.post(`${base.apiServer}/back/activity/cancelShelves`, params)
  },
  /** 新增  活动 */
  addActivity(params) {
    return axios.post(`${base.apiServer}/back/activity/save`, params)
  },
  /** 删除  活动 */
  deleteActivity(params) {
    return axios.post(`${base.apiServer}/back/activity/delete`, params)
  },
  /** 修改  活动 */
  modifyActivity(params) {
    return axios.post(`${base.apiServer}/back/activity/update`, params)
  },
  /** 修改  更新分类排序 */
  updateSerialNumber(params) {
    return axios.post(
      `${base.apiServer}/back/activity/updateSerialNumber`,
      params
    )
  },

  /** 查询 配置表   */
  findAllConfig(params) {
    return axios.get(`${base.apiServer}/back/config/findAll`, {
      params,
    })
  },
  /** 修改  配置表 */
  updateConfig(params) {
    return axios.post(`${base.apiServer}/back/config/update`, params)
  },
  /** 查询 资讯   */
  findAllInformation(params) {
    return axios.get(
      `${base.apiServer}/back/information/findAll?sort=isTop,desc`,
      {
        params,
      }
    )
  },
  /** 新增  资讯 */
  addInformation(params) {
    return axios.post(`${base.apiServer}/back/information/save`, params)
  },
  /** 删除  资讯 */
  deleteInformation(params) {
    return axios.post(`${base.apiServer}/back/information/delete`, params)
  },
  /** 修改  资讯 */
  modifyInformation(params) {
    return axios.post(`${base.apiServer}/back/information/update`, params)
  },
  /** 置顶  资讯 */
  topInformation(params) {
    return axios.post(`${base.apiServer}/back/information/isTop`, params)
  },
  /** 取消置顶  资讯 */
  cancelTopInformation(params) {
    return axios.post(`${base.apiServer}/back/information/cancelIsTop`, params)
  },
  /** 查询 图集类型   */
  findAllGalleryType(params) {
    return axios.get(`${base.apiServer}/back/galleryType/findAll`, {
      params,
    })
  },
  /** 新增  图集类型 */
  addGalleryType(params) {
    return axios.post(`${base.apiServer}/back/galleryType/save`, params)
  },
  /** 删除  图集类型 */
  deleteGalleryType(params) {
    return axios.post(`${base.apiServer}/back/galleryType/delete`, params)
  },
  /** 修改  图集类型 */
  modifyGalleryType(params) {
    return axios.post(`${base.apiServer}/back/galleryType/update`, params)
  },
  /** 查询 图集   */
  findAllGallery(params) {
    return axios.get(`${base.apiServer}/back/gallery/findAll`, {
      params,
    })
  },
  /** 新增  图集 */
  addGallery(params) {
    return axios.post(`${base.apiServer}/back/gallery/save`, params)
  },
  /** 删除  图集 */
  deleteGallery(params) {
    return axios.post(`${base.apiServer}/back/gallery/delete`, params)
  },
  /** 查询 ins   */
  findAllIns(params) {
    return axios.get(`${base.apiServer}/back/ins/findAll`, {
      params,
    })
  },
  /** 新增  ins */
  addIns(params) {
    return axios.post(`${base.apiServer}/back/ins/save`, params)
  },
  /** 删除  ins */
  deleteIns(params) {
    return axios.post(`${base.apiServer}/back/ins/delete`, params)
  },
  /** 修改  ins */
  modifyIns(params) {
    return axios.post(`${base.apiServer}/back/ins/update`, params)
  },

  /** 投票  查询投票*/
  VotedBackFindAll(params) {
    return axios.get(`${base.apiServer}/back/vote/findAll`, {
      params,
    })
  },
  /** 投票  删除*/
  VotedBackDelete(params) {
    return axios.post(`${base.apiServer}/back/vote/delete`, params)
  },
  /** 投票  新增*/
  VotedBackSave(params) {
    return axios.post(`${base.apiServer}/back/vote/save`, params)
  },
  /** 投票  修改*/
  VotedBackUpdate(params) {
    return axios.post(`${base.apiServer}/back/vote/update`, params)
  },

  /** 投票详情  查询投票*/
  VoteItemBackFindAll(params) {
    return axios.get(`${base.apiServer}/back/voteItem/findAll`, {
      params,
    })
  },
  /** 投票详情  查询id投票*/
  VoteItemBackFindAllId(params) {
    return axios.get(`${base.apiServer}/back/voteItem/findById`, {
      params,
    })
  },
  /** 投票详情  删除*/
  VoteItemBackDelete(params) {
    return axios.post(`${base.apiServer}/back/voteItem/delete`, params)
  },
  /** 投票详情  新增*/
  VoteItemBackSave(params) {
    return axios.post(`${base.apiServer}/back/voteItem/save`, params)
  },
  /** 投票详情  修改*/
  VoteItemBackUpdate(params) {
    return axios.post(`${base.apiServer}/back/voteItem/update`, params)
  },
  /** 用户投票记录  查询用户*/
  UserVoteRecordBackFindAll(params) {
    return axios.get(`${base.apiServer}/back/userVoteRecord/findAll`, {
      params,
    })
  },
  /** 抽奖相关接口 查询*/
  LuckyDrawFindAll(params) {
    return axios.get(`${base.apiServer}/back/luckyDraw/findAll`, {
      params,
    })
  },
  /** 抽奖相关接口 新增*/
  LuckyDrawSave(params) {
    return axios.post(`${base.apiServer}/back/luckyDraw/save`, params)
  },
  /** 抽奖相关接口 删除*/
  LuckyDrawDelete(params) {
    return axios.post(`${base.apiServer}/back/luckyDraw/delete`, params)
  },
  
  /** 抽奖相关接口 上架*/
  LuckyDrawShelves(params) {
    return axios.post(`${base.apiServer}/back/luckyDraw/shelves`, params)
  },
  /** 抽奖相关接口 下架*/
  LuckyDrawCancelShelves(params) {
    return axios.post(`${base.apiServer}/back/luckyDraw/cancelShelves`, params)
  },
  /** 抽奖相关接口 更新*/
  LuckyDrawUpdate(params) {
    return axios.post(`${base.apiServer}/back/luckyDraw/update`, params)
  },
  /** 奖品相关接口 查询*/
  PrizeFindByLuckyDrawId(params) {
    return axios.get(`${base.apiServer}/back/prize/findByLuckyDrawId`, {
      params,
    })
  },
  /** 奖品相关接口 新增*/
  PrizeSave(params) {
    return axios.post(`${base.apiServer}/back/prize/save`, params)
  },
  /** 奖品相关接口 删除*/
  PrizeDelete(params) {
    return axios.post(`${base.apiServer}/back/prize/delete`, params)
  },
  /** 奖品相关接口 更新*/
  PrizeUpdate(params) {
    return axios.post(`${base.apiServer}/back/prize/update`, params)
  },
  /** 中奖相关接口 更新*/
  WinnerFindAll(params) {
    return axios.get(`${base.apiServer}/back/winner/findAll`, {
      params,
    })
  },
  /** 中奖相关接口 导出*/
  WinnerExport(params) {
    return axios.get(`${base.apiServer}/back/winner/export`, {
      params,
    })
  },
  /** 新增缩略图 */
  ImageRelationSave(params) {
    return axios.post(`${base.apiServer}/back/imageRelation/save`, params)
  },
  /** 查看缩略图  /back/imageRelation/findByThumbnail*/
  ImageRelationFindByThumbnail(params) {
    return axios.get(`${base.apiServer}/back/imageRelation/findByThumbnail`, {
      params,
    })
  },
  /** 根据缩略图查高清图片  /common/findByThumbnail*/
  FindByThumbnail(params){
    return axios.get(`${base.apiServer}/common/findByThumbnail`, {
      params,
    })
  },

  /** 根据id查询异步任务 */
  getAsyncTask(params){
    return axios.get(`${base.apiServer}/common/getAsyncTask`, {
      params,
    })
  },

  /** 获取网龙token*/
  getWlToken(params) {
    return axios.post(`${base.apiServer}/common/wl/file/wlToken`, params)
  },
  /** 网龙上传文件*/
  wlFileUpload(params) {
    return axios.post(`${base.apiServer}/common/wl/file/upload`, params)
  },
  /** 网龙上传文件*/
  wlUploadFileCheck(params) {
    return axios.post(`${base.apiServer}/common/wl/file/check`, params)
  },
}
