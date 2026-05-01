"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { loadGoogleMapsScript } from "@/lib/google-maps";
import { parseGooglePlace, type ParsedGooglePlace } from "@/lib/google-places";

type GooglePlacesAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: ParsedGooglePlace) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  disabled = false,
  placeholder = "Search location",
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onChange, onPlaceSelect]);

  useEffect(() => {
    if (disabled) return;

    let isMounted = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!isMounted || !inputRef.current || autocompleteRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: [
              "address_components",
              "formatted_address",
              "geometry",
              "name",
            ],
            types: ["geocode", "establishment"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const parsedPlace = parseGooglePlace(place);

          if (!parsedPlace) {
            setLoadError("Please select a valid location from suggestions.");
            return;
          }

          setLoadError("");
          onChangeRef.current(parsedPlace.formattedAddress);
          onPlaceSelectRef.current(parsedPlace);
        });

        autocompleteRef.current = autocomplete;
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load Google Places."
        );
      });

    return () => {
      isMounted = false;
      autocompleteRef.current = null;
    };
  }, [disabled]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#005864]" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setLoadError("");
            onChange(e.target.value);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="h-[48px] rounded-[12px] border-0 bg-[rgba(244,244,244,0.6)] px-11"
          autoComplete="off"
        />
      </div>
      {loadError ? (
        <p className="text-sm text-red-600">{loadError}</p>
      ) : null}
    </div>
  );
}
