import localeAntd from 'antd/es/locale/en_US'

const messages = {
  'topBar.issuesHistory': 'Issues History',
  'topBar.projectManagement': 'Project Management',
  'topBar.typeToSearch': 'Search...',
  'topBar.findPages': 'Find pages...',
  'topBar.actions': 'Actions',
  'topBar.status': 'Status',
  'topBar.profileMenu.hello': 'Hello',
  'topBar.profileMenu.billingPlan': 'Billing Plan',
  'topBar.profileMenu.role': 'Role',
  'topBar.profileMenu.email': 'Email',
  'topBar.profileMenu.phone': 'Phone',
  'topBar.profileMenu.editProfile': 'Edit Profile',
  'topBar.profileMenu.logout': 'Logout',
  'lobbyCard.joinRoom': 'Join',
  'lobbyCard.scheduled': 'Scheduled',
  'lobbyCard.ended': 'Ended',
  'lobbyCard.participantsInvited':
    '{count, plural, =0 {No one is invited} one {# student is invited} other {# students are invited}}',
  'lobbyCard.participantsJoined':
    '{count, plural, =0 {No one has joined} one {# student has joined} other {# students have joined}}',
  'lobbyCard.participantsAttended':
    '{count, plural, =0 {No one attended} one {# student attended} other {# students attended}}',
  'scheduleRoom.button': 'Schedule Room',
  'scheduleRoom.modal.title': 'Schedule Room',
  'scheduleRoom.modal.okText': 'Schedule',
  'scheduleRoom.modal.cancelText': 'Cancel',
  'scheduleRoom.form.roomName': 'Room Name',
  'scheduleRoom.form.roomNameMissing': 'Please input the room name',
  'scheduleRoom.form.time': 'Start and End Time',
  'scheduleRoom.form.timeMissing': 'Please input the time',
}

export default {
  locale: 'en-US',
  localeAntd,
  messages,
}
