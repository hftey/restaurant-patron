export let ADDRESS_CITY = 2;
export let ADDRESS_STATE = 4;
export let ADDRESS_COUNTRY = 5;

export interface Restaurant {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone_number: string;
    lat: number;
    lng: number;
    place_id: string;
    created_at: string;
    created_by: number;
}

export interface Coordinate {
    NE: {lat: number, lng: number}
    SW: {lat: number, lng: number}
}

export interface Experience {

}