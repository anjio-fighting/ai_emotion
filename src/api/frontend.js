import service from "@/utils/request";

//注册
export const register = (data) => {
  return service.post('/user/add', data);
}

//创建会话
export const startSession = (data) => {
  return service.post('/psychological-chat/session/start', data);
}

//获取会话列表
export const getSessionList = (params) => {
  return service.get('/psychological-chat/sessions', { params });
}

//删除会话
export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`);
}

export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}

