import React, { useEffect, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import fitCoordsToBounds from '../../functions/fitCoordsToBounds'
import { NEW_ENTRY_ID } from 'redux/Entries/utils'
import './styles.css'

const MapSearchBox = ({ map, mapApi, onChange, panTo, $geoService, $onMouseAllow, $prerender }) => {
  let searchBoxRef = useRef()
  let searchInputRef = useRef()

  useEffect(() => {
    searchInputRef.current.focus()
  }, [searchInputRef])

  const handlePlacesChange = () => {
    const selected = searchBoxRef.current.getPlaces()
    const { 0: place } = selected
    if (!place || !place.geometry) return
    const {
      address_components,
      adr_address,
      formatted_address,
      geometry,
      html_attributions,
      icon,
      id,
      name,
      place_id,
      plus_code,
      reference,
      scope,
      types,
      url,
      utc_offset_minutes,
      vicinity,
    } = place

    const { location, viewport } = geometry
    const { lat, lng } = location

    const bounds = new mapApi.LatLngBounds()

    if (viewport) {
      bounds.union(viewport)
    } else {
      bounds.extend(location)
    }

    map.fitBounds(bounds)

    const newPosition = { lat: lat(), lng: lng() }

    onChange({
      entryId: NEW_ENTRY_ID,
      latitude: newPosition.lat,
      longitude: newPosition.lng,
      address: formatted_address,
    })

    panTo({ center: newPosition })

    //setMapCenterBoundsZoom({ center, zoom })

    // let coords = locations.reduce((result, location) => {
    //   const { latitude, longitude } = location
    //   if (latitude && longitude) {
    //     location = {
    //       lat: parseFloat(latitude.toString()),
    //       lng: parseFloat(longitude.toString())
    //     }
    //     return result.concat(location)
    //   } else {
    //     return result
    //   }
    // }, [])

    // if (newPosition.lat && newPosition.lng) {
    //   coords.push(newPosition)
    // }

    // if (userLocation.lat && userLocation.lng) {
    //   coords.push(userLocation)
    // }

    // fitCoordsToBounds(map, mapApi, coords)
    searchInputRef.current.blur()
  }

  const clearSearchBox = () => {
    searchInputRef.current.value = ''
  }

  const selectSearchBox = ({ target }) => target.select()

  useEffect(() => {
    if (mapApi) {
      searchBoxRef.current = new mapApi.places.SearchBox(searchInputRef.current)
      searchBoxRef.current.addListener('places_changed', handlePlacesChange)
      searchBoxRef.current.bindTo('bounds', map)
      return () => {
        mapApi.event.clearInstanceListeners(searchInputRef.current)
      }
    }
  }, [handlePlacesChange, map, mapApi])

  return (
    <div className='mapBoxSearchBoxContainer'>
      <input
        ref={searchInputRef}
        className='mapBoxSearchBoxInput'
        type='text'
        autoComplete='on'
        onFocus={selectSearchBox}
        // onBlur={(e) => e.preventDefault()}
        placeholder='Enter a location'
        // onChange={handleInputChange}
      />
    </div>
  )
}

MapSearchBox.propTypes = {
  map: PropTypes.object.isRequired,
  mapApi: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  panTo: PropTypes.func.isRequired,
  $geoService: PropTypes.object,
  $onMouseAllow: PropTypes.func,
  $prerender: PropTypes.bool,
}

export default memo(MapSearchBox)
