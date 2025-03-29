import React from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'

// Typy pro props komponenty
interface GoogleMapComponentProps {
  center: { lat: number; lng: number }
  zoom?: number
  markerTitle?: string
  height?: string | number
  apiKey: string
  markerColor?: string
  showInfoWindow?: boolean
  scrollWheel?: boolean
}

// Google Maps komponenta
export function GoogleMapComponent({
  center,
  zoom = 15,
  markerTitle = 'Moje pozice',
  height = 400,
  apiKey,
  markerColor = '#E94B64',
  showInfoWindow = true,
  scrollWheel = false,
}: GoogleMapComponentProps) {
  const [openInfoWindow, setOpenInfoWindow] = React.useState(showInfoWindow)

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ width: '100%', height }}>
        <Map
          scrollwheel={scrollWheel}
          defaultCenter={center}
          defaultZoom={zoom}
          mapId='marker-example' // Volitelné, pokud máte vlastní mapový styl
        >
          <AdvancedMarker position={center} onClick={() => setOpenInfoWindow(!openInfoWindow)}>
            <Pin background={markerColor} glyphColor={'#FFFFFF'} borderColor={'#FFFFFF'} />
            {openInfoWindow && (
              <InfoWindow onCloseClick={() => setOpenInfoWindow(false)}>
                <div className='p-1'>
                  <h3 className='font-medium text-gray-900'>{markerTitle}</h3>
                  <p className='text-xs text-gray-600'>
                    {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  )
}
