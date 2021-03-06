import { AppActionTypes } from '../App/types'
import axios from 'axios'
import ReactGA from 'react-ga'
import { getLocalStorageCapacity } from './utils'
const { PUBLIC_URL } = process.env

const SetLocalStorageUsage = () => (dispatch, getState) => {
  const { localStorageCapacity: localStorageCapacityFromRedux } = getState().App
  const localStorageCapacity = localStorageCapacityFromRedux || getLocalStorageCapacity()

  let payload = { localStorageCapacity }

  if (navigator?.storage?.estimate) {
    return navigator.storage.estimate().then(({ usage, quota, usageDetails }) => {
      payload = {
        ...payload,
        localStorageUsage: usage,
        localStorageQuota: quota,
        localStorageUsageDetails: usageDetails,
      }
      dispatch({ type: AppActionTypes.APP_SET_LOCAL_STORAGE_USAGE, payload })
      return [usage, quota]
    })
  } else {
    dispatch({ type: AppActionTypes.APP_SET_LOCAL_STORAGE_USAGE, payload })
  }
}

const ResetRedux = () => ({ type: AppActionTypes.REDUX_RESET })

const GetAppVersion = () => (dispatch, getState) => {
  const {
    App: { version },
  } = getState()
  return axios
    .get(`${PUBLIC_URL}/version.txt`)
    .then(({ data }) => {
      dispatch({ type: AppActionTypes.APP_SET_VERSION, payload: data })
      ReactGA.event({
        category: 'Check App Version',
        action: 'User got the latest app version!',
        value: data,
      })

      return { currentVersion: version, latestVersion: data }
    })
    .catch(({ response }) => console.log('ERROR: ', response))
}

const LoadReducerState = state => ({
  type: AppActionTypes.LOAD_PERSISTED_STATE,
  payload: state || {},
})

export { SetLocalStorageUsage, ResetRedux, GetAppVersion, LoadReducerState }
