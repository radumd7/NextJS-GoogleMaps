import React, { SetStateAction } from "react";

interface AutocompleteProps {
    setLat: React.Dispatch<SetStateAction<number>>
    setLng: React.Dispatch<SetStateAction<number>>
    setAddress: React.Dispatch<SetStateAction<string>>
}

const GoogleAutocomplete: React.FC< AutocompleteProps > = ({ setLat, setLng, setAddress }) => {
    const [ autocomplete, setAutocomplete ] = React.useState<google.maps.places.Autocomplete>();
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if(ref.current){
            setAutocomplete( new google.maps.places.Autocomplete( ref.current ) );
            
        }
    }, [ ref ]);

    React.useEffect(() => {
        if(autocomplete){
            autocomplete?.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();
                if(lat && lng){
                    setLat(lat);
                    setLng(lng);
                    if(place.formatted_address){
                        setAddress(place.formatted_address);
                    }
                }
            });
        }
    }, [autocomplete])

    return <input ref={ref} style={{width: '100%', margin: '20px 0 20px 0'}}/>
};
export default GoogleAutocomplete;