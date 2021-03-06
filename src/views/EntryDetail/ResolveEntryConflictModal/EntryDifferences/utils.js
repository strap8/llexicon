import React from 'react'
import Moment from 'react-moment'
import { CloudDownload } from '../../../../images/SVG'
import { formatBytes } from '../../../../utils'
import { getTagStringFromObject } from 'redux/Entries/utils'

const ORDER_PROPS = [
  'title',
  'html',
  'tags',
  'people',
  'address',
  'date_created',
  'date_created_by_author',
  'date_updated',
  '_lastUpdated',
  'views',
  'rating',
  'EntryFiles',
  'is_public',
  'latitude',
  'longitude',
  '_size',
  'size',
]

const getEntryPropSortOrder = prop => {
  switch (prop) {
    case 'title':
      return 16

    case 'html':
      return 15

    case 'tags':
      return 14

    case 'people':
      return 13

    case 'address':
      return 12

    case 'date_created':
      return 11

    case 'date_created_by_author':
      return 10

    case 'date_updated':
      return 9

    case '_lastUpdated':
      return 8

    case 'views':
      return 7

    case 'rating':
      return 6

    case 'EntryFiles':
      return 5

    case 'is_public':
      return 4

    case 'latitude':
      return 3

    case 'longitude':
      return 2

    case '_size':
      return 1

    case 'size':
      return 0

    default:
      return -1
  }
}

const getEntryPropIcon = prop => {
  switch (prop) {
    case 'title':
      return <i className='fas fa-heading' />

    case 'html':
      return <i className='fas fa-keyboard' />

    case 'tags':
      return <i className='fas fa-tags' />

    case 'people':
      return <i className='fas fa-users' />

    case 'address':
      return <i className='fas fa-map-marker-alt' />

    case 'date_created':
      return <i className='fas fa-calendar-day' />

    case 'date_created_by_author':
      return <i className='fas fa-calendar-day' />

    case 'date_updated':
      return <i className='fas fa-pencil-alt' />

    case '_lastUpdated':
      return <i className='fas fa-pencil-alt' />

    case 'views':
      return <i className='far fa-eye' />

    case 'rating':
      return <i className='fas fa-star' />

    case 'EntryFiles':
      return <i className='fas fa-photo-video' />

    case 'is_public':
      return <i className='fas fa-lock-open' />

    case 'latitude':
      return <i className='fas fa-compass' />

    case 'longitude':
      return <i className='fas fa-compass' />

    case '_size':
      return <i className='fas fa-hdd' />

    case 'size':
      return <CloudDownload height={18} />

    default:
      return <i className='fas fa-exclamation-circle' />
  }
}

const renderEntryProp = (prop, propValue) => {
  switch (prop) {
    case 'title':
      return propValue

    case 'html':
      return propValue

    case 'tags':
      return getTagStringFromObject(propValue)

    case 'people':
      return getTagStringFromObject(propValue)

    case 'address':
      return propValue

    case 'date_created':
      return <Moment format='D MMM YY hh:mm:ssa'>{propValue}</Moment>

    case 'date_created_by_author':
      return <Moment format='D MMM YY hh:mm:ssa'>{propValue}</Moment>

    case 'date_updated':
      return <Moment format='D MMM YY hh:mm:ssa'>{propValue}</Moment>

    case '_lastUpdated':
      return <Moment format='D MMM YY hh:mm:ssa'>{propValue}</Moment>

    case 'views':
      return propValue

    case 'rating':
      return propValue

    case 'EntryFiles':
      return <i className='fas fa-photo-video' />

    case 'is_public':
      return `${propValue}`

    case 'latitude':
      return propValue

    case 'longitude':
      return propValue

    case '_size':
      return formatBytes(propValue)

    case 'size':
      return formatBytes(propValue)

    default:
      return `${propValue}`
  }
}

export { getEntryPropSortOrder, getEntryPropIcon, renderEntryProp }
