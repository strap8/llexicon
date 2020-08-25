import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap"
import { connect } from "store/provider"
import ToolbarModal from "../../ToolbarModal"
import { TagsContainer, DebounceInput } from "../../../../"
import { GetUserEntryPeople } from "../../../../../redux/Entries/actions"
import {
  TopKFrequentStrings,
  removeAttributeDuplicates,
  stringMatch,
} from "../../../../../utils"
import memoizeProps from "../../../../../utils/memoizeProps"
import { validateTagOrPeopleString, validatedPersonNameString } from "../utlis"
import {
  EntriesPropTypes,
  EntryPeopleProps,
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryPeople },
}) => ({ items, filteredItems, UserId: id, EntryPeople })

const mapDispatchToProps = {
  GetUserEntryPeople,
}

const getInitialState = ({ people }) => ({
  personsName: "",
  people,
})

const PeopleButtonModal = ({
  UserId,
  GetUserEntryPeople,
  items,
  filteredItems,
  EntryPeople,
  entryId,
  html,
  title,
  xs,
  onChangeCallback,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [show, setShow] = useState(false)
  const handleToogle = useCallback(() => setShow((prevShow) => !prevShow))

  const [{ people, personsName }, setState] = useState(
    getInitialState(restOfProps)
  )

  const resetState = () => setState(getInitialState(restOfProps))

  useEffect(() => {
    setState((prevState) => ({ ...prevState, people: restOfProps.people }))
  }, [restOfProps.people])

  const splitPeopleAsString = personsName.split(",")
  const lastPeopleAsString = splitPeopleAsString[splitPeopleAsString.length - 1]

  const entryPeople = useMemo(
    () =>
      show
        ? Object.values(
            items
              .concat(filteredItems)
              .map((entry) => entry.people)
              .flat(1)
              .concat(EntryPeople)
          )
        : [],
    [
      show,
      items,
      filteredItems,
      EntryPeople,
      personsName,
      people,
      splitPeopleAsString,
    ]
  )

  const [suggestedPeople, frequentPeople] = useMemo(() => {
    if (!show) return [[], []]
    else {
      const h = html.toLowerCase()
      const t = title.toLowerCase()
      const f = TopKFrequentStrings(entryPeople, "name")
        .filter((entryPersonName) => {
          if (people.some(({ name }) => name == entryPersonName)) return false
          else if (!lastPeopleAsString) return true
          else if (stringMatch(entryPersonName, lastPeopleAsString)) return true
          else return false
        })
        .map((name) => ({ name }))

      let suggestedPeople = []
      let frequentPeople = []

      for (let i = 0, { length } = f; i < length; i++) {
        const person = f[i]
        const names = person.name.split(" ")

        if (
          names.some((name) => {
            const n = name.toLowerCase()
            return (n && h.includes(n)) || (t && t.includes(n))
          })
        ) {
          suggestedPeople.push(person)
        } else {
          frequentPeople.push(person)
        }
      }

      return [suggestedPeople, frequentPeople]
    }
  }, [show, html, title, entryPeople])

  const handlePeopleInputChange = (value) => {
    const validatedTagsAsString = validatedPersonNameString(value)

    setState((prevState) => ({
      ...prevState,
      personsName: validatedTagsAsString,
    }))
  }

  const handleSavePeople = () => {
    const payload = {
      id: entryId,
      people,
    }

    onChangeCallback(payload)
    resetState()
  }

  const handleAddPerson = (clickedName) => {
    setState((prevState) => {
      const newPeople = prevState.people.concat({ name: clickedName })
      const removeLastPerson = prevState.personsName.split(",").slice(0, -1)

      const newPersonsName = removeLastPerson
        // .concat(`${clickedName},`)
        .join(",")
      return {
        ...prevState,
        people: newPeople,
        personsName: newPersonsName,
      }
    })
  }

  const handleRemovePerson = (clickedName) => {
    setState((prevState) => {
      const filteredPeople = prevState.people.filter(
        ({ name }) => name != clickedName
      )
      return { ...prevState, people: filteredPeople }
    })
  }

  const handleCreatePeople = () => {
    setState((prevState) => {
      const peopleFromString = validateTagOrPeopleString(splitPeopleAsString)
      const newPeople = removeAttributeDuplicates(
        prevState.people.concat(peopleFromString),
        "name"
      )

      return {
        ...getInitialState(prevState),
        people: newPeople,
      }
    })
  }

  const placeholder = useMemo(() => {
    const people = suggestedPeople.concat(frequentPeople)
    if (!show || people.length === 0) {
      return "John Doe,Jane Doe"
    }

    return people
      .slice(0, 2)
      .map(({ name }) => name)
      .join(",")
  }, [suggestedPeople, frequentPeople])

  return (
    <ToolbarModal
      show={show}
      toggle={handleToogle}
      title="Add People"
      onSaveCallback={handleSavePeople}
      onCancelCallback={resetState}
      ButtonIcon="fas fa-users"
      button="Add People"
      xs={xs}
    >
      {show && (
        <Container className="PeopleButtonModal Container">
          {suggestedPeople.length > 0 && (
            <Row className="TagAndPeopleContainer">
              <h4>Suggested</h4>
              <TagsContainer
                tags={suggestedPeople}
                maxHeight={150}
                flexWrap="wrap"
                onClickCallback={handleAddPerson}
                hoverable
                emptyString="No people found..."
                faIcon="fas fa-user-plus"
              />
            </Row>
          )}
          <Row className="TagAndPeopleContainer mt-2 mb-1">
            <h4>Frequent</h4>
            <TagsContainer
              tags={frequentPeople}
              maxHeight={150}
              flexWrap="wrap"
              onClickCallback={handleAddPerson}
              hoverable
              emptyString="No people found..."
              faIcon="fas fa-user-plus"
            />
          </Row>
          <Row className="TagAndPeopleContainer mt-2 mb-1">
            <h4>Attached</h4>
            <TagsContainer
              tags={people}
              maxHeight={150}
              flexWrap="wrap"
              onClickCallback={handleRemovePerson}
              hoverable
              emptyString="No people added..."
              faIcon="fas fa-user-times"
            />
          </Row>
          <Row>
            <Col className="EntryInput p-1" xs={12} tag={InputGroup}>
              <InputGroupAddon addonType="append">
                <InputGroupText
                  tag={Button}
                  className="SaveButton"
                  color="primary"
                  disabled={!personsName}
                  onClick={handleCreatePeople}
                >
                  <i
                    className="fas fa-user-plus"
                    style={{ fontSize: 20, color: "var(--accentColor)" }}
                  />
                </InputGroupText>
              </InputGroupAddon>
              <DebounceInput
                type="text"
                value={personsName}
                onChange={handlePeopleInputChange}
                placeholder={placeholder}
                focusOnMount
              />
            </Col>
          </Row>
        </Container>
      )}
    </ToolbarModal>
  )
}

PeopleButtonModal.propTypes = {
  UserId: PropTypes.number,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
  EntryPeople: EntryPeopleProps.isRequired,
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  people: EntryPeopleProps.isRequired,
  GetUserEntryPeople: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

PeopleButtonModal.defaultProps = {
  people: [],
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "UserId",
    "items",
    "filteredItems",
    "EntryPeople",
    "entryId",
    "people",
    "xs",
    "html",
    "title",
  ])

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(PeopleButtonModal, isEqual))
