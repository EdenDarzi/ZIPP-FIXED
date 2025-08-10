// Type definitions for React Leaflet and Leaflet in Next.js

import { MapContainerProps, MarkerProps, PopupProps } from 'react-leaflet';
import { LatLngExpression, Icon, DivIcon } from 'leaflet';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'leaflet-map': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & MapContainerProps;
      'leaflet-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & MarkerProps;
      'leaflet-popup': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & PopupProps;
    }
  }
}

declare module 'react-leaflet' {
  export interface LeafletContextInterface {
    map?: L.Map;
  }
  
  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
    whenCreated?: (map: L.Map) => void;
  }

  export interface MarkerProps {
    position: LatLngExpression;
    icon?: Icon | DivIcon;
    draggable?: boolean;
    eventHandlers?: {
      [key: string]: (e: any) => void;
    };
  }

  export interface PopupProps {
    position?: LatLngExpression;
    offset?: [number, number];
  }
}
