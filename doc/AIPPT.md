## Fundamentals of Template-based AIPPT

1. Define the PPT structure (what types of pages are in a slide deck, and what content is on each type of page).
2. Based on the above structure, define the data format. This data will be used by the AI to generate structured PPT data. For specific structures, see:
    - Example data: `public/mocks/AIPPT.json`
    - Structure definitions: `src/types/AIPPT.ts`
3. Create a template and mark the structure types in it.
4. AI generates data matching the PPT structure defined in step 1.
5. Use AI or other solutions to generate related images (common ways: AI text-to-image, library search matching).
6. Combine the AI-generated data, images, and the template together to generate the final PPT.

> Note 1: Although the current online version does not demonstrate the image matching effect, the AIPPT method supports this feature. You only need to provide the image source and pass the set of candidate images to the AIPPT method in the required format.

> Note 2: The above only applies to template-based AIPPT. For non-template AIPPT, you can directly generate the final target format. Reference: `AI_PPT_SCHEMA.md`

## AIPPT Template Creation Process
1. Open PPTist;
2. Design template pages;
3. Open the "Slide Type Annotation" feature in the top-left menu;
4. Label page types and node types for the designed pages;
5. Export as a JSON file using the export function.

> Note: Actually, there are no special templates dedicated only to AIPPT. The so-called AIPPT template is just a normal slide deck made in PPTist with type annotations. This data can be used not only for AI PPT generation, but also as general page templates.

## Annotation Types: Page Annotations and Node Annotations
#### Cover Page
* Title
* Content
* Image (background image, page illustration)
#### Table of Contents Page
* TOC Title (annotated as: List Item)
* Image (background image, page illustration)
#### Transition Page (Chapter Divider)
* Title
* Content
* Section Number
* Image (background image, page illustration)
#### Content Page
* Title
* 2–4 content items, including:
  * Item Title (annotated as: List Item Title)
  * Item Content (annotated as: List Item)
  * Item Number (annotated as: Item Number)
* Image (background image, page illustration, item illustration)
#### Ending Page (Thank You Page)
* Image (background image, page illustration)

> Node annotations are divided into two types - text annotations and image annotations:
> - Text annotations can be applied to text nodes and shape nodes that contain text;
> - Image annotations only apply to image nodes;
> - You can add more types of annotations yourself (like charts).

## AIPPT Template Creation Principles
A template used for AIPPT should contain at least the following pages (at least 13 pages, but 30+ pages recommended):
* 1 Cover page (2+ recommended)
* 6 Table of Contents pages: 1 each for 2 to 6 items, and 1 for 10 items (2 each recommended)
* 1 Transition page (3+ recommended)
* 4 Content pages: 1 each for 2 to 4 items, and 1 for 1 item (2 each recommended)
* 1 Ending page (2+ recommended)

> Note:
> 1. The page counts above only meet the minimum requirements of the current replacement logic. If you want the AI-generated PPT to have some randomness, you should increase the number of pages of each type (for example, if there are 3 cover pages in the template, one will be selected at random when generating);
> 2. Under the current replacement logic, the TOC page can support 1–20 TOC items, and the content page can support 1–12 content items, but you do not need to create templates for every possible quantity, as the application will automatically slice/splice templates to implement custom item counts;
> 3. You can adjust the replacement logic yourself to support more use cases.