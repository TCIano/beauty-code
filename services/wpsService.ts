
export const isWpsEnv = (): boolean => {
  return typeof window.wps !== 'undefined';
};

/**
 * Inserts the generated image directly into the current PowerPoint slide.
 * Requires the app to be running inside WPS Office with OA Assist enabled.
 */
export const insertImageToSlide = async (base64Data: string): Promise<void> => {
  if (!isWpsEnv()) {
    throw new Error("WPS Environment not detected.");
  }

  try {
    const wps = window.wps!;
    
    // 1. Prepare file path in temp directory
    // Note: WPS JS plugins usually have access to a FileSystem object to handle local files
    // implementation varies by WPS version, this targets the standard OA Assist API.
    const fs = wps.FileSystem;
    const env = wps.Env;
    
    if (!fs || !env) {
        throw new Error("WPS FileSystem API not available.");
    }

    const tempPath = env.GetTempPath() + "/codesnap_temp_" + Date.now() + ".png";
    
    // 2. Write Base64 to file (removing header)
    const rawBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");
    fs.WriteDecodeBase64ToFile(tempPath, rawBase64);

    // 3. Insert into PowerPoint
    const app = wps.WppApplication();
    const slide = app.ActiveWindow.View.Slide;
    
    if (!slide) {
        throw new Error("No active slide selected.");
    }

    // AddPicture(FileName, LinkToFile, SaveWithDocument, Left, Top, Width, Height)
    // 0 = msoFalse (LinkToFile), -1 = msoTrue (SaveWithDocument)
    const shape = slide.Shapes.AddPicture(tempPath, 0, -1, 100, 100);
    
    // Select the new shape to provide feedback
    shape.Select();

  } catch (error) {
    console.error("WPS Insert Error:", error);
    throw new Error("Failed to insert into WPS Slide. " + (error as Error).message);
  }
};
