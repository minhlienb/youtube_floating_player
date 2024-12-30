(async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    const videoId = clipboardText.match(/(?:https?:\\/\\/)?(?:www\\.)?youtu(?:\\.be\\/|be\\.com\\/(?:watch\\?v=|embed\\/|v\\/|shorts\\/))([\\w-]{11})/);
    if (!videoId) {
      alert("URL không hợp lệ hoặc không phải video YouTube.");
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
    const floatDiv = document.createElement("div");
    floatDiv.style.position = "fixed";
    floatDiv.style.top = "10%";
    floatDiv.style.left = "10%";
    floatDiv.style.width = "80%";
    floatDiv.style.height = "80%";
    floatDiv.style.backgroundColor = "white";
    floatDiv.style.border = "2px solid black";
    floatDiv.style.zIndex = "99999";
    floatDiv.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.2)";
    floatDiv.style.borderRadius = "8px";

    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    const closeButton = document.createElement("button");
    closeButton.innerText = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "red";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "8px 12px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.borderRadius = "4px";

    closeButton.onclick = () => {
      document.body.removeChild(floatDiv);
    };

    floatDiv.appendChild(closeButton);
    floatDiv.appendChild(iframe);
    document.body.appendChild(floatDiv);
  } catch (error) {
    alert("Không thể đọc từ clipboard. Hãy chắc chắn bạn đã copy URL video YouTube.");
    console.error(error);
  }
})();