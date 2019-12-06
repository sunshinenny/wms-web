/**
 * api接口统一管理
 */
import {
  get,
  post,
  json,
  upload,
  download,
  baseURL
} from './http'

/**
 * 文件操作相关接口
 */
// export const uploadURL = baseURL+'/mis/tools/upload' // 上传
// export const fileDownload = p => download('/mis/tools/download', p, ) // 下载
/**
 * 库存信息相关接口
 */
export const pageAllStockByAddress = p =>post ('/wms/stock/pageAllStockByAddress', p, ) // 分页查询所有的库存信息
export const changeStockNum = p => post('/wms/stock/changeStockNum', p, ) // 出入库操作
export const listStockHistory = p => post('/wms/stock/listStockHistory', p, ) // 显示一条记录的历史记录
/**
 * 型号相关接口
 */
export const listModel = p => post('/wms/model/listModel', p, ) // 获取所有的型号记录,并且根据其父子关系处理好字符串
/**
 * 地址相关接口
 */
export const listAddress = p => post('/wms/address/listAddress', p, ) // 获取所有仓库的地址