const taglines = [
  "Make it smol. Send it fast.",
  "Smash 50MB into 10MB. Smol magic.",
  "From chunky to chibi.",
  "Because size does matter.",
  "Make your file smol and cute like you.",
];

let taglineIndex = 0;
setInterval(() => {
  taglineIndex = (taglineIndex + 1) % taglines.length;
  document.getElementById("tagline").innerText = taglines[taglineIndex];
}, 4000);

function compressVideo() {
  const url = document.getElementById("videoUrl").value;
  const progress = document.querySelector(".progress");
  const progressBar = document.getElementById("progressBar");
  const message = document.getElementById("message");
  const downloadSection = document.getElementById("downloadSection");

  if (!url) {
    alert("Please enter a video URL!");
    return;
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    alert(
      "YouTube is currently unsupported. Try Instagram, Twitter, or Reddit instead."
    );
    return;
  }

  progress.style.display = "block";
  progressBar.style.width = "10%";
  message.innerText = "Downloading... 🍿";
  downloadSection.innerHTML = "";

  const formData = new FormData();
  formData.append("url", url);

  fetch("https://smolfile-backend-production.up.railway.app/compress", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      if (!response.ok) {
        // Try to parse the JSON error message
        let errMsg = "Compression failed";
        try {
          const errJson = await response.json();
          errMsg = errJson.error || errMsg;
        } catch (e) {
          // parsing failed, keep the generic error
        }
        throw new Error(errMsg);
      }
      progressBar.style.width = "75%";
      message.innerText = "Making it smol... 🔧✨";
      return response.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "smol_file.mp4";
      link.className = "download-link";
      link.innerText = "✨ Download your smol file ✨";
      downloadSection.appendChild(link);
      progressBar.style.width = "100%";
      message.innerText = "Done! Your smol file is ready 🎁";
    })
    .catch((error) => {
      console.error("Compression error:", error);
      progressBar.style.width = "0%";
      // Display the specific error message
      message.innerText = error.message;
    });
  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("compressBtn")
      .addEventListener("click", compressVideo);
  });
}
