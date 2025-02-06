# Stickman3D

## Backlog

### Object Creation

- Ability to move objects

  - Orange circle in centre (currently at edge, needs moving) on hover

- Ability to rotate objects

  - Red circle on edge on hover
  - Rotate around camera plane normal (similarly to moving objects)
  - **User Toggle**: Option to rotate around centre, edge, or user defined point - show rotation point when rotating

- Ability to snap objects together

  - Green circle on snap point
  - Will need some parent object to contain and track objects that are snapped together such that they can be moved in unison
  - **User Toggle**: Option to toggle snapping
  - **User Toggle**: Some way of un snapping objects
  - Make possible snap points rotation points that are disabled when that point is snapped

- Ability to snap objects to the floor

- Makes walking and running animations easier

- Add collision to the floor

- More preset objects
- Stickman head
- Bendable sticks
- Inert objects - see scene creation

- Preset object loading buttons
- Have the start of this but needs fleshing out with icons etc

- Ability to create custom objects
- Some sort of drawing system - using preset objects?
- Will need ability to define motion, rotation and snap points - if using preset objects may not be necessary, but will need to allow enabling/disabling of points
- Option to make objects inert - see scene creation

- Ability to save and load collections of objects
- Probably easiest to use JSON objects to represent scene objects

- Ability to copy objects as is - similar to above but allows it to be set to a starting position first

- Ability to resize and stretch objects - can possibly use the existing object bound buttons for this but modify them via a **User Toggle** - would work for stretching but unsure on resizing

### Colours:

- Red: rotation
- Orange: motion
- Green: snapping
- Blue: rotation point

### Scene Creation

- Ability to load a background
- Will need to wrap it around the scene
- Multiple backgrounds at different distances to provide depth?

- Ability to load a floor

- Ability to load 'inert' objects to populate the scene (buildings, trees etc) that are not interactable

### Camera

- Fix current rotation - use three js orbit controls?
- Allow panning
- Allow snapping to a user defined object
- **User Toggle**: Allow restricting to a plane (for 2D animations) either by free mouse move or coordinate specification

### Animation

- Mechanism to save a scene as a frame
- Film at top that shows the frames
- **User Toggle**: Allow making this independent of camera so camera can be animated separately
- 'Simple' and 'Advanced' mode where simple mode has 1 film and advanced has an additional one for the camera
- Allow toggling between the two
- Ability to save/load/create preset animations that auto update when new frames are created (a helicopter rotor for example)
- Ability to 'fill in the gaps' - auto smoother. Could be configurable per frame or range of frames to allow for speed tweaks
- **User Toggle**: Allow restricting per frame movement to a distance or angle, and allow the steps to be configurable
- Would help in creating smoother animations and judging speed - More fine grained version of the 'fill in the gaps' function
- Ability to copy animations to a different location - I.e. if multiple stickmen are running around. Can create the animation for one of them and copy it to others. But object that is copied to must be compatible (have the same parts, but not necessarily the same size)
- Allow the import of sound effects that can be assigned on a frame by frame basis
- Allow the import of music
- Introduce another bar with the films that allow the user to select where the beats are
- Sync up frames with music on the bar at the top - i.e. so if 60fps, 1 second on the music bar has the same width as 60 frames
- Make the frames in the top bar collapsible - Otherwise longer animations would have a bar that goes on forever
  - Allow partial expansion on user hover (i.e. the clicked frame and a few either side)
  - **User Toggle** Allow turning of this functionality off as it could get in the way of other bars
- Clicking on frame should load it for edits - if there are gap fills either side, update them on edit
- Add the previous frame as a ghost
- **User Toggle**: If there is a next frame, allow switching of the ghost between the previous and next frame
- Allow saving and loading of animations - could use JSON but gets difficult when sound effects involved. May require a backend for S3 storage - see 'User Profiles' section

### User Profiles

- TBD but will require a backend for auth and saving animations/objects etc
- No point thinking about this in detail until app is usable and worth hosting somewhere. Some initial thoughts:
  - Converting to an electron app will have less need for cloud resources as it will be able to use the local file system. There are APIs that allow this from the browser however.
  - An electron app would provide more screen space though due to not having the browser bar at the top
