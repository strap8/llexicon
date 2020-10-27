import React, { useState, useCallback, useMemo, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import EntryMedia from './EntryMedia'
import { Container } from 'reactstrap'
import { useScrollable } from 'hooks'
import './styles.css'

const I_FRAME_REGEX = /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/gm
const IMAGE_REGEX = /<img.*?src="([^"]+)".*?>/gm
const SRC_REGEX = /(?<=src=").*?(?=[\?"])/
const SRC_REGEX_GLOBAL = /(?<=src=").*?(?=[\?"])/gm
const YOUTUBE_VIDEO_ID = /youtube\.com.*(\?v=|\/embed\/)(.{11})/

// sd, mq, hq, maxres
const getYouTubeThumnail = (videoId, quality = 'sd') =>
  `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`

const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const EntriesMedia = ({ entries }) => {
  const [viewableEntriesRange, setViewableEntriesRange] = useState(DEFAULT_VIEWABLE_ENTRIES_RANGE)

  const [beginOffset, endOffset] = viewableEntriesRange

  const handleReachedBottom = useCallback(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [beginOffset, endOffset])

  const handleOnScroll = useScrollable({ handleReachedBottom })

  const viewableEntries = useMemo(() => entries.slice(beginOffset, endOffset), [
    entries,
    beginOffset,
    endOffset,
  ])

  const renderEntryMedia = useMemo(() => {
    return viewableEntries.reduce(
      (acc, { id: entryId, title, html, tags, people, EntryFiles }, i) => {
        const defaultProps = { entryId, title, tags, people }

        if (EntryFiles?.length > 0) {
          EntryFiles.forEach(({ id, url, entry_id }, j) => {
            acc.push(
              <EntryMedia key={`File-${entryId}-${id}-${i}-${j}`} {...defaultProps} src={url} />,
            )
          })
        }

        if (I_FRAME_REGEX.test(html)) {
          I_FRAME_REGEX.lastIndex = 0
          let iterator
          while ((iterator = I_FRAME_REGEX.exec(html))) {
            const { 0: src, groups, index, input, length } = iterator
            const youTubeVideoId = src?.match(YOUTUBE_VIDEO_ID)?.pop()
            const thumbnailSrc = getYouTubeThumnail(youTubeVideoId)
            acc.push(
              <EntryMedia
                key={`iFrame-${entryId}-${i}-${I_FRAME_REGEX.lastIndex}`}
                {...defaultProps}
                isVideo={!thumbnailSrc}
                src={thumbnailSrc || src}
              />,
            )
          }
        }

        if (IMAGE_REGEX.test(html)) {
          IMAGE_REGEX.lastIndex = 0
          let iterator
          while ((iterator = IMAGE_REGEX.exec(html))) {
            const { 0: image, 1: src, groups, index, input, length } = iterator
            acc.push(<EntryMedia key={`Image-${entryId}-${i}-${IMAGE_REGEX.lastIndex}`} {...defaultProps} src={src} />)
          }
        }

        return acc
      },
      [],
    )
  }, [viewableEntries])

  // console.log('renderEntryMedia: ', renderEntryMedia)

  return (
    <Container>
      <div className='EntriesMediaContainer Container row' onScroll={handleOnScroll}>
        {renderEntryMedia}
      </div>
    </Container>
  )
}

EntriesMedia.propTypes = {
  entries: EntriesPropTypes,
}

export default memo(EntriesMedia)
