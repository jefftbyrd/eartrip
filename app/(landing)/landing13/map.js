'use client';
import 'mapbox-gl/dist/mapbox-gl.css';
// import Freesound from './Freesound';
import mapboxgl from 'mapbox-gl';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Freesound from './Freesound';
import styles from './landing.module.scss';

const initialCenter = [4.510020088079064, 44.66199079784276];
const initialZoom = 2.14;

export default function Map(props) {
  // const [isActive, setIsActive] = useState(false);
  // const [isMounted, setIsMounted] = useState(false);
  const [enterPortal, setEnterPortal] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('');

  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [pin, setPin] = useState({});
  const [fetch, setFetch] = useState(false);

  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  function handleDataFromChild(data) {
    // console.log('data at handleDataFromChild on map', data);
    setDataFromChild(data);
    props.sendDataToParent(data);
    // console.log('dataFromChild at handleDataFromChild on map', dataFromChild);
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GENERIC_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/jefftbyrd/cm38mcin600jv01nw6mrq473m',
      center: center,
      zoom: zoom,
    });

    let lng;
    let lat;

    const marker = new mapboxgl.Marker({
      color: '#314ccd',
    });

    mapRef.current.on('click', (event) => {
      lng = event.lngLat.lng;
      lat = event.lngLat.lat;
      const coords = { lng: lng, lat: lat };
      marker.setLngLat(coords).addTo(mapRef.current);
      setPin(coords);
      // console.log('coords', coords);
      // console.log('pin', pin);
      setFetch((prevState) => !prevState);
    });

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  // portal.props

  return (
    <>
      {pin.lat ? null : (
        <motion.div
          className={styles.instruction}
          animate={{
            opacity: [0, 0, 1, 1],
            transition: { duration: 10, times: [0, 0.8, 0.9, 1] },
          }}
        >
          <motion.div
            animate={{
              color: ['rgb(255, 0, 89)', 'rgb(255, 230, 0)', 'rgb(255, 0, 89)'],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <h2>Choose a place to explore.</h2>
          </motion.div>
        </motion.div>
      )}

      {/* IF THERE ARE ENOUGH SOUNDS */}
      {pin.lat &&
      !enterPortal &&
      dataFromChild &&
      dataFromChild.results.length > 0 ? (
        // Announce the chosen location
        <div className={styles.projection}>
          <motion.h2
            animate={{
              opacity: [0, 1],
              transition: { duration: 3, times: [0, 1] },
            }}
          >
            You chose {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </motion.h2>

          {/* Click to initiate sonic projection */}
          <motion.div
            animate={{
              opacity: [0, 0, 1],
              transition: { duration: 3, times: [0, 0.5, 1] },
            }}
          >
            <motion.button
              className={styles.projectionStart}
              onClick={() => {
                props.openPortal();
                // props.sendDataToParent(data);
              }}
              animate={{
                color: [
                  'rgb(255, 0, 89)',
                  'rgb(255, 230, 0)',
                  'rgb(255, 0, 89)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Initiate sonic projection. Take me there.
            </motion.button>
          </motion.div>
        </div>
      ) : null}

      {/* NOT ENOUGH SOUNDS */}
      {pin.lat &&
      !enterPortal &&
      dataFromChild &&
      dataFromChild.results.length < 1 ? (
        // Announce the chosen location
        <div className={styles.projection}>
          <motion.h2
            animate={{
              opacity: [0, 1],
              transition: { duration: 3, times: [0, 1] },
            }}
          >
            You chose {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </motion.h2>

          {/* Click to initiate sonic projection */}
          <motion.div
            animate={{
              opacity: [0, 0, 1],
              transition: { duration: 3, times: [0, 0.5, 1] },
            }}
          >
            <motion.button
              className={styles.projectionStart}
              animate={{
                color: [
                  'rgb(255, 0, 89)',
                  'rgb(255, 230, 0)',
                  'rgb(255, 0, 89)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              No sounds found. Please choose another location.
            </motion.button>
          </motion.div>
        </div>
      ) : null}

      <div id="map-container" ref={mapContainerRef} />
      {pin.lat ? (
        <Freesound
          pin={pin}
          // fetch={fetch}
          sendDataToParent={handleDataFromChild}
        />
      ) : null}
    </>
  );
}
