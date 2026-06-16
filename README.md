<p align="center">
    <img src='/public/logo.png' />
</p>

[![GitHub stars](https://img.shields.io/github/stars/pipipi-pikachu/PPTist)](https://www.github.com/pipipi-pikachu/PPTist/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pipipi-pikachu/PPTist)](https://www.github.com/pipipi-pikachu/PPTist/network/members)
[![GitHub issues](https://img.shields.io/github/issues-closed/pipipi-pikachu/PPTist)](https://github.com/pipipi-pikachu/PPTist/issues)
[![license](https://img.shields.io/github/license/pipipi-pikachu/PPTist)](https://www.github.com/pipipi-pikachu/PPTist/blob/master/LICENSE)
[![Gitee stars](https://gitee.com/pptist/PPTist/badge/star.svg?theme=gvp)](https://gitee.com/pptist/PPTist)
[![Gitcode stars](https://gitcode.com/pipipi-pikachu/PPTist/star/badge.svg)](https://gitcode.com/pipipi-pikachu/PPTist)

[简体中文](README_zh.md) | English


# 🎨 PPTist
**PowerPoint-ist（/'pauəpɔintist/）**, A web-based presentation (slideshow) application. This application replicates most of the commonly used features of Microsoft Office PowerPoint. It supports various essential element types such as text, images, shapes, lines, charts, tables, videos, audio, and formulas. You can edit and present slides directly in a web browser.

**Try it online👉：[https://pipipi-pikachu.github.io/PPTist/](https://pipipi-pikachu.github.io/PPTist/)**

> China Mirrors (Synchronized Regularly): [Gitee](https://gitee.com/pptist/PPTist)、[GitCode](https://gitcode.com/pipipi-pikachu/PPTist)


# ✨ Highlights
1. **Easy Development**: Built with Vue 3.x and TypeScript, it does not rely on UI component libraries and avoids third-party components as much as possible. This makes styling customization easier and functionality extension more convenient.
2. **User Friendly**: It offers a context menu available everywhere, dozens of keyboard shortcuts, and countless editing detail optimizations, striving to replicate a desktop application-level experience.
3. **Feature Rich**: Supports most of the commonly used elements and functionalities found in PowerPoint, supports generate PPT by AI, supports exporting in various formats, and offers basic editing and previewing on mobile devices.


# 👀 Front-Row Reminder
1. The target audience for this project is developers with web slide development needs and basic web development experience. The provided link is for demonstration purposes only and does not offer any online services. This project should not be used directly as a tool, nor does it support out-of-the-box use. If you simply need a ready-made service or tool, please consider other products.
2. Here are some summarized [Frequently Asked Questions](/doc/Q&A.md). When raising Issues or submitting PRs for the first time, be sure to read this document in advance.
3. For commercial use, please refer to [Commercial Use](#-commercial-use)


# 🧩 Project Positioning
> This project is strictly positioned as a Web Slide Editing/Presentation Application. It is not intended to be an ~~AI PPT generator, low-code platform, or image editor~~. The following are the recommendation levels for common use cases:

- **Low-code Platforms / H5 Editors / Image Editors / Whiteboards** (Recommendation: Not Recommended): We suggest choosing open-source projects specifically designed for those purposes.
- **PPT File Preview Tool** (Recommendation: ⭐): The ability to import .pptx files is limited (roughly 70%~80% fidelity). Unless your requirements for preview accuracy are low and you only need basic content display, this is not recommended.
- **AI PPT Generation Tool** (Recommendation: ⭐⭐): While the project provides basic template-based AI generation, it is not the core focus. As AI technology evolves (moving from templates to HTML-based or image-based generation), this project will not necessarily follow those trends. However, if you wish to build a template-based AI generator and are willing to implement your own generation logic, PPTist’s robust editing capabilities make it a strong foundation.
- **Office PPT Authoring Tool** (Recommendation: ⭐⭐): PPTist supports many common Office features and basic .pptx export. However, exports are not 100% identical to the original, and as mentioned, import capabilities are limited. Choose this only if you can accept these limitations.
- **Web Slide Editing/Presentation App** (Recommendation: ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐): This is the primary use case. The core strengths of PPTist are its editing capabilities and user experience. You can build upon this project to customize or add unique nodes and features tailored to your specific needs, where Office compatibility is not the ultimate goal. **Summary: Our vision is for you to use PPTist to create a presentation product that is distinct from Microsoft Office, rather than just using it as a middleman for editing Office files.**


# 🚀 Installation
> node.js version >= 20

```
npm install

npm run dev
```
Browser access: http://127.0.0.1:5173/


# 📚 Features
### Basic Features
- History (undo, redo)
- Shortcuts
- Right-click menu
- Export local files (PPTX, JSON, images, PDF)
- Import and export pptist files
- Print
- AI PPT
### Slide Page Editing
- Add/delete pages
- Copy/paste pages
- Adjust page order
- Create sections
- Background settings (solid color, gradient, image)
- Set canvas size
- Gridlines
- Rulers
- Canvas zoom and move
- Theme settings
- Extract slides style
- Speaker notes (rich text)
- Slide templates
- Transition animations
- Element animations (entrance, exit, emphasis)
- Selection panel (hide elements, layer sorting, element naming)
- Labels for Page and Node Types (usable for template-related features)
- Find/replace
- Annotations
### Slide Element Editing
- Add/delete elements
- Copy/paste elements
- Drag and move elements
- Rotate elements
- Scale elements
- Multiple element selection (marquee, point selection)
- Group multiple elements
- Batch edit multiple elements
- Lock elements
- Magnetic alignment of elements (move and scale)
- Adjust element layer
- Align elements to canvas
- Align elements to other elements
- Evenly distribute multiple elements
- Drag to add text and images
- Paste external images
- Set element coordinates, size, and rotation
- Element hyperlinks (link to webpage, link to other slide pages)
- Element bubble menu (Floating toolbar)
#### Text
- Rich text editing (color, highlight, font, font size, bold, italic, underline, strikethrough, subscript, inline code, quote, hyperlink, alignment, numbering, bullet points, paragraph indent, clear formatting)
- Line height
- Character spacing
- Paragraph spacing
- First line indent
- Fill color
- Border
- Shadow
- Transparency
- Vertical text
- AI Rewrite/Expand/Abbreviate
#### Images
- Crop (custom, shape, aspect ratio)
- Rounding
- Filters
- Tint (mask)
- Flip
- Border
- Shadow
- Replace image
- Reset image
- Set as background
#### Shapes
- Draw any polygon
- Draw any line (unclosed shape simulation)
- Replace shape
- Fill (solid color, gradient, image)
- Border
- Shadow
- Transparency
- Flip
- Shape format painter
- Edit text (supports rich text, similar to text element’s rich text editing)
#### Lines
- Straight lines, polylines, curves
- Color
- Width
- Style (solid, dashed, dotted)
- Endpoint style
#### Charts (bar, column, line, area, scatter, pie, donut, radar)
- Chart type conversion
- Data editing
- Background fill
- Theme color
- Coordinate system and axis text color
- Grid color
- Other chart settings
- Border
#### Tables
- Add/delete rows and columns
- Theme settings (theme color, header, total row, first column, last column)
- Merge cells
- Cell styles (fill color, text color, bold, italic, underline, strikethrough, alignment)
- Border
#### Video
- Preview cover settings
- Auto play
#### Audio
- Icon color
- Auto play
- Loop play
#### Formulas
- LaTeX editing
- Color settings
- Formula line thickness settings
### Slide Show
- Brush tools (pen/shape/arrow/highlighter annotation, eraser, blackboard mode)
- Preview all slides
- Bottom thumbnails navigation
- Timer tool
- Laser pointer
- Auto play
- Speaker view
- Audience view
### Mobile
- Basic editing
  - Add/delete/copy/note/undo redo pages
  - Insert text, images, rectangles, circles
  - General element operations: move, scale, rotate, copy, delete, layer adjust, align
  - Element styles: text (bold, italic, underline, strikethrough, font size, color, alignment), fill color
- Basic preview
- Play preview


# 👀 FAQ
Some common problems: [FAQ](/doc/Q&A.md)


# 🎯 Supplement
There is currently no complete development documentation, but the following documents may be of some help to you:
- [Project Directory and Data Structure](/doc/DirectoryAndData.md)
- [Fundamentals of Canvas and Elements](/doc/Canvas.md)
- [How to Customize an Element](/doc/CustomElement.md)
- [About AIPPT](/doc/AIPPT.md)

Here are some auxiliary development tools/repositories:
- Import PPTX file reference: [pptxtojson](https://github.com/pipipi-pikachu/pptxtojson)
- Draw shape: [svgPathCreator](https://github.com/pipipi-pikachu/svgPathCreator)


# 📄 License
[AGPL-3.0 License](https://github.com/pipipi-pikachu/PPTist/blob/master/LICENSE) | Copyright © 2020-PRESENT [pipipi-pikachu](https://github.com/pipipi-pikachu)

# 🧮 Commercial
If you wish to use this project for commercial gain, I hope you will respect open source and strictly adhere to the AGPL-3.0 license, giving back to the open source community. Or contact the author for an independent commercial license.





# 🧮 Commercial Use
## Commercial Notice
- This project is prohibited for closed-source commercial use. If you wish to use it in commercial projects, please respect open source, **strictly comply with the [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)**, and give back to the open source community.
- If for any reason you cannot comply with the AGPL-3.0 license, you can choose:
    1. Use the Apache 2.0 license version (last updated in May 2022, no longer maintained, [click here to download](https://github.com/pipipi-pikachu/PPTist/archive/f1a35bb8e045124e37dcafd6acbf40b4531b69aa.zip)).
    2. Become an important contributor to the project (not applicable if you become a contributor after violating the license first), which includes:
        - Your code is referenced as a dependency by this project, including: npm installation, file reference, code snippet reference (source will be indicated);
        - You have submitted important PRs or Issues to this project (subjectively judged by the author, qualifying PRs or Issues will be tagged with `important contribution`);
    3. [Email the author](mailto:pipipi_pikachu@163.com) to pay for an independent commercial license (not applicable to those found by the author after violating the license). Independent license pricing:
        - One year: 2999 RMB;
        - Permanent: 5699 RMB (excl. tax);
- Please prioritize complying with the AGPL-3.0 license. If you need to pay for an independent commercial license, please be sure to read the following before contacting the author:
    - **Independent Commercial License Details**:
        - The author will issue a separate commercial license agreement document (contact the author by email to obtain it), and both parties will sign the agreement according to the process;
        - Allows the code to be used for commercial activities without complying with the AGPL-3.0 license;
        - The license target can be an individual or an organization (enterprise), allowing all products under the license target name to use the code of this project;
    - **Licensing Process**:
        1. The licensee confirms the content of the agreement, and if there is no objection, provides the personal/enterprise information required in the agreement;
        2. The author signs after adding the information of both parties, and sends the electronic scan to the licensee;
        3. Upon receipt, the licensee prints and seals the agreement, then scans and sends the electronic version back to the author, at which point the agreement takes effect;
        4. The licensee pays the fee within the time specified in the agreement and keeps the payment certificate, and the licensing is complete;
    - **Licensing is not equal to selling software or services**:
        - There is no other "commercial version", and no APIs/SDKs/online services/technical support/technical consulting/custom development are provided;
        - No ready-to-deliver products are provided; you still need to obtain the code from this repository and develop it yourself;
        - This software is not plug-and-play, at least you need to connect the backend capabilities yourself (basic web development experience is required);
        - Compatibility of future versions is not guaranteed, and no guarantee is made that the code is bug-free;
        - The author is not liable for any direct or indirect losses caused by using the code of this project;
        - Be sure to conduct research in advance to judge whether the software meets your requirements, including but not limited to functions (whether it can meet business needs) and development (whether the current tech stack/implementation plan is easy to use);
- We do not accept any form of commercial licensing for entities on the [Blacklist/Hall of Shame](/doc/Blacklist.md) or those with history of license violations;
- The author advocates asynchronous communication (formal, highly integrated information), **does not add personal WeChat/QQ/phone numbers, etc.**, please contact by email for any licensing related questions, thank you for your understanding;
- To suggest features/report bugs/ask about technical solutions, please use [Issues](https://github.com/pipipi-pikachu/PPTist/issues).

## AGPL-3.0 License
The core requirements of the license are explained in plain language as follows:
- **Open Source Obligation**: If you use AGPL code, no matter how you or your downstream users use/modify it, you must make your final code completely public and continue to open source it under the AGPL license (emphasis: the AGPL license must be continued to maintain the infectivity of open source, and cannot be replaced with other licenses).
- **Network Services Must Also Be Open Source**: Even if you only use AGPL code to make a website or network service, you must still comply with the above **Open Source Obligation** when others use your service over the network.
- **Retain Copyright Notice**: You cannot delete the original author information and license notice in the code, and you must tell everyone where the code came from.
- **No Additional Restrictions**: You cannot add additional restrictions to the derived AGPL code, such as preventing others from redistributing the code or requiring others to pay to use the code (including but not limited to: requiring others to purchase licenses/services/products, etc.).
- **Disclaimer**: The author does not guarantee that the code is bug-free, nor is the author responsible for the consequences of its use.

> Detailed license content can be found in the official document: [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)


# ⭐ Star History

<a href="https://www.star-history.com/?repos=pipipi-pikachu%2FPPTist&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=pipipi-pikachu/PPTist&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=pipipi-pikachu/PPTist&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=pipipi-pikachu/PPTist&type=date&legend=top-left" />
 </picture>
</a>