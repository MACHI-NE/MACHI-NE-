## Contributions

- Marcus Ho- 20%
- Ho Hin (Alex) Mei - 20%
- Coleman Lai - 20%
- Howard Jin - 20%
- Isitha Tennakoon - 20%

## Design Notes

- We interpreted 'initially' setting the password as implying the ability to change the password, so a button to reset the operator password was added.
- When clicking on an item in the emergencies list, the map moves to the position of the corresponding map marker, in addition to displaying all the details. The map marker is highlighted on the map by opening a popup over the map marker, and the colour of the marker will change to green.
- Our interpretation of a 'sortable' list included the ability to sort by time (latest first), region name (alphabetical), type name (alphabetical), and status (prioritizing the 'OPEN' status).
- Based on our interpretation of the assignment requirements, an option to toggle the emergencies list between two viewing modes was added:
  - In 'View All' mode, the emergency list shall show all reported emergencies in the map.
  - In 'View Nearby' mode, the emergency list shall show only the emergencies currently corresponding to map markers that are visible within the map's borders.
- We decided inputting actual coordinates would be too user unfriendly, and the requirements seem to contradict itself on the optional part of inputting them, as how else would we be able to place a marker on the map without coordinates without geocoding (which assumingly is not allowed as it is not part of vanilla Leaflet/Leaflet-React). Because of this, we decided to have the coordinate input be a map input where a user could select the incident location based off of a isolated map.

## Tester Notes

- The operator password is initially set to 'temp'.

## Instructions

Please navigate to the MACHI-NE directory and run the following commands from the console:

- `npm install`
- `npm run dev`
