import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { EntryPropType } from 'redux/Entries/propTypes'
import { Header, TagsContainer } from 'components'
import { Col, Media } from 'reactstrap'
import { GetEntryDetailUrl } from 'redux/router/actions'
import './styles.css'

const EntryMedia = ({ entryId, title, tags, people, src, isVideo }) => {
  const entryDetailRoute = useMemo(() => GetEntryDetailUrl(entryId), [entryId])

  return (
    <Col tag='a' href={entryDetailRoute} xs={6} md={4} xl={3} className='EntryMediaContainer px-1'>
      <Header fontSize='1.25rem' className='EntryMedia Overflow' center={false}>
        {title}
      </Header>
      {isVideo ? (
        <iframe title={title} className='embed-responsive embed-responsive-16by9' src={src} />
      ) : (
        <Media className='EntryMedia' src={src} />
      )}
      <TagsContainer tags={tags} />
      <TagsContainer tags={people} faIcon='fas fa-user' emptyString='No people...' />
    </Col>
  )
}

EntryMedia.propTypes = {
  entryId: EntryPropType.id,
  title: PropTypes.string,
  tags: EntryPropType.tags,
  people: EntryPropType.people,
  src: PropTypes.string,
  isVideo: PropTypes.bool,
}

EntryMedia.defaultProps = {
  isVideo: false,
}

export default memo(EntryMedia)
