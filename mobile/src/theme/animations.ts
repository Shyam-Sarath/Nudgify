// Animation duration and easing tokens
export const animations = {
  durations: {
    short: 200, // micro-interactions, button presses
    medium: 350, // bottom sheets, transitions
    long: 500, // page transitions, overlay fades
  },
  presets: {
    fade: {
      from: 0,
      to: 1,
      duration: 350,
    },
    scalePress: {
      from: 1,
      to: 0.95,
      duration: 100,
    },
  },
};
