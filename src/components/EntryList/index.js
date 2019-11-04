import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem } from "reactstrap"
import Moment from "react-moment"
import MomentJS from "moment"
import { removeAttributeDuplicates } from "../../helpers"
import "./styles.css"
import "./stylesM.css"

const mapStateToProps = ({ Entries: { items, itemsByDate } }) => ({
  entries: removeAttributeDuplicates(items.concat(itemsByDate), "id")
})

const mapDispatchToProps = {}

class EntryList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      activeDate: Date,
      entries: []
    }
  }

  static propTypes = {
    activeDate: PropTypes.string,
    entries: PropTypes.array
  }

  static defaultProps = {
    activeDate: Date,
    entries: []
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {}

  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { activeDate, entries } = props
    this.setState({
      activeDate,
      entries
    })
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  renderItems = (date, entries, history) =>
    entries.map((e, i) => {
      const {
        id,
        author,
        tags,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views
      } = e
      const activeDate = MomentJS(date)
      const startDate = MomentJS(date_created_by_author)
      const sameDayEvent = startDate.isSame(activeDate, "day")
      return (
        <div key={i} style={{ borderRadius: 0 }}>
          {sameDayEvent ? (
            <ListGroupItem
              key={id}
              onClick={() => history.push(`/calendar/event/${id}`)}
              className="Clickable listItem"
              header={title}
            >
              <span
                className="EventColorLabelContainer"
                style={{ backgroundColor: "var(--primaryColor)" }}
              />
              <Moment format="hh:mm a">{date_created_by_author}</Moment>
            </ListGroupItem>
          ) : null}
        </div>
      )
    })

  render() {
    const { history } = this.props
    const { entries, activeDate } = this.state
    return [
      <div className="ListHeader Center">Entries</div>,
      <ListGroup className="List">
        {this.renderItems(activeDate, entries, history)}
      </ListGroup>
    ]
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryList)
