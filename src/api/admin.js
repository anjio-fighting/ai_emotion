import service from '@/utils/request';

//登录接口
export function login(data) {
  //data：这是要发送给服务器的数据（通常是 { username: '...', password: '...' }）
  // post 方法会将这些数据作为请求体（Request Body）发送。
  return service.post('/user/login', data);
}

//获取知识文章列表接口
export function categoryTree() {
  return service.get('/knowledge/category/tree');
}

//获取知识文章页数接口
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params });
}

//获取知识文章标签接口
export function getTags() {
  return service.get('/knowledge/article/tags');
}

//上传知识文章封面接口
export function uploadFile(file, businessInfo) {
  const formData = new FormData();
  formData.append('file', file);//将文件添加到FormData对象中
  formData.append('businessType', 'ARTICLE');
  formData.append('businessId', businessInfo.businessId);
  formData.append('businessField', 'cover');
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'//设置请求头为multipart/form-data，用于上传文件
    }
  });
}

//创建知识文章接口
export function createArticle(data) {
  return service.post('/knowledge/article', data);
}

//获取知识文章详情接口
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`);
}

//更新知识文章接口
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data);
}

//更新知识文章状态接口
export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data);
}

//删除知识文章接口
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`);
}

//获取咨询会话列表接口
export function getConsultations(params) {
  return service.get('/psychological-chat/sessions', { params });
}

//获取咨询会话详情接口
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}

//获取情绪日志分页接口
export function getEmotionalPage(params) {
  return service.get('/emotion-diary/admin/page', { params });
}

//删除情绪日志接口
export function deleteEmotional(id) {
  return service.delete(`/emotion-diary/admin/${id}`);
}

//获取分析概览接口
export function getAnalyticOverview() {
  return service.get('/data-analytics/overview');
}

//退出登录接口
export function logout() {
  return service.post('/user/logout');
}