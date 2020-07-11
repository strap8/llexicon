import React, { useMemo, lazy, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { EntryPropType } from "../../../../redux/Entries/propTypes"
import { GetEntryDetailUrl } from "../../../../redux/router/actions"
import { BasicCard } from "../../.."
import EntryCardHtml from "../EntryCardHtml"
import EntryCardTitle from "../EntryCardTitle"
import EntryCardText from "../EntryCardText"
import "./styles.css"

const EntryOptionsMenu = lazy(() => import("../../EntryOptionsMenu"))

const EntryCard = ({
  id,
  tags,
  people,
  EntryFiles,
  title,
  html,
  date_created,
  date_created_by_author,
  date_updated,
  views,
  rating,
  address,
  latitude,
  longitude,
  is_public,
  author,
  _lastUpdated,
  _size,
  size,
  selected,
  onClickCallback,
  minimal,
}) => {
  const href = useMemo(() => GetEntryDetailUrl(id), [id])
  const tag = onClickCallback ? "div" : "a"

  const cardHeader = useMemo(
    () => (
      <Fragment>
        <EntryCardHtml html={html} views={views} rating={rating} />
        <div
          className="EntryOptionsMenuContainer"
          onClick={(e) => e.preventDefault()}
        >
          <EntryOptionsMenu
            entryId={id}
            title={title}
            is_public={is_public}
            author={author}
            shouldSyncOnUpdate={true}
          />
        </div>
      </Fragment>
    ),
    [id, is_public, html, views, rating]
  )

  const cardTitle = useMemo(
    () => ({
      name: title,
      render: <EntryCardTitle title={title} is_public={is_public} />,
    }),
    [title, is_public]
  )

  const cardText = useMemo(
    () =>
      !minimal && (
        <EntryCardText
          tags={tags}
          people={people}
          date_created_by_author={date_created_by_author}
          date_updated={date_updated}
          views={views}
          rating={rating}
          size={size || _size}
        />
      ),
    [
      tags,
      people,
      date_created_by_author,
      date_updated,
      views,
      rating,
      _size,
      size,
      minimal,
    ]
  )

  return (
    <BasicCard
      selected={selected}
      tag={tag}
      onClickCallback={onClickCallback}
      href={href}
      header={cardHeader}
      title={cardTitle}
      text={cardText}
      cardClassName="EntryCardContainer"
      cardHeaderClassName="EntryCardHeader Overflow p-0"
      cardBodyClassName="px-2 pt-0 pb-2"
      cardTextClassName="EntryCardText"
    />
  )
}

EntryCard.propTypes = {
  ...EntryPropType,
  selected: PropTypes.bool.isRequired,
  onClickCallback: PropTypes.func,
  minimal: PropTypes.bool.isRequired,
}

EntryCard.defaultProps = { selected: false, minimal: false }

export default memo(EntryCard)
