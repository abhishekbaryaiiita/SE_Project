
<Globe
  ref={globeRef}
  width={dimensions.width}
  height={dimensions.height}
  backgroundColor="rgba(0,0,0,0)"

  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

  showAtmosphere
  atmosphereColor="#4b9fff"
  atmosphereAltitude={0.16}

  pointsData={destinations}
  pointLat="lat"
  pointLng="lng"
  pointColor={() => '#ff6257'}
  pointRadius={0.38}
  pointAltitude={0.025}
  pointLabel="city"
  onPointClick={focusDestination}

  onGlobeReady={() => {
    const controls = globeRef.current?.controls();

    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 400;
    }

    globeRef.current?.pointOfView(
      { lat: 22, lng: 78, altitude: 2.3 },
      1200
    );
  }}
/>
