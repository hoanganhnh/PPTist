## Project Directory & Data Structure

### Project Directory Structure
```
├── assets                        // Static assets
│   ├── fonts                     // Online font files
│   └── styles                    // Style configurations
│       ├── antd.scss             // Antd default style overrides
│       ├── font.scss             // Online font definitions
│       ├── global.scss           // Common global styles
│       ├── mixin.scss            // Scss global mixins
│       ├── variable.scss         // Scss global variables
│       └── prosemirror.scss      // ProseMirror rich text default styles
├── components                    // Common components independent of business logic
├── configs                       // Configuration files, e.g., canvas sizes, fonts, animations, hotkeys, preset shapes, preset lines, etc.
├── hooks                         // Hook methods shared across multiple components (modules)
├── mocks                         // Mock data
├── plugins                       // Custom Vue plugins
├── services                      // API methods
├── types                         // Type definitions
├── store                         // Pinia store (refer to: https://pinia.vuejs.org/)
├── utils                         // Common utility functions
└── views                         // App views divided into Editor and Screen (Presenter/Audience slideshow play) sections
    ├── components                // Shared view components
    ├── Editor                    // Editor module
    ├── Screen                    // Screen (Slideshow Play) module
    └── Mobile                    // Mobile module
```


### Data
The slide presentation data is mainly stored in `src/store/slides.ts`.
> In a production environment, you would typically save part of the state data in this file to a database.

Includes:
- `title`: Presentation title/filename
- `slides`: Slide page data, containing information such as page IDs, element contents, notes, background configurations, animations, and transitions
- `theme`: Slide theme configuration, including background color, theme color, font color, font, etc.
- `viewportSize`: Slide viewport width base (default is 1000, i.e., 1000×562.5 canvas)
- `viewportRatio`: Slide viewport aspect ratio (width:height), default 16:9
- `templates`: Slide templates

For detailed type definitions, see: [Full Data Type Definitions](https://github.com/pipipi-pikachu/PPTist/blob/master/src/types/slides.ts)