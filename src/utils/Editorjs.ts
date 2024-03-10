// @ts-ignore
import ImageTool from "@editorjs/image";
import { deleteFromCloud } from "./deleteFromCloudinary";

export class MyImageTool extends ImageTool {
  removed() {
    const data = (this as any)._data;
    deleteFromCloud(data.file.url)
      .then(() => console.log("Image successfully deleted"))
      .catch((error) => console.log("Error in removing the image"));
  }
}
