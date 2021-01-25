import localeAntd from 'antd/es/locale/ru_RU'

const messages = {
  'topBar.issuesHistory': 'История заданий',
  'topBar.projectManagement': 'Управление проектом',
  'topBar.typeToSearch': 'Поиск...',
  'topBar.findPages': 'Поиск страниц...',
  'topBar.actions': 'Действия',
  'topBar.status': 'Статус',
  'topBar.profileMenu.hello': 'Привет',
  'topBar.profileMenu.billingPlan': 'Тарифный план',
  'topBar.profileMenu.role': 'Роль',
  'topBar.profileMenu.email': 'Емайл',
  'topBar.profileMenu.phone': 'Телефон',
  'topBar.profileMenu.editProfile': 'Редактировать профиль',
  'topBar.profileMenu.logout': 'Выйти',
  'lobbyCard.joinRoom': 'вступать',
  'lobbyCard.scheduled': 'Запланированное',
  'lobbyCard.ended': 'оконченный',
  'lobbyCard.participantsInvited':
    '{count, plural, =0 {никто не приглашен} one {Приглашен # студент} other {Приглашены # студента}}',
  'lobbyCard.participantsJoined':
    '{count, plural, =0 {никто не присоединился} one {# студент присоединился} other {Присоединились # студента}}',
  'lobbyCard.participantsAttended':
    '{count, plural, =0 {никто присутствовал} one {Присутствовал # студент} other {Посетили # студента}}',
  'scheduleRoom.button': 'Запланировать комнату',
  'scheduleRoom.modal.title': 'Запланировать комнату',
  'scheduleRoom.modal.okText': 'назначать',
  'scheduleRoom.modal.cancelText': 'отменить',
  'scheduleRoom.form.roomName': 'название комнаты',
  'scheduleRoom.form.roomNameMissing': 'Пожалуйста, введите название комнаты',
  'scheduleRoom.form.time': 'Время начала и окончания',
  'scheduleRoom.form.timeMissing': 'Пожалуйста, введите время',
}

export default {
  locale: 'ru-RU',
  localeAntd,
  messages,
}
