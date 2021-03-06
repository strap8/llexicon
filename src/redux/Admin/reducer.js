import { AdminActionTypes } from './types'
import { EntriesActionTypes } from '../Entries/types'
import { AppActionTypes } from '../App/types'
import { getStringBytes } from 'utils'

const DEFAULT_STATE_ADMIN = {
  users: { isPending: false, items: [], item: null },
}

const Admin = (state = DEFAULT_STATE_ADMIN, action) => {
  const { type, id, payload } = action
  switch (type) {
    case AdminActionTypes.ADMIN_USERS_PENDING:
      return {
        ...state,
        users: { ...state.users, isPending: true },
      }

    case AdminActionTypes.ADMIN_SET_USERS:
      return {
        ...state,
        users: { ...state.users, isPending: false, items: payload },
      }

    case AdminActionTypes.ADMIN_SET_USERS_ENTRIES:
      const userEntries = payload.reduce((entryMap, userEntry) => {
        const { id, author } = userEntry
        const isArray = entryMap[author] ? true : false

        entryMap[author] = isArray ? entryMap[author].concat(userEntry) : [userEntry]

        return entryMap
      }, {})

      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user => ({
            ...user,
            entries: userEntries[user.id],
          })),
        },
      }

    case AdminActionTypes.ADMIN_SET_USER_ENTRIES_DETAILS:
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user =>
            user.id === id
              ? {
                  ...user,
                  entries: payload,
                }
              : user,
          ),
        },
      }

    case AdminActionTypes.ADMIN_SET_USER_ENTRY:
      return {
        ...state,
        users: { ...state.users, isPending: false, item: payload },
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_ADMIN

    case AppActionTypes.LOAD_PERSISTED_STATE:
      return payload?.Admin || state

    case EntriesActionTypes.ENTRIES_UPDATE:
      let updatedItem
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(e => {
            if (payload.id === e.id) {
              updatedItem = { ...e, ...payload }
              return {
                ...updatedItem,
                _size: getStringBytes(updatedItem),
              }
            } else if (payload[e.id]) {
              updatedItem = { ...e, ...payload[e.id] }
              return {
                ...updatedItem,
                _size: getStringBytes(updatedItem),
              }
            }

            return e
          }),
        },
      }

    case EntriesActionTypes.ENTRIES_DELETE:
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user => ({
            ...user,
            entries: user?.entries?.filter(e => payload !== e.id || !payload[e.id]),
          })),
        },
      }

    default:
      return state
  }
}

export { DEFAULT_STATE_ADMIN, Admin }
