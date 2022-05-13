import React, { SetStateAction } from 'react';

interface MarkerProps extends google.maps.MarkerOptions{
    setLat: React.Dispatch<SetStateAction<number>>
    setLng: React.Dispatch<SetStateAction<number>>
    setAddress: React.Dispatch<SetStateAction<string>>
}

const GoogleMarker: React.FC<MarkerProps> = ({
    setLat,
    setLng,
    setAddress,
    ...options
}) => {
    const [ marker, setMarker ] = React.useState<google.maps.Marker>();
    const [ dragging, setDragging ] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        };
  
        return () => {
            if (marker) {
                marker.setMap(null);
            };
        };
    }, [marker]);
    
    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options);
            marker.addListener('drag', () => setDragging(true));
            marker.addListener('dragend', () => {
                if(!dragging){
                    const lat = marker.getPosition()?.lat();
                    const lng = marker.getPosition()?.lng();
                    if(lat && lng){
                        setLat(lat);
                        setLng(lng);
                    };
                };
                setDragging(false);
            })
        };
    }, [marker, options]);
  
    return null;
};
export default GoogleMarker;