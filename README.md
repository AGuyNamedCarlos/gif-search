# `Gif Search App`

Allows the user to search and view gifs via the Giphy API
https://github.com/Giphy/GiphyAPI
##

### `Please provide a valid Giphy API key when running this app`

See the file `.env.example` for an example on how to set the API key.

To start the application simply run `yarn start`
##

# `Usage`

## Display
The user will be presented with a page displaying a non-moving version of the trending gifs.

Clicking on a gif will open up a modal showing the available animated renditions of the gifs. 

The user can cycle through the animated renditions using the small buttons at the bottom of the modal.
##

## Search
The user can use the input located at the top of the screen to get gifs from a specific category. Example: Happy

When the user keys in a value, the search will be excecuted after a brief moment.

The clear button will remove the value typed by the user and return to the trending gifs.
##

## Pagination
Because each category can contain thousands of gifs, the results are separated on pages of 20 gifs

The user can use the numbers found under the search input to move through the pages and look at more gifs!
##
