// Tạo context menu khi cài đặt extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openFloatingPlayer",
    title: "Open YouTube Floating Player",
    contexts: ["link"]
  });
});

// Lắng nghe sự kiện từ menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openFloatingPlayer") {
    const videoUrl = info.linkUrl;

    // Kiểm tra và trích xuất video ID từ URL
    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      // Chạy script trong tab hiện tại để tạo cửa sổ nổi
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (embedUrl) => {
          // Tạo lớp phủ mờ nền
          const blurBackground = document.createElement("div");
          blurBackground.style.position = "fixed";
          blurBackground.style.top = "0";
          blurBackground.style.left = "0";
          blurBackground.style.width = "100%";
          blurBackground.style.height = "100%";
          blurBackground.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          blurBackground.style.backdropFilter = "blur(5px)";
          blurBackground.style.transition = "opacity 0.5s ease-in-out";
          blurBackground.style.opacity = "0.000002"; // Bắt đầu trong suốt // Chatgpt nó để ban đầu là 0 nhưng thực ra phải để 0.0001 vì 0 = null chứ không phải là số 0
          blurBackground.style.zIndex = "99998";
          document.body.appendChild(blurBackground);
      
          // Hiển thị lớp phủ (transition)
          requestAnimationFrame(() => {
            blurBackground.style.opacity = "1";
          });
      
          // Tạo cửa sổ nổi
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
          closeButton.style.top = "-40px";
          closeButton.style.right = "-40px";
          closeButton.style.background = "red";
          closeButton.style.color = "white";
          closeButton.style.border = "none";
          closeButton.style.padding = "8px 12px";
          closeButton.style.cursor = "pointer";
          closeButton.style.fontSize = "16px";
          closeButton.style.borderRadius = "4px";
      
          closeButton.onclick = () => {
            blurBackground.style.opacity = "0"; // Làm mờ dần khi đóng
            floatDiv.remove();
            setTimeout(() => blurBackground.remove(), 500); // Đợi hiệu ứng trước khi xóa
          };
      
          floatDiv.appendChild(closeButton);
          floatDiv.appendChild(iframe);
          document.body.appendChild(floatDiv);
        },
        args: [embedUrl]
      });
      
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Invalid URL",
        message: "The selected link is not a valid YouTube video URL."
      });
    }
  }
});