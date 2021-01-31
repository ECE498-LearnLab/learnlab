import localeAntd from 'antd/es/locale/zh_CN'

const messages = {
  'topBar.issuesHistory': '发布历史',
  'topBar.projectManagement': '项目管理',
  'topBar.typeToSearch': '搜索...',
  'topBar.findPages': '查找页面...',
  'topBar.actions': '动作',
  'topBar.status': '状态',
  'topBar.profileMenu.hello': '你好',
  'topBar.profileMenu.billingPlan': '结算计划',
  'topBar.profileMenu.role': '角色',
  'topBar.profileMenu.email': '电子邮件',
  'topBar.profileMenu.phone': '电话',
  'topBar.profileMenu.editProfile': '编辑个人资料',
  'topBar.profileMenu.logout': '登出',
  'lobbyCard.joinRoom': '会合',
  'lobbyCard.scheduled': '预定的',
  'lobbyCard.ended': '已结束',
  'lobbyCard.participantsInvited':
    '{count, plural, =0 {不邀请任何人} one {邀请一名学生} other {邀请#名学生}}',
  'lobbyCard.participantsJoined':
    '{count, plural, =0 {没有人加入} one {#名学生已加入} other {#名学生已加入}}',
  'lobbyCard.participantsAttended':
    '{count, plural, =0 {没有人参加} one {#名学生参加} other {#名学生参加}}',
  'scheduleRoom.button': '安排房间',
  'scheduleRoom.modal.title': '安排房间',
  'scheduleRoom.modal.okText': '安排',
  'scheduleRoom.modal.cancelText': '取消',
  'scheduleRoom.form.roomName': '房间名称',
  'scheduleRoom.form.roomNameMissing': '请输入房间名称',
  'scheduleRoom.form.time': '开始和结束时间',
  'scheduleRoom.form.timeMissing': '请输入时间',
  'scheduleRoom.form.participants': '参加者',
  'scheduleRoom.form.selectParticipants.placeholder': '请选择参加者',
  'createClass.modal.title': '创建类',
  'createClass.modal.okText': '创建',
  'createClass.modal.cancelText': '取消',
  'createClass.form.className': '类名',
  'createClass.form.classNameMissing': '请输入类名',
  'createClass.form.classSubject': '学科',
  'createClass.form.classSubjectMissing': '请输入主题',
  'createClass.form.classDescription': '描述',
  'home.createClass.button': '创建新类',
  'home.title.allClasses': '所有类',
  'classMenu.placeholder.selectClass': '选择一个类',
}

export default {
  locale: 'zh-CN',
  localeAntd,
  messages,
}
