import React, { useState, useRef, useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { BasicModal, BasicForm } from "components"
import { Button } from "reactstrap"
import { cleanObject, removeAttributeDuplicates } from "utils"
import {
  getTagStringFromObject,
  getTagObjectFromString,
} from "redux/Entries/utils"
import { UpdateReduxEntries, SyncEntries } from "redux/Entries/actions"
import { EntriesPropTypes } from "redux/Entries/propTypes"
import InputGroup from "reactstrap/lib/InputGroup"

const tagInputs = [
  {
    label: "Add",
    name: "tagsAdd",
    type: "checkbox",
    className: "mr-2",
  },
  {
    label: "Delete",
    name: "tagsDelete",
    type: "checkbox",
  },
]

const peopleInputs = [
  {
    label: "Add",
    name: "peopleAdd",
    type: "checkbox",
    className: "mr-2",
  },
  {
    label: "Delete",
    name: "peopleDelete",
    type: "checkbox",
  },
]

const mapStateToProps = (
  { Entries: { items, filteredItems, EntryTags, EntryPeople } },
  { entries }
) => ({
  entries: entries || items.concat(filteredItems),
  items,
  filteredItems,
  EntryTags,
  EntryPeople,
})

const mapDispatchToProps = { UpdateReduxEntries, SyncEntries }

const EditEntries = ({
  entries,
  items,
  filteredItems,
  EntryTags,
  EntryPeople,
  UpdateReduxEntries,
  SyncEntries,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const tagsAdd = useRef(false)
  const tagsDelete = useRef(false)
  const peopleAdd = useRef(false)
  const peopleDelete = useRef(false)

  const modalButton = useMemo(
    () => (
      <Button color="accent" onClick={() => setShowEditModal(true)}>
        <i className="fas fa-edit mr-1" />
        Edit
      </Button>
    ),
    []
  )

  const [entriesTagMap, entriesPeopleMap] = useMemo(
    () =>
      showEditModal && entries
        ? entries.reduce(
            (acc, entry) => {
              entry.tags.forEach(({ name }) => {
                acc[0][name] = acc[0][name] + 1 || 1
              })

              entry.people.forEach(({ name }) => {
                acc[1][name] = acc[1][name] + 1 || 1
              })

              return acc
            },
            [{}, {}]
          )
        : [{}, {}],
    [entries, showEditModal]
  )

  const handleTags = useCallback(({ target: { name, checked } }) => {
    switch (name) {
      case "tagsAdd":
        tagsAdd.current = checked
        break

      case "tagsDelete":
        tagsDelete.current = checked
        break

      case "peopleAdd":
        peopleAdd.current = checked
        break

      case "peopleDelete":
        peopleDelete.current = checked
        break

      default:
        return
    }
  }, [])

  const handleEditEntries = useCallback(
    (formPayload) => {
      console.log("formPayload: ", formPayload)
      let tagMap = {}
      let peopleMap = {}
      formPayload.tags = formPayload.tags?.reduce((acc, { value }) => {
        if (value) {
          tagMap[value] = true
          acc.push({ name: value })
        }
        return acc
      }, [])
      formPayload.people = formPayload.people?.reduce((acc, { value }) => {
        if (value) {
          peopleMap[value] = true
          acc.push({ name: value })
        }
        return acc
      }, [])

      let entryFieldsToUpdate = cleanObject(formPayload)

      const getUpdatedEntry = (e) => {
        if (tagsAdd.current) {
          entryFieldsToUpdate.tags = removeAttributeDuplicates(
            (entryFieldsToUpdate.tags || []).concat(e.tags),
            "name"
          )
        } else if (tagsDelete.current) {
          entryFieldsToUpdate.tags = e.tags.reduce((acc, t) => {
            if (!tagMap[t.name]) {
              acc.push(t)
            }
            return acc
          }, [])
        }

        if (peopleAdd.current) {
          entryFieldsToUpdate.people = removeAttributeDuplicates(
            (entryFieldsToUpdate.people || []).concat(e.people),
            "name"
          )
        } else if (peopleDelete.current) {
          entryFieldsToUpdate.people = e.people.reduce((acc, p) => {
            if (!peopleMap[p.name]) {
              acc.push(p)
            }
            return acc
          }, [])
        }

        return {
          ...e,
          ...entryFieldsToUpdate,
          _lastUpdated: new Date(),
          // _isSelected: false,
        }
      }

      const payload =
        entries.length === 1
          ? getUpdatedEntry(entries[0])
          : entries.reduce((acc, e) => {
              acc[e.id] = getUpdatedEntry(e)
              return acc
            }, {})

      entries.forEach((e) => {
        UpdateReduxEntries(payload)
      })

      setShowEditModal(false)

      SyncEntries()
    },
    [entries, tagsAdd.current, tagsDelete.current]
  )

  const handleCancel = useCallback(() => setShowEditModal(false), [])

  const [entryTagsOptions, entryPeopleOptions] = useMemo(() => {
    let tagOptions = [
      { name: "Document" },
      { name: "Dream" },
      { name: "Family" },
      { name: "Friends" },
      { name: "Quote" },
      { name: "Vacation" },
    ]
    let peopleOptions = []

    if (showEditModal) {
      const reduxEntries = items.concat(filteredItems)

      if (entries.length > 0 || EntryTags.length > 0) {
        tagOptions = removeAttributeDuplicates(
          Object.values(
            reduxEntries
              .map((entry) => entry.tags)
              .flat(1)
              .concat(EntryTags)
          ).map((t) =>
            entriesTagMap[t.name] === entries.length
              ? { ...t, selected: true }
              : t
          ),
          "name"
        )
      }

      if (entries.length > 0 || EntryPeople.length > 0) {
        peopleOptions = removeAttributeDuplicates(
          Object.values(
            reduxEntries
              .map((entry) => entry.people)
              .flat(1)
              .concat(EntryPeople)
          ).map((p) =>
            entriesPeopleMap[p.name] === entries.length
              ? { ...p, selected: true }
              : p
          ),
          "name"
        )
      }
    }

    return [tagOptions, peopleOptions]
  }, [showEditModal, items, filteredItems, entries, EntryTags, EntryPeople])

  const inputs = useMemo(
    () => [
      {
        label: "Should Delete",
        name: "_shouldDelete",
        type: "switch",
        placeholder: `Sould Delete..`,
      },
      {
        label: "Should Post",
        name: "_shouldPost",
        type: "switch",
        placeholder: `Should Post...`,
      },
      {
        label: "Is Public",
        name: "is_public",
        type: "switch",
        placeholder: `Is Public...`,
      },
      {
        label: (
          <div className="row m-0">
            <div className="mr-2">Tags</div>
            <BasicForm inline inputs={tagInputs} onChange={handleTags} />
          </div>
        ),
        name: "tags",
        type: "select",
        options: entryTagsOptions,
        multiple: true,
      },
      {
        label: (
          <div className="row m-0">
            <div className="mr-2">People</div>
            <BasicForm inline inputs={peopleInputs} onChange={handleTags} />
          </div>
        ),
        name: "people",
        type: "select",
        options: entryPeopleOptions,
        multiple: true,
      },
      {
        label: "Title",
        name: "title",
        type: "text",
        placeholder: `Tile...`,
      },
      {
        label: "HTML",
        name: "html",
        type: "textarea",
        placeholder: `Html...`,
      },
      {
        label: "Date Created",
        name: "date_created_by_author",
        type: "datetime-local",
        placeholder: `Date Created...`,
      },
      {
        label: "Views",
        name: "views",
        type: "number",
        placeholder: "100",
        min: 0,
      },
      {
        label: "Rating",
        name: "rating",
        type: "number",
        placeholder: "0",
        // defaultValue: 0,
        min: 0,
        max: 5,
      },
      {
        label: "Address",
        name: "address",
        type: "text",
        placeholder: `Address...`,
      },
      {
        label: "Latitude",
        name: "latitude",
        type: "text",
        placeholder: `Latitude...`,
      },
      {
        label: "Longitude",
        name: "longitude",
        type: "text",
        placeholder: `Longitude...`,
      },
    ],
    [entryPeopleOptions, entryTagsOptions]
  )

  return (
    <BasicModal
      show={showEditModal}
      disabled={entries.length === 0}
      title={`Edit ${
        entries.length === 1 ? "entry" : `these ${entries.length} entries`
      }`}
      button={modalButton}
      footer={null}
    >
      <BasicForm
        onSubmit={handleEditEntries}
        onCancel={handleCancel}
        inputs={inputs}
      />
    </BasicModal>
  )
}

EditEntries.propTypes = {
  entries: EntriesPropTypes,
}

EditEntries.defaultProps = {
  entries: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEntries)
