import { createRef } from "react";
import * as htmlToImage from "html-to-image";
import { createFileName } from "use-react-screenshot";

export default function  ScreenShot() {
  const ref = createRef(null)
  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toJpeg(node);
    return dataURI;
  };

  const download = (image, { name = "screenshot", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);
  return (
    <div className="App">
        <header className="App-header">
            <button onClick={downloadScreenshot}>
                Download screenshot
            </button>
            {/* Here goes the thing that we will take the screenshot of */}
            <div ref={ref} className='w-96 h-96 bg-gray-500 flex items-center justify-center'>
                <h1>hello</h1>
            </div>
        </header>
    </div>
  )
}