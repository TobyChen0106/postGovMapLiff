import L from 'leaflet';
import './marker.css';


const myCustomColour = '#56b2f0'
const myDotColour = '#ffffff'

const markerHtmlStyles =
  `
  background-color: ${myCustomColour};
  width: 24px;
  height: 24px;
  display: block;
  left: -30px;
  top: -30px;
  position: relative;
  border-radius: 50%;

  border: 4px solid #FFFFFF;
  box-shadow: 0 0 0.5rem 0.8rem rgba(86, 178, 240, 0.5);
  `

const PostOfficeMaker = new L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [-16, -16],
    labelAnchor: [0, 0],
    popupAnchor: [0, -36],
    html:
        `<span style="${markerHtmlStyles}" />`
})

export default PostOfficeMaker;