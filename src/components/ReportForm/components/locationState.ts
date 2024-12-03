
import { LatLng } from 'leaflet';

export let tempLocation: LatLng | null = null;
export let savedLocation: LatLng | null = null;

export const setTempLocation = (location: LatLng): void => {
    tempLocation = location;
}

export const setSavedLocation = (location: LatLng): void => {
    savedLocation = location;
}

export const resetLocation = (): void => {
    tempLocation = null;
    savedLocation = null;
}