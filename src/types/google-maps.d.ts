export {};

declare global {
  namespace google.maps {
    class LatLng {
      lat(): number;
      lng(): number;
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: AutocompleteOptions
        );
        addListener(eventName: string, handler: () => void): MapsEventListener;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        fields?: string[];
        types?: string[];
      }

      interface PlaceResult {
        address_components?: GeocoderAddressComponent[];
        formatted_address?: string;
        geometry?: {
          location?: LatLng;
        };
        name?: string;
      }
    }

    interface MapsEventListener {}
  }

  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }

  const google: {
    maps: typeof google.maps;
  };
}
