import { PlusOutlined } from '@ant-design/icons'
import { Input, Tag } from 'antd'
import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'

const EmailTagGroup = ({ tags, setTags }) => {
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const showInput = useCallback(() => {
    setInputVisible(true)
  }, [setInputVisible])

  const handleInputChange = useCallback(
    e => {
      setInputValue(e.currentTarget.value)
    },
    [setInputValue],
  )

  const handleInputConfirm = useCallback(() => {
    const tagValues = [...tags]
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tagValues.push(inputValue)
    }
    setTags(tagValues)
    setInputVisible(false)
    setInputValue('')
  }, [tags, setTags, inputValue, setInputVisible, setInputValue])

  const handleClose = useCallback(
    removedTag => {
      const tagValues = [...tags]
      const filtered = tagValues.filter(tag => tag !== removedTag)
      setTags(filtered)
    },
    [tags, setTags],
  )

  return (
    <div>
      {tags.map(tag => (
        <Tag key={tag} closable={true} onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          className="tag-input"
          size="small"
          style={{ width: 160 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> <FormattedMessage id="addStudents.input.add" />
        </Tag>
      )}
    </div>
  )
}

export default EmailTagGroup
