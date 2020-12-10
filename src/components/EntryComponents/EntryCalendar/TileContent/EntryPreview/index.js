import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { EntryTagsProps } from "redux/Entries/propTypes"
import { Media } from "reactstrap"
import { connect } from "react-redux"
import { GoToEntryDetail } from "redux/router/actions"
import Moment from "react-moment"
import Star from "../../../../BackgroundImage/Star"
import { EntryPropType } from "redux/Entries/propTypes"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }, { EntryFiles }) => ({
  isMobile,
})

const EntryPreview = ({
  isMobile,
  view,
  size,
  author,
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
  _size,
  _shouldDelete,
  _shouldPost,
  _lastUpdated,
  _isSelected,
}) => {
  return view == "month" && !isMobile ? (
    <div className="TileContent">
      <div
        onClick={() => GoToEntryDetail(id)}
        className="hasEventsContainer"
        data-for={`${id}`}
        data-tip={id}
      >
        <Star
          size={8}
          marginRight={2}
          color="PurpleWhite"
          animation={false}
          opacity={1}
        />
        <span className="eventDate mr-1">
          <Moment format="h:mma">{date_created_by_author}</Moment>
        </span>
        <span className="eventTitle Overflow">{title || "No title"}</span>
      </div>
    </div>
  ) : view == "month" ? (
    <Star
      bottom="8px"
      size={8}
      color="PurpleWhite"
      animation={false}
      opacity={1}
    />
  ) : null
}

EntryPreview.propTypes = {
  isMobile: PropTypes.bool,
  view: PropTypes.string,
  ...EntryPropType,
}

export default connect(mapStateToProps)(EntryPreview)
