import ACL from 'components/navigation/system/ACL'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'reactstrap'

const AddStudentsButton = ({ toggleModalVisible }) => {
  return (
    <ACL roles={['INSTRUCTOR']}>
      <Button color="success" className="mr-3" onClick={toggleModalVisible}>
        <FormattedMessage id="classlist.button.text" />
      </Button>
    </ACL>
  )
}

export default AddStudentsButton
