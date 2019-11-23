import React, { Component, Fragment, createRef } from "react"
import PropTypes from "prop-types"
import ReactQuill, { Quill } from "react-quill"
import ImageResize from "quill-image-resize-module-react"
import Divider from "../Divider"
import deepEquals from "../../helpers/deepEquals"
import "react-quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"
import "react-quill/dist/quill.core.css"
// import "quill-emoji/dist/quill-emoji.css"
// import "quill-mention/dist/quill.mention.min.css"
import "./styles.css"
import Toolbar from "./Toolbar"

// const Size = Quill.import("formats/size")
// Size.whitelist = ["extra-small", "small", "medium", "large"]
// Quill.register(Size, true)

const Font = Quill.import("formats/font")
Font.whitelist = [
  "roboto",
  "arial",
  "serif",
  "monospace",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
]

Quill.register(Font, true)

Quill.register("modules/imageResize", ImageResize)

// Quill.setAttribute('spellcheck', true)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble"
}

class Editor extends Component {
  constructor(props) {
    super(props)

    const { toolbarId, html, theme, showDivider } = props

    this.toolbarId = `toolbar-${toolbarId}`

    this.editorRef = createRef()

    this.state = {
      quillId: toolbarId.toString(),
      html,
      theme,
      showDivider
    }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    html: PropTypes.string.isRequired,
    onChangeCallback: PropTypes.func,
    showDivider: PropTypes.bool,
    toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,

    // Quill
    id: PropTypes.string,
    className: PropTypes.string,
    theme: PropTypes.string,
    style: PropTypes.instanceOf(React.CSSProperties),
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    tabIndex: PropTypes.number,
    bounds: PropTypes.oneOfType([PropTypes.string, HTMLElement]),
    scrollingContainer: PropTypes.oneOfType([PropTypes.string, HTMLElement]),
    onChange: PropTypes.func,
    onChangeSelection: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    theme: PropTypes.string,
    modules: PropTypes.object,
    formats: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  static defaultProps = {
    theme: THEMES.SNOW,

    height: "100%",
    width: "100%",
    showDivider: false,
    toolbarId: 1,
    placeholder: "Today I have..."
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const previousHtml = prevState.html
    const { html } = nextProps

    const htmlChanged = previousHtml !== html

    if (htmlChanged) return { html }

    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props
    const nextChildren = nextProps.children

    const childrenChanged = !deepEquals(children, nextChildren)

    const { html } = this.state
    const nextHtml = nextState.html

    const htmlChanged = html !== nextHtml

    return childrenChanged || htmlChanged
  }

  componentDidMount() {
    // console.log(this.editorRef)
    // console.log(this.editorRef.current.editor.history)
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // console.log("getSnapshotBeforeUpdate: ", prevProps)
    // return "SNAP"
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate: ", snapshot)
  }

  componentWillUnmount() {}

  handleEditorStateChange = html => {
    const { onChangeCallback } = this.props

    onChangeCallback(html)
  }

  getModules = ({ toolbarId, editorRef }) => {
    return {
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: false
      },
      toolbar: `#${toolbarId}`,
      // toolbar: {
      //   container: [
      //     ["bold", "italic", "underline", "strike"], // toggled buttons
      //     ["blockquote", "code-block"],

      //     // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      //     // [{ header: 1 }, { header: 2 }], // custom button values
      //     [{ header: [1, 2, 3, 4, 5, false] }],

      //     [{ list: "ordered" }, { list: "bullet" }],
      //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
      //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      //     [{ direction: "rtl" }], // text direction

      //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      //     [{ align: [] }, { font: [] }],
      //     ["link", "image", "video"],
      //     ["clean"],
      //     ["undo", "redo"]
      //   ],

      //   // https://github.com/zenoamaro/react-quill/issues/436
      //   handlers: {
      //     undo: () => {
      //       editorRef.current.editor.history.undo()
      //     },
      //     redo: () => {
      //       editorRef.current.editor.history.undo()
      //     }
      //     // image: () => {
      //     //   this.showImageUploadModal();
      //     // },
      //     // video: () => {
      //     //   this.showVideoUploadModal()
      //     // },
      //     // insertImage: this.insertImage,
      //   }
      // },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
      },
      imageResize: {
        parchment: Quill.import("parchment")
        // See optional "config" below
      }
      // imageDrop: {}
    }
  }

  getFormats = ({}) => {
    return [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "color",
      "background",
      "font",
      "code",
      "size",
      "script",
      "align",
      "direction",
      "code-block",
      "image",
      "video",
      "alt",
      "height",
      "width",
      "style",
      "size"
    ]
  }

  render() {
    const { toolbarId, editorRef } = this
    const {
      children,
      onChangeCallback,
      height,
      width,
      placeholder
    } = this.props
    const { html, theme, showDivider, quillId } = this.state

    return (
      <Fragment>
        {children}
        <div className="text-editor" style={{ height, width }}>
          <Toolbar
            toolbarId={toolbarId}
            editorRef={editorRef}
            onChangeCallback={onChangeCallback}
          />
          <ReactQuill
            id={quillId}
            bounds={"app"}
            ref={editorRef}
            className="Editor"
            theme={theme}
            modules={this.getModules(this)}
            formats={this.getFormats(this)}
            value={html}
            onChange={this.handleEditorStateChange}
            placeholder={placeholder}
          />
        </div>
        {showDivider && <Divider />}
      </Fragment>
    )
  }
}
export default Editor