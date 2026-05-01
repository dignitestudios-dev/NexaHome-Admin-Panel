export type ParsedGooglePlace = {
  street: string;
  address: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
  lat: string;
  long: string;
  formattedAddress: string;
};

function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShortName = false
) {
  const component = components.find((item) => item.types.includes(type));
  if (!component) return "";
  return useShortName ? component.short_name : component.long_name;
}

export function parseGooglePlace(
  place: google.maps.places.PlaceResult
): ParsedGooglePlace | null {
  if (!place.geometry?.location) return null;

  const components = place.address_components ?? [];
  const streetNumber = getAddressComponent(components, "street_number");
  const route = getAddressComponent(components, "route");
  const subpremise = getAddressComponent(components, "subpremise");
  const premise = getAddressComponent(components, "premise");

  const street = [streetNumber, route].filter(Boolean).join(" ").trim();
  const city =
    getAddressComponent(components, "locality") ||
    getAddressComponent(components, "postal_town") ||
    getAddressComponent(components, "sublocality") ||
    getAddressComponent(components, "administrative_area_level_2");

  const suite = subpremise || premise;
  const formattedAddress = place.formatted_address ?? place.name ?? "";

  return {
    street: street || formattedAddress,
    address: suite || formattedAddress,
    city,
    state: getAddressComponent(components, "administrative_area_level_1"),
    country: getAddressComponent(components, "country"),
    zipCode: getAddressComponent(components, "postal_code"),
    lat: String(place.geometry.location.lat()),
    long: String(place.geometry.location.lng()),
    formattedAddress,
  };
}
