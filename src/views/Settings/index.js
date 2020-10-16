import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { UserProps } from "redux/User/propTypes"
import { Container, Row, Col } from "reactstrap"
import { BasicTabs, Header, PushNotifications } from "../../components"
import EntryStatistics from "./EntryStatistics"
import ImportExportEntries from "./ImportExportEntries"
import AccountDetails from "./AccountDetails"
import UpdateProfile from "./UpdateProfile"
import Storage from "./Storage"
import Preferences from "./Preferences"
import { RouterPush, RouteMap } from "redux/router/actions"
import "./styles.css"

const {
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SETTINGS_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE,
} = RouteMap

const Settings = ({}) => {
  const { pathname } = useLocation()
  if (pathname === SETTINGS) RouterPush(SETTINGS_ENTRIES)
  const activeTab = pathname

  const handleTabChange = (tabId) => RouterPush(tabId)

  const tabs = [
    {
      tabId: SETTINGS_ENTRIES,
      title: "Entries",

      className: "mt-2",
      render: (
        <Fragment>
          <ImportExportEntries />
          <EntryStatistics />
        </Fragment>
      ),
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PROFILE,
      title: "Profile",
      className: "mt-2",
      render: (
        <Fragment>
          <AccountDetails />
          <UpdateProfile />
        </Fragment>
      ),
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PREFERENCES,
      title: "Preferences",
      className: "mt-2",
      render: <Preferences />,
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PUSH_NOTIFICATIONS,
      title: "Push Notifications",
      className: "mt-2",
      render: <PushNotifications />,
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_STORAGE,
      title: "Storage",
      className: "mt-2",
      render: <Storage />,
      onClick: handleTabChange,
    },
  ]
  return (
    <Container className="Settings Container">
      <Row>
        <Col xs={12} className="Center mt-3">
          <Header>
            <i className="fa fa-cog mr-2" />
            SETTINGS
          </Header>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
          <BasicTabs activeTab={activeTab} tabs={tabs} />
        </Col>
      </Row>
    </Container>
  )
}

Settings.propTypes = {
  User: UserProps,
}

export default memo(Settings)
