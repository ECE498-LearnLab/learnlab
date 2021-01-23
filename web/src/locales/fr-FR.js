import localeAntd from 'antd/es/locale/fr_FR'

const messages = {
  'topBar.issuesHistory': 'Histoire des problèmes',
  'topBar.projectManagement': 'Gestion de projet',
  'topBar.typeToSearch': 'Chercher...',
  'topBar.findPages': 'Trouver des pages...',
  'topBar.actions': 'Actes',
  'topBar.status': 'Statut',
  'topBar.profileMenu.hello': 'Bonjour',
  'topBar.profileMenu.billingPlan': 'Plan de facturation',
  'topBar.profileMenu.role': 'Rôle',
  'topBar.profileMenu.email': 'Email',
  'topBar.profileMenu.phone': 'Téléphone',
  'topBar.profileMenu.editProfile': 'Editer le profil',
  'topBar.profileMenu.logout': 'Connectez - Out',
  'lobbyCard.joinRoom': 'Joindre',
  'lobbyCard.scheduled': 'Programmé',
  'lobbyCard.ended': 'Terminé',
  'lobbyCard.participantsInvited':
    '{count, plural, =0 {Personne n’est invité} one {# étudiant est invité} other {# étudiants sont invités}}',
  'lobbyCard.participantsJoined':
    '{count, plural, =0 {Personne n’a adhéré} one {# étudiant a adhéré à } other {# étudiants ont rejoint}}',
  'lobbyCard.participantsAttended':
    '{count, plural, =0 {Personne n’était là} one {# étudiant ont participé à} other {# students ont participé}}',
  'scheduleRoom.button': 'Planifiez la salle',
  'scheduleRoom.modal.title': 'Planifiez la salle',
  'scheduleRoom.modal.okText': 'Planifier',
  'scheduleRoom.modal.cancelText': 'Annuler',
  'scheduleRoom.form.roomName': 'Nom de la salle',
  'scheduleRoom.form.roomNameMissing': 'Veuillez saisir le nom de la salle',
  'scheduleRoom.form.time': 'Heure de début et de fin',
  'scheduleRoom.form.timeMissing': "Veuillez saisir l'heure",
}

export default {
  locale: 'fr-FR',
  localeAntd,
  messages,
}
