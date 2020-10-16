import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "redux/Entries/propTypes"
import { Container, Row, Col, ButtonGroup, Button } from "reactstrap"
import { ImportEntries } from "components"
import { connect as reduxConnect } from "react-redux"
import { copyStringToClipboard, loadJSON, exportJSON } from "utils"
import {
  SyncEntries,
  GetAllUserEntries,
  GetAllUserEntryPages,
} from "redux/Entries/actions"
import MomentJs from "moment"

const DATE_FORMAT = "YYYY-MM-DD hh:mm:ss"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems },
}) => ({
  userId: id,
  items,
  filteredItems,
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntryPages }

const ImportExportEntries = ({
  userId,
  items,
  filteredItems,
  SyncEntries,
  GetAllUserEntryPages,
}) => {
  const entries = items.concat(filteredItems)
  const totalEntries = entries.length

  const GetAllEntries = useCallback(
    () =>
      SyncEntries(
        () => new Promise((resolve) => resolve(GetAllUserEntryPages()))
      ),
    []
  )

  const handleExportEntries = () => {
    const formattedEntries = entries.map((entry, i) => {
      const {
        tags,
        people,
        date_created,
        date_created_by_author,
        date_updated,
        ...restOfProps
      } = entry

      let entries = {
        ...restOfProps,
        tags: tags.reduce(
          (tagString, tag) => (tagString += `${tag.name},`),
          ""
        ),
        people: people.reduce(
          (peopleString, person) => (peopleString += `${person.name},`),
          ""
        ),
        date_created: MomentJs(date_created).format(DATE_FORMAT),
        date_created_by_author: MomentJs(date_created_by_author).format(
          DATE_FORMAT
        ),
        date_updated: MomentJs(date_updated).format(DATE_FORMAT),
      }

      if (userId) {
        entries["author"] = userId
      }

      return entries
    })

    exportJSON(
      formattedEntries,
      `Astral-Tree-Entries-${MomentJs(new Date()).format(DATE_FORMAT)}`
    )
  }

  return (
    <Container fluid>
      <Row className="py-2">
        <Col xs={12} tag={ButtonGroup} className="p-0">
          <Button color="accent" onClick={GetAllEntries} disabled={!userId}>
            <i className="fas fa-cloud-download-alt" /> Download and Sync All
            Entries
          </Button>
          <ImportEntries />
          <Button
            color="accent"
            onClick={handleExportEntries}
            disabled={totalEntries === 0}
          >
            <i className="fas fa-file-export" /> Export Entries
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

ImportExportEntries.propTypes = {
  userId: PropTypes.number.isRequired,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

ImportExportEntries.defaultProps = { userId: null }

export default connect(mapStateToProps, mapDispatchToProps)(ImportExportEntries)
