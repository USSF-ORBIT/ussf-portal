<--[Back](https://ussf-orbit.github.io/ussf-portal/portal-updates)

Below is our product roadmap: a long-term plan of the goals, features, and direction of the USSF Portal. We update this every two weeks with the status of our progress, as well as add new high-level feature requests and ideas.

**Last Updated: 02/04/2022**

## November & Pre-Launch December

____________________________________________________

### Prototype Testing

| Task  | Description | Status |
| ------ | ------ | :------: |
| Design edits to the graphic elements and theme | Update the theme and graphic elements to finalize the look and feel of the portal site that will launch | :white_check_mark: DONE |
| Finalizing the CMS | Building the last of the infrastructure and application needed to have an integrated content management system for the BETA launch | :white_check_mark: DONE |
| Finalizing authentication | Building the authentication workflow for users to ensure the portal recognizes who a person is when they are coming to the portal | :white_check_mark: DONE |

### BETA Launch Preparation

| Task  | Description | Status |
| ------ | ------ | :------: |
| BETA branding | Update theme and branding to explicitly show users they are on a BETA version of the site | :white_check_mark: DONE |
| BETA opt-in / opt-out | Create a method for users to opt-in to the BETA portal in addition to being able to exit the beta if they wish to return to the legacy portal | :white_check_mark: DONE |
| Infrastructure on C1 | Build the final application infrastructure on C1 | :white_check_mark: DONE |
| Custom 500 page | Build a better looking page to handle 500 errors | :white_check_mark: DONE |
| Custom 404 page | Build a better looking page to handle 404 errors | :white_check_mark: DONE |

## Post-Launch December & January

____________________________________________________

### BETA followup items

| Task  | Description | Status |
| ------ | ------ | :------: |
| Standup analytics | Add analytics tracking code to portal pages | :construction: IN PROGRESS |
| Max limits on # collections and URLs | Set max limit for the number of collections one can add to their My Space and number of links within a collection | :white_check_mark: DONE |
| Set focus on add url input field | Focus cursor on input fields when adding a URL to a collection | :white_check_mark: DONE |
| BUG: Unable to delete multiple URLs from a collection at a single time | Fix to allow users to delete 1+ URLs at a time. | :white_check_mark: DONE |

### UX updates

| Task  | Description | Status |
| ------ | ------ | :------: |
| Include edit title option in gear icon | Expose the ability to edit a collection title from the gear icon dropdown menu | :white_check_mark: DONE |
| Improved usability when adding a custom link to a collection | Separate UX of adding custom link from selecting a link from the dropdown menu | :white_check_mark: DONE |

## February & March

____________________________________________________

### News & Announcemnts

| Task  | Description | Status |
| ------ | ------ | :------: |
| Build news page | This page will be responsible for displaying the existing SpaceForce.mil RSS news feed as well as all future content authored in the CMS | :white_check_mark: DONE |
| Build news widget | This widget will sit on the users My Space with the goal of surfacing the latest or most relavent news and announcements | :white_check_mark: DONE |
| Migrate existing content | We will be porting over any existing pages on the current portal to the new UI | :construction: IN PROGRESS |
| Announcements section | Create a new section on the home page displaying the most up to date announcements | :construction: TODO |

### Self hosted CMS

| Task  | Description | Status |
| ------ | ------ | :------: |
| Infra tasks | Tasks required to configure and deploy a standalone CMS to production | :construction: IN PROGRESS |
| Auth and user roles | Use existing login methods and create the necessary CMS roles | :construction: IN PROGRESS |

### Analytics
| ------ | ------ | :------: |
| Deploy analytics platform to production | The remaining piece of getting the analytics platform on to the production environment so we can begin collecting data | | :construction: IN PROGRESS |


| Task  | Description | Status |


## April & May

____________________________________________________

### Search

| Task  | Description | Status |
| ------ | ------ | :------: |
| Display search query interface | Add a search field to the portal | :construction: TODO |
| Handle user search query input | Implement search and indexing logic | :construction: TODO |
| Create search results page | The front facing search results page | :construction: TODO |
| Search e-Pubs | Pass search request to e-Pubs for forms and publictions | :construction: TODO |

### Dark Mode

| Task  | Description | Status |
| ------ | ------ | :------: |
| UX/UI updates | The frontend changes required to enable dark mode | :construction: TODO |
| Update components | Create / update Storybook components to support dark mode view | :construction: TODO |
| Dark mode settings | Surface settings for use to toggle on/off dark/light mode | :construction: TODO |
