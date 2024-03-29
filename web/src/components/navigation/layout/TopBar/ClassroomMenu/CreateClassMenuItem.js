import ACL from 'components/navigation/system/ACL'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DropdownItem } from 'reactstrap'

const CreateClassMenuItem = ({ toggleModalVisible }) => {
  return (
    <ACL roles={['INSTRUCTOR']}>
      <DropdownItem divider />
      <DropdownItem onClick={toggleModalVisible}>
        <div>
          <h6 className="text-success">
            <i className="fe fe-plus mr-1" />
            <FormattedMessage id="home.createClass.button" />
          </h6>
        </div>
      </DropdownItem>
    </ACL>
  )
}

export default CreateClassMenuItem
