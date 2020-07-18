import L from 'leaflet';
import './marker.css';

import k from "../assets/3k.svg"
import p from "../assets/people.svg"

const myCustomColour = '#0058a3'
const myDotColour = '#ffffff'
const textDivColor = "#ffffff"
const markerHtmlStyles = (color) => {
    return (`
        background-color: ${color};
        width: 40px;
        height: 40px;
        display: block;
        left: -30px;
        top: -30px;
        position: relative;
        border-radius: 40px 40px 0;
        transform: rotate(45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 4px -10px 12px rgba(0, 0, 0, 0.5);
 `)
}

const markerDotLeftStyles = `
  background-color: ${myDotColour};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: 18px;
  left: 6px;
  `
const markerDotRightStyles = `
  background-color: ${myDotColour};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: -12px;
  left: 12px;
  `
const totalHolder = `
    height: 20px;
    position: absolute;
    top: -26px;
    left: 4px;
    transform: rotate(-45deg);
    transform-origin: top left;

    display: flex;
    background-color: ${textDivColor};
    border-radius: 20%;
    border: 2px solid #FFFFFF;
    padding-right: 4px;
    border: 2px solid #FFFFFF;
    box-shadow: 0 0 6px 4px rgba(0, 0, 0, 0.5);
`
const kImage = `
    width: 20px;
    height: 20px;
 `

const peopleHolder = `
    height: 20px;
    position: absolute;
    top: -6px;
    left: 25px;
    transform: rotate(-45deg);
    transform-origin: top left;

    display: flex;
    background-color: ${textDivColor};
    border-radius: 20%;
    border: 3px solid #FFFFFF;
    padding-right: 4px;
    border: 2px solid #FFFFFF;
    box-shadow: 0 0 6px 4px rgba(0, 0, 0, 0.5);
`

const PostOfficeMaker = (total, s_people, p_people, color = "#0058a3") => {
    const myStyle = markerHtmlStyles(color);
    var mypeopleHolder = peopleHolder;
    var mytotalHolder = totalHolder;
    if (s_people === -1 && p_people === -1) {
        mypeopleHolder = `
        visibility: hidden;
        display: none;
    `
    }
    if (total === -1) {
        mytotalHolder = `
        visibility: hidden;
        display: none;
    `
    }
    return (
        new L.divIcon({
            className: "my-custom-pin",
            iconAnchor: [-8, 24],
            labelAnchor: [0, 0],
            popupAnchor: [-2, -30],
            html:
                `
            <div>
                <span style="${myStyle}" >
                    <div className="left" style="${markerDotLeftStyles}"/>
                    <div className="right" style="${markerDotRightStyles}"/>
                </span>
                
                <div style="${mypeopleHolder}">
                    <img style="${kImage}" src="${p}"/> 
                    ${s_people ? s_people === -1 ? `x` : s_people : 0}/${p_people ? p_people === -1 ? `x` : p_people : 0}
                </div>
            </div>
            `
        })
    )
}
{/* <div style="${mytotalHolder}">
    <img style="${kImage}" src="${k}" /> ${total ? total : 0}
</div> */}
export default PostOfficeMaker;