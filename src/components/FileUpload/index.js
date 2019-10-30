import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { FormGroup, Label, Input, Media, FormText } from "reactstrap"

import "./styles.css"

class FileUpload extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  render() {
    const { value, onChangeCallback } = this.props
    return (
      <FormGroup className="FileUploadContainer Center">
        <FormText color="white">Upload your Profile Picture</FormText>
        <Label className="FileUpload" for="fileUpload">
          {!value ? (
            <i className="fas fa-camera-retro fa-4x" />
          ) : (
            <Media src={value} />
          )}
        </Label>
        <Input
          type="file"
          name={value}
          id="fileUpload"
          onChange={onChangeCallback}
          multiple
        />
      </FormGroup>
    )
  }
}
export default FileUpload
