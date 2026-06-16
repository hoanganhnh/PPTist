## Frequently Asked Questions (FAQ)

#### Q. Why doesn’t the xxx shortcut work?

A. Some shortcuts only work when the focus is on a specific area. For example, the shortcuts for operating pages only work when the focus is on the thumbnail list on the left, and the shortcuts for operating elements only work when the focus is on the canvas area.

#### Q. Why isn’t pasting working?

A. Please make sure to allow the browser access to the system clipboard.

#### Q. Why do my previous PPT disappear after refreshing or reopening the browser?

A. The links provided by the repository are for demonstration purposes only, and the project is deployed as a pure front-end application without a backend, thus it does not save data.

#### Q. How do I adjust the order of slides?

A. You can drag and drop the thumbnails on the left to adjust the order.

#### Q. Why does the application become unresponsive after inserting images?

A. Since this demo project does not rely on a backend, inserting local images actually references Base64 encoded data, which can result in very large data sizes. In a real production environment, you should upload images and reference their addresses to avoid this issue.

#### Q. Why doesn’t the preset theme take effect after being applied?

A. Applying a preset theme affects new elements and pages added, but will not apply to existing elements and pages. You can use the “Apply Theme to All” feature to apply the current theme to all pages.

#### Q. Why doesn’t setting an online font work?

A. Setting an online font involves downloading the corresponding font file, which can be large and requires time to complete the download before the new font is applied.

#### Q. About Importing and Exporting PPTX Files

A. As an online presentation application, the ability to import and export PPTX files is very important. However, it has been found that the complexity of implementing this feature far exceeds expectations. Due to limited personal capacity and time, this functionality can only be achieved with the help of third-party solutions.

- **Export**: The current export function is mainly based on [PptxGenJS](https://github.com/gitbrent/PptxGenJS/), and it can export most basic elements, but there are still many defects that need to be improved. It’s important to note that: 1) This feature relies on PptxGenJS, and for parts that the library itself cannot implement (such as animations), there’s nothing this project can do; 2) The goal of the export function is to export elements with styles as consistent as possible, not to recreate the web page one-to-one in PPT, and some style differences are inevitable.
- **Import**: The import function currently does not have a suitable solution and is still under investigation. If you are interested or have experience in related areas, please discuss in the issues.

> PS. I made an experimental [pptx to json](https://github.com/pipipi-pikachu/pptx2json) converter. If you urgently need to implement the import PPTX file function, you can use this as a reference for your own implementation.

It should be noted that this project is not an exclusive online editor for Office PPT. It is essentially unrelated to Office PPT. The [import/export of PPT files] is just a [feature] of the project, not its [purpose].

#### Q. Which video formats are supported?

A. This project only provides basic video capabilities and can play formats supported by the video tag in normal conditions.

Additionally, you can introduce [hls.js](https://github.com/video-dev/hls.js) or [flv.js](https://github.com/Bilibili/flv.js) to support corresponding formats (.m3u8 .flv) by simply including the corresponding files (such as CDN) in your project, without any other configuration required.

#### Q. About Importing JSON Files

A. Firstly, due to security reasons, I do not recommend exposing such functionality directly to users on the front end, or users should not even come into contact with formats like JSON in the first place (even the export JSON feature was initially intended only for development convenience). If there is a real need, please implement it on the server side, with a focus on data validation, and the same goes for the front end.

#### Q. Print / Export PDF Styles Are Different from the Actual

A. Please adjust the settings in the print dialog that pops up in the browser. It is recommended to set the margins to [default], uncheck [headers and footers], and check [background graphics]. Furthermore, it is recommended to adopt a backend-generated PDF solution (such as Puppeteer) for a more optimal outcome in a formal environment.

#### Q. Why doesn’t the mobile version support xxx feature?

A. The first thing to clarify is that the mobile experience will inevitably be inferior to the PC experience no matter what. Therefore, the mobile version is positioned for simple, temporary handling in emergency situations. True design and creation of slides should be done on a computer with full functionality. If there is a specific need for the mobile version, you can try opening it in desktop mode on mobile (of course, the experience will be worse), or the developer can do further custom development.

#### Q. About Compatibility?

A. This project prioritizes compatibility with Chrome and Firefox. There may be some compatibility issues under Safari. It is not compatible with IE.

#### Q. Why isn’t it an NPM package?

A. Everyone knows that for general plugins/libraries, a well-packaged NPM package can more easily integrate into existing projects. However, PPTist is special; it is a complete program, not a part of another program. If you need to use PPTist, I believe you will necessarily need to do a lot of custom development based on it, including but not limited to: communication with the backend, various templates and pre-installed materials, new element types, using other solutions to implement certain existing elements, your own themes, changing shortcuts, and so on… It’s not just about installing something that is the same as the existing demo (which may be convenient but has no practical significance in actual product development). As previously mentioned, there are many things that need to be configurable, and it would be difficult to cater to all these needs if it were an NPM plugin. The development effort would be enormous, and currently, I cannot afford it.

Therefore, the correct way to develop a project using PPTist is to pull the complete code, try to understand it, and modify it to suit your own needs. There are also similar projects in the community, such as [drawio](https://github.com/jgraph/drawio).

#### Q. About AI PPT

A. Firstly, it should be noted that AI PPT is not the main focus of PPTist, either now or in the future. It is only a very small and simple part of PPTist's features. You can think of it as a small trend-following feature. I don't want to ride the wave of AI hype, but it's unavoidable as too many people place too much importance on AI. So, I created this DEMO (it's really not that complicated). Currently, this feature is for reference only, and internally, it implements the most basic AI PPT generation logic, which is: template customization + AI-generated data combined with templates + image replacement. To control costs, we can only go this far for now. However, to achieve the effect of a production environment, you would need to do more, such as creating more templates and refining the AI workflow.

Note: Image replacement only provides the method and does not offer an actual demonstration function. You will need to provide your own image sources (such as AI text-to-image generation, image library search matching, etc.).

#### Q. Other

A. Additionally, it is important to emphasize that PPTist is merely an open-source project, not a product tailored for the average user. It primarily offers technical solutions. Some product-oriented demands and optimizations require developers to implement and refine on their own.
