# How to add a new widget type to My Space

In the past, we simply added widget types as needed. We only had a handful of simple widgets prior to writing this, but we've just added a new complex one and, while doing so, created a process for making future additions easier. This document describes that process, providing all of the steps needed to add a new widget type to My Space.

## Important note:

The following instructions are only necessary for adding a new widget that requires user input. If the widget is simply a display widget, then you will only need to perform some of these steps, and could probably just call a mutation directly to add the widget to the user's My Space.

## Step 1: Create a new widget type

In the `src/types/index.ts` file, add a new type to the `WidgetType`. This type should be a string literal type that is the name of the widget. For example, if you were adding a widget type called "Weather", you would add the following to the `WidgetType` type:

```ts
type WidgetType = 'Collection' | 'GuardianIdeal' | 'Weather'
```

Now, while still in the `src/types/index.ts` file, define a new type for the widget, one that extends the `Widget` type. Make sure that your new widget contains all of the properties that the widget will need. For example:

```ts
export interface WeatherWidget extends Widget {
  coords: WeatherCoords
}
```

We have one more step to do in the `src/types/index.ts` file. Find the `MySpaceWidget` type and add your new widget type to the union type. For example:

```ts
export type MySpaceWidget = Widget | Collection | WeatherWidget
```

The importance of updating this type is twofold. First, it allows us to use the `MySpaceWidget` type in the `MySpace` component. Second, the resolver for the `editMySpace` mutation takes a `MySpaceWidget` type as an argument, so we need to make sure that our new widget type is included in that type in order for the database to be updated correctly.

## Step 2: Create a new widget mutation

This one is straightforward. Feel free to reference our existing mutations for examples. Don't forget to add a new resolver!

One important note here: if the new widget adds a unique field that doesn't exist in any other widget (which it almost certainly will, seeing as how it's new...), you will need to update `WidgetReorderInput` in `src/schema.tsx` to include that new field. After doing so, don't forget to run `yarn generate` to update the generated types.

## Step 3: Create a new widget component

Follow the convention of adding a new component by creating a folder under `src/components` named for your new widget. When creating the component, if there is any sort of conditional rendering needed for the component (example: an input field that needs a zip code in order to fetch weather data), it would be beneficial to try and keep that inside of the component, as opposed to breaking it out into a smaller component. It isn't required, but will make things much easier as you go through the other steps. Finally, make sure that the mutation you created in the previous step refetches the `getUser` query when called (assuming you call it from inside this component, or a function in `mySpaceContext`). This will automatically update the user's My Space with the new widget.

## Step 4: Add a new option to the `AddWidget` component

In the `AddWidget` component, add a new button element as a child to `DropdownMenu`. Give it an `onClick` handler that sets the `temporaryWidget` variable to the name of the widget, the `isAddingWidget` variable to `true`, and closes the dropdown. For example:

```ts
setTemporaryWidget('Weather')
setIsAddingWidget(true)
setIsDropdownOpen(false)
```

The button should also have a `disabled` attribute that is set to `!canAddWidget`. You can create this variable in the `myspaceContext`, referring to the similar variables that are already there (example: `!canAddCollection`, `!canAddGuardianIdeal`, etc.). The purpose of this is to look at the current state of the user's My Space and determine if the user can add a new widget. For example, if the user has 25 collections, then they should not be able to add another one.

## Step 5: Add your widget to the `TemporaryWidget` component

In the `TemporaryWidget` component, import your new widget component and add a new if statement to check for the value of `temporaryWidget` that you set in the previous step. For example:

```ts
if (temporaryWidget === 'Weather') {
  return <WeatherWidget />
}
```

One major benefit to this component, is that it allows us to bypass the type check for the `mySpace` array and display a widget in the `MySpace` component while the user is inputing information/still deciding if they want the widget in their My Space. Also, we are letting the client-side do all of the heavy lifting, instead of reaching out to the server to create a new widget, only to have the user cancel out of the process.

## Step 6: Add your widget to the `MySpace` component

In the `MySpace` component, we are mapping through the `mySpace` array, checking each widget's type and rendering the appropriate component. In order to do this:

- Create a new function in `myspaceContext` that checks the type of the widget and returns a boolean value. You will also need to update the constants file that contains all the available widget types. Add in the type name that you created in the first step. Here is an example of what the final result should look like:

```ts
function isWeather(widget: MySpaceWidget): widget is Collection {
  return widget.type === WIDGET_TYPES.WEATHER
}
```

If this is confusing, just search the above example in `myspaceContext` and you'll see how it's used, as well as all of the other widget types that use the same convention.

Don't forget to add the new function to the `myspaceContext` type and export it!

- Import the function into the `MySpace` component and add a new if statement to the `map` function that checks the type of the widget and renders the appropriate component. For example:

```ts
if (isWeather(widget)) {
  const weatherWidget = widget as WeatherWidgetType
  return (
    <Grid
      key={`widget_${weatherWidget._id}`}
      tabletLg={{ col: 6 }}
      desktopLg={{ col: 4 }}>
      <DraggableWidget id={weatherWidget._id.toString()}>
        <WeatherWidget widget={weatherWidget} />
      </DraggableWidget>
    </Grid>
  )
}
```

Important note: the `DraggableWidget` component is what allows the user to drag and drop the widget to reorder it. If you are adding a new widget that doesn't need to be reordered, you can remove this component.

## Step 7: Update the `handleOnDragEnd` function in `myspaceContext`

Everything in the `MySpace` component, whether it has drag-and-drop enabled or not, is wrapped in the `DndContext` component that is needed for the drag-and-drop functionality. So even if your new widget is not using drag-and-drop, you will still need to update the `handleOnDragEnd` function to include the fields for your new widget. For example, you would insert something like this into the `updatedMySpace` variable:

```ts
if (widget.type === WIDGET_TYPES.WEATHER) {
  const weatherWidget = widget as WeatherWidget
  return {
    _id: weatherWidget._id,
    title: weatherWidget.title,
    type: weatherWidget.type,
    coords: {
      lat: weatherWidget.coords.lat,
      long: weatherWidget.coords.long,
      forecastUrl: weatherWidget.coords.forecastUrl,
      hourlyForecastUrl: weatherWidget.coords.hourlyForecastUrl,
      city: weatherWidget.coords.city,
      state: weatherWidget.coords.state,
      zipcode: weatherWidget.coords.zipcode,
    },
  }
}
```

The reason for this, is that when we perform a drag-and-drop operation, we need to pass the entire `mySpace` array to the mutation that updates the database. So even though you may not want to drag-and-drop your widget, the `handleOnDragEnd` function still needs to be able to handle it so that the proper data is passed to the mutation.
