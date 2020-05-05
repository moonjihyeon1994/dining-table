import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import styled from "styled-components";
import './Marker.css';

// const googleMapKey : string = process.env.REACT_APP_GOOGLE_MAP_KEY;

const AnyReactComponent = (props: {
  text: string;
  lat: number;
  lng: number;
  zoom : number;
}) => <><div className='pin'></div> <StyedMarker zoom={props.zoom}>{props.text}</StyedMarker> <div className='pulse'></div></>;

const StyedMarker = styled.div`
    font-size: 2rem;
    position: absolute;
    bottom: 2rem;
    width: 9rem;
    background-color: white;
    padding : 1rem;
    border-radius: 6px;
    text-align: center;
    visibility: ${(props:{zoom : number}) => props.zoom >= 16 ? 'visible' : 'hidden'};
`;

interface ISimpleMapProps {
  center: {lat : number, lng:number};
  zoom: number;
  text: string;
}

class SimpleMap extends Component<ISimpleMapProps> {
  static defaultProps = {
    center: {
      lat: 37.501265,
      lng: 127.039669
    },
    zoom: 18
  };

  render() {
    console.log(this.props.center)
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBwZ76nlyn5tthHWmNlZ9K9CJMMwABfbec' }}
          center={this.props.center}
          // defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={this.props.center.lat} lng={this.props.center.lng} text={this.props.text} zoom={18} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
