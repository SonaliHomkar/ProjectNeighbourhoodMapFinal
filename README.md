Project : NeighbourhoodMap
======================================
This project is mainly intended to display various functionalities explored with google map like
showing markers, searching options for zooming and finding places.
It also enables user drawing polygons and searching the places that is located inside the polygon
A distance from a location can be measured from the marked locations and displayed with a route and time.
It also calls a third party API like to Zomato for displaying nearest places. 

Prerequisites
============
As this project is developed using pure javascript libraries like knockout.js and html pages user don't need to install anything. 

softwares installed
==================

1. Clone the project
==================
# git clone https://github.com/SonaliHomkar/ProjectNeighbourhoodMapFinal

Getting Started
==============
1. Click on the page mapNeighbourhood.html.
2. It will open the page in your default browser.  


Running the tests
========================
1. The page should display heading "NEIGHBOURHOOD MAP" and a "Udacity logo" in the corner
2. It should display a textbox with a label "Search for nearby places" and a "Go" button.
3. When the user types and selects place in the textbox and clicks "Go" button.
4. It should display various option on the map.
5. The Page should display an autocomplete textbox and "Zoom" button.
6. When the user types and selects an area in the textbox and clicks on "Zoom" button.
7. It should zoom the map and display the area.
8. A textbox "Draw a shape to search within it" with a button "Drawing 	Tools" should be displayed on the page.
9. When the user clicks on "Drawing Tools" button it should enable the user to draw a polygon.
10. It should display the marked location within the polygon
11. An option for selecting time (like 10 min, 15 min), traveling modes list (like drive, walk, bike) and 
    textbox for searching places and a "Go" button should displayed on the page.
12. On selecting the options for time, Travelmode and entering a location should display
    the marked location is within the range of entered location and display a widow with the estimated time
    from the marked location, distance a "View Route" button should be displayed
13. On clicking the "View Route" button should display the route from the marked location to the entered location
14. By default all the markers should be displayed on the page load
15. On clicking the marker it should animate like bounce and call the zomato API and display the nearest 
    locations from the marked location
16. A list of all the marked location is displayed on the left hand side with the option of searching the locations
17. when the user enters a text a matching location should be displayed on the list as well as on the map.
18. Two buttons "Show listing" and "Hide listing" is displayed on the page.
19. On clicking the "Show listing" button should display all the predefined markers.
20. On clicking the "Hide listing" button should hide all the predefined markers.
 
Resources used for reference
===========================
1. https://developers.google.com/maps/documentation/javascript/markers
2. https://developers.zomato.com/api

	
# ProjectNeighbourhoodMapFinal
# ProjectNeighbourhoodMapFinal
