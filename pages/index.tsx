import React from "react";
import GoogleAutocomplete from "../components/GoogleMaps/GoogleAutocomplete";
import GoogleMap from "../components/GoogleMaps/GoogleMap";
import GoogleMarker from "../components/GoogleMaps/GoogleMarker";

const HomePage = () => {
    const [ mounted, setMounted ] = React.useState(false);
    const [ lat, setLat ] = React.useState(44.4268414);
    const [ lng, setLng ] = React.useState(26.1030725);
    const [ zoom, setZoom ] = React.useState(12);

    // Reverse geocode marker position
    const geocoder = new google.maps.Geocoder;
    const [ country, setCountry ] = React.useState< string >();
    const [ county, setCounty ] = React.useState< string >();
    const [ city, setCity ] = React.useState< string >();
    const [ sector, setSector ] = React.useState< string >();
    const [ neighborhood, setNeighborhood ] = React.useState< string >();
    const [ address, setAddress ] = React.useState< string >('');

    React.useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const position = pos.coords;
                    if(position){
                        setLat(position.latitude);
                        setLng(position.longitude);
                    }
                }
            );
        };
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if(!mounted) return;
        setCountry('');
        setCounty('');
        setCity('');
        setSector('');
        setNeighborhood('');
        setAddress('');
        geocoder
            .geocode({ location: {lat, lng}})
            .then(res => {
                if(res.results[0]){
                    res.results[0].address_components.reverse().filter((object) => {
                        object.types.filter((type) => {
                            if(type === 'country') setCountry(object.long_name);
                            if(type === 'administrative_area_level_1') {
                                if(object.long_name === 'București'){
                                    setCounty('Ilfov');
                                }else{
                                    setCounty(object.long_name);
                                };
                            };
                            if(type === 'locality') setCity(object.long_name);
                            if(type === 'sublocality_level_1') setSector(object.long_name);
                            if(type === 'route') setAddress(s=>s+object.long_name);
                            if(type === 'street_number') setAddress(s=>s+' '+object.long_name);
                        });
                    })
                }
                res.results.map(object => {
                    object.types.filter(type => {
                        if(type === 'neighborhood') setNeighborhood(object.formatted_address.split(',')[0]);
                    });
                });
            });
    }, [lat]);

    console.log(`
        Country: ${country}\n
        County: ${county}\n
        City: ${city}\n
        Sector: ${sector}\n
        Neighborhood: ${neighborhood}\n
        Address: ${address}
    `);

    return(
        <div>
            <GoogleAutocomplete
                setLat={setLat}
                setLng={setLng}
                setAddress={setAddress}
            />
            <input
                disabled
                value={address}
                style={{
                    margin: '20px 0 20px 0',
                    width: '100%'
                }}
            />
            <GoogleMap 
                center={{lat, lng}}
                zoom={zoom}
                setZoom={setZoom}
                style={{width: '100%', height: '500px'}}
                disableDefaultUI
                clickableIcons={false}
                mapId="9c7cb3e171b411ff"
            >
                <GoogleMarker
                    position={{lat, lng}}
                    draggable
                    setLat={setLat}
                    setLng={setLng}
                    setAddress={setAddress}
                />
            </GoogleMap>
            <section style={{
                margin: '20px 0 20px 0'
            }}>
                <h1>Display reverse geocoding data</h1>
                <ul>
                    <li>Country: {country}</li>
                    <li>County: {county}</li>
                    <li>City: {city}</li>
                    <li>Area: {sector}</li>
                    <li>Neighborhood: {neighborhood}</li>
                    <li>Address: {address}</li>
                </ul>
            </section>
        </div>
    );
};
export default HomePage;