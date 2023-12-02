import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [predictClass, setPredictClass] = useState("");

  function handleDropArea() {
    let dropArea = document.getElementById("uploadArea") as HTMLElement;

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea!.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e: Event) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ["dragenter", "dragover"].forEach((eventName) => {
    //   dropArea.addEventListener(eventName, highlight, false);
    // });
    // ["dragleave", "drop"].forEach((eventName) => {
    //   dropArea.addEventListener(eventName, unhighlight, false);
    // });

    // function highlight() {
    //   dropArea.classList.add("border-[#333]");
    // }

    // function unhighlight() {
    //   dropArea.classList.remove("border-[#9ba5c0]");
    // }

    dropArea.addEventListener("drop", handleDrop, false);

    function handleDrop(e : DragEvent) {

      const fileInput = document.querySelector("#fileInput") as HTMLInputElement;

      let dt = e.dataTransfer;
      let files : FileList = dt!.files;
      
      fileInput.files = files;

      handleFileChange();
    }
  }

  async function handleSubmit() {
    const formData = new FormData();
    const fileInput = document.querySelector("#fileInput") as HTMLInputElement;

    formData.append("file", fileInput.files![0]);

    const res = await fetch("http://127.0.0.1:8000/prediction/", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setPredictClass(json.pred_classname);
  }

  function handleFileChange() {
    const fileInput = document.querySelector("#fileInput") as HTMLInputElement;
    previewFileChange(fileInput.files!);
  }

  function previewFileChange(files: FileList) {
    if (files!.length > 0) {
      var src = URL.createObjectURL(files![0]);
      var preview = document.getElementById("previewImage") as HTMLImageElement;
      preview.src = src;
      preview.style.display = "block";

      var uploadbox = document.querySelector("#uploadBox") as HTMLElement;
      uploadbox.style.display = "none";
    }
  }

  function handleRemoveImage() {
    var preview = document.getElementById("previewImage") as HTMLImageElement;
    preview.style.display = "none";

    var uploadbox = document.querySelector("#uploadBox") as HTMLElement;
    uploadbox.style.display = "block";

    const fileInput = document.querySelector("#fileInput") as HTMLInputElement;
    fileInput.value = "";
    setPredictClass("");
  }

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center bg-[#51596d]">
      <div className="text-6xl text-blue-200 py-5 font-medium font-mono">
        Traffic Sign Recoginzer
      </div>
      <hr className="w-full border-t-2 border-gray-500" />
      
      <div className="container bg-[#dce2f0] w-fit h-96 my-10 m-auto rounded-3xl p-2">
        <img id="previewImage" className="h-[370px] rounded-3xl hidden" />
        <div id="uploadBox">
          <div className="flex flex-col items-center m-5">
            <h1 className="text-4xl font-bold my-3">Upload your Image</h1>
            <h3 className="text-l font-medium">PNG, JPG files are allowed</h3>
          </div>
          <div
            id="uploadArea"
            onDrag={handleDropArea}
            onDragOver={handleDropArea}
            onDragEnter={handleDropArea}
            onDragLeave={handleDropArea}
            className="bg-[#eff3fc] m-3 p-5 h-52 px-44 border-dashed rounded-3xl border-[#9ba5c0] border-4 flex flex-col justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={100}
              width={100}
              viewBox="0 0 640 512"
              className="mb-3"
            >
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                fill="#787f91"
              />
            </svg>
            <input
              name="image"
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              hidden
            ></input>
            <h4 className="font-medium">
              Drag and Drop your image or{" "}
              <label
                htmlFor="fileInput"
                className="cursor-pointer underline decoration-indigo-500"
              >
                Browse
              </label>
            </h4>
          </div>
        </div>
      </div>
      <div className="flex w-64 justify-between">
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-400 py-2 pr-4 pl-4 rounded-xl text-xl font-medium"
        >
          Predict
        </button>
        <button
          onClick={handleRemoveImage}
          className="bg-red-400 py-2 pr-5 pl-5 rounded-xl text-xl font-medium"
        >
          Clear
        </button>
      </div>
      <h2 className="text-5xl m-10 p-2 font-medium text-green-400">
        {predictClass}
      </h2>
    </div>
  );
};

export default Home;
