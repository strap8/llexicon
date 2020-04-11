import React, { Fragment, useState, useCallback, memo } from "react"
import PropTypes, { shape } from "prop-types"
import { Table } from "reactstrap"
import TableHeader from "./TableHeader"
import TableBody from "./TableBody"
import TableFooter from "./TableFooter"
import TablePaginator from "./TablePaginator"
import { tableSort, tableFilter } from "./utils"
import { ColumnsPropType, DataPropType } from "./propTypes"
import { stringMatch } from "../../helpers"
import "./styles.css"

const getInitialState = (columns, { pageSize, pageSizes }) => {
  let sortList = []
  let filterList = []
  let firstRowClickFound = null

  for (let i = 0, { length } = columns; i < length; i++) {
    const {
      key,
      sort,
      filter,
      defaultSortValue,
      defaultFilterValue,
      onRowClick,
    } = columns[i]

    if (!firstRowClickFound && onRowClick) firstRowClickFound = onRowClick

    const sortItem = { key, sortUp: defaultSortValue, sort }
    sortList.push(sortItem)

    const filterItem = { key, filterValue: defaultFilterValue || "", filter }
    filterList.push(filterItem)
  }

  return {
    sortList,
    filterList,
    onRowClick: firstRowClickFound && firstRowClickFound.onRowClick,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: "Page Sizes" }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value }))
    ),
  }
}

const BasicTable = ({
  data,
  bordered,
  borderless,
  striped,
  dark,
  responsive,
  sortable,
  columns,
  onSortCallback,
  onFilterCallback,
  ...propsUsedToDeriveState
}) => {
  const [
    { onRowClick, currentPage, pageSize, pageSizes, sortList, filterList },
    setState,
  ] = useState(getInitialState(columns, propsUsedToDeriveState))

  // console.log("sortList: ", sortList)
  // console.log("filterList: ", filterList)

  const handleSort = useCallback((sortKey, sortUp) => {
    onSortCallback && onSortCallback(sortKey, sortUp)

    setState((prevState) => {
      let tempItem
      const newSortList = prevState.sortList
        .filter((item) => {
          if (item.key == sortKey) {
            tempItem = { ...item, sortUp }
            return false
          } else return true
        })
        .concat(tempItem)
      return {
        ...prevState,
        sortList: newSortList,
      }
    })
  }, [])

  const handleFilter = useCallback((filterKey, filterValue) => {
    onFilterCallback && onFilterCallback(filterKey, filterValue)

    setState((prevState) => {
      let tempItem
      const newFilterList = prevState.filterList
        .filter((item) => {
          if (item.key == filterKey) {
            tempItem = { ...item, filterValue }
            return false
          } else return true
        })
        .concat(tempItem)
      return {
        ...prevState,
        filterList: newFilterList,
      }
    })
  }, [])

  const handlePageChange = (currentPage) => {
    setState((prevState) => ({ ...prevState, currentPage }))
  }

  const handlePageSizeChange = (id, pageSize) => {
    setState((prevState) => ({ ...prevState, pageSize, currentPage: 0 }))
  }

  const sortedData = tableSort([...data], sortList)

  const sortedAndFilteredData = tableFilter(sortedData, filterList)

  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = (sortedAndFilteredData || data).slice(sliceStart, sliceEnd)

  const dataLength = (sortedAndFilteredData || data).length

  const totalPages = Math.ceil(dataLength / pageSize)

  return (
    <Fragment>
      <Table
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        dark={dark}
        hover={onRowClick ? true : false}
        responsive={responsive}
        className="BasicTable m-0"
      >
        <TableHeader
          sortable={sortable}
          sortCallback={handleSort}
          filterCallback={handleFilter}
          columns={columns}
          sortList={sortList}
        />
        <TableBody
          columns={columns}
          data={slicedData}
          onRowClick={onRowClick}
        />
        <TableFooter
          onRowClick={onRowClick}
          columns={columns}
          sortedAndFilteredData={sortedAndFilteredData}
        />
      </Table>
      <TablePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizes={pageSizes}
        dataLength={dataLength}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Fragment>
  )
}

BasicTable.propTypes = {
  sortable: PropTypes.bool.isRequired,
  columns: ColumnsPropType,
  data: DataPropType,
  onSortCallback: PropTypes.func,
  onFilterCallback: PropTypes.func,
  // reactstrap Table
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.string,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  striped: PropTypes.bool,
  dark: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  // Custom ref handler that will be assigned to the "ref" of the inner <table> element
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),
}

BasicTable.defaultProps = {
  sortable: false,
  bordered: false,
  borderless: true,
  striped: false,
  dark: true,
  responsive: true,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20, 25, 50, 100],
  sortList: [],
  sortList: [],
  columns: [
    {
      title: "#",
      key: "id",
      width: 25,
    },
    {
      title: "First Name",
      key: "first_name",
      width: 100,
      filter: "string",
    },
    {
      title: "Last Name",
      key: "last_name",
      width: 200,
      filter: "string",
    },
    {
      title: "Username",
      key: "user_name",
      render: (item) => <a href="#">{`Delete ${item.user_name}`}</a>,
      sort: (a, b, sortUp) =>
        sortUp
          ? b.user_name.localeCompare(a.user_name)
          : a.user_name.localeCompare(b.user_name),
      filter: (filterValue) => (item) =>
        stringMatch(item.user_name, filterValue),
    },
  ],
  data: new Array(25).fill().map(
    (e, i) =>
      (e = {
        id: i,
        first_name: `first_name${i}`,
        last_name: `last_name${i}`,
        user_name: `user_name${i}`,
      })
  ),
}
export default memo(BasicTable)
