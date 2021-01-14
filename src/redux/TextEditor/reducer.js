import { TextEditorActionTypes } from '../TextEditor/types'
import { AppActionTypes } from '../App/types'
import { defaultEntry } from '../Entries/utils'
import { getStringBytes } from '../../utils'

const defaultTextEditor = {
  ...defaultEntry,
  bottomToolbarIsOpen: true,
}

const DEFAULT_STATE_TEXT_EDITOR = {
  ...defaultTextEditor,
  _size: getStringBytes(defaultTextEditor),
}

const TextEditor = (state = DEFAULT_STATE_TEXT_EDITOR, action) => {
  const { type, payload } = action
  switch (type) {
    case TextEditorActionTypes.TEXT_EDITOR_SET:
      return { ...state, ...payload, _lastUpdated: new Date() }

    case TextEditorActionTypes.TEXT_EDITOR_SET_BOTTOM_TOOLBAR:
      return { ...state, bottomToolbarIsOpen: payload }

    case TextEditorActionTypes.TEXT_EDITOR_CLEAR:
      return {
        ...DEFAULT_STATE_TEXT_EDITOR,
        tags: [],
        EntryFiles: [],
        rating: 0,
        _clearedOn: new Date(),
      }

    case AppActionTypes.REDUX_RESET:
      return {
        ...DEFAULT_STATE_TEXT_EDITOR,
        tags: [],
        EntryFiles: [],
        rating: 0,
        _clearedOn: new Date(),
      }

    case AppActionTypes.LOAD_PERSISTED_STATE:
      return payload?.TextEditor || state

    default:
      return state
  }
}

export { DEFAULT_STATE_TEXT_EDITOR, TextEditor }
