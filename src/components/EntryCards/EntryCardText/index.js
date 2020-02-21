import React, { memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import { RatingIcon, TagsContainer } from "../../"
import Moment from "react-moment"
import "./styles.css"

const EntryCardText = ({ tags, date_updated, views, rating }) => {
  return (
    <Container className="EntryCardText Container">
      <Row>
        <Col xs={12} className="EntryCardTextTags p-0">
          <TagsContainer tags={tags} />
        </Col>
      </Row>
      <Row>
        <Col xs={4} className="EntryCardTextLeftColumn p-0">
          <i className="far fa-eye" /> <span className="mr-2">{views}</span>
        </Col>
        <Col xs={8} className="EntryCardTextRightColumn p-0">
          <RatingIcon rating={rating} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="EntryCardTextLeftColumn p-0">
          <i className="fas fa-pencil-alt mr-1" />
          <Moment fromNow>{date_updated}</Moment>
        </Col>
      </Row>
    </Container>
  )
}

EntryCardText.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  date_updated: PropTypes.string,
  views: PropTypes.number,
  rating: PropTypes.number
}

EntryCardText.defaultProps = {}

export default memo(EntryCardText)