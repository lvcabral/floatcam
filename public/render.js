window.addEventListener("DOMContentLoaded", function () {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      var video = document.querySelector("video");
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  window.electronAPI.onMessageReceived(
    "shared-window-channel",
    function (_, message) {
      console.log("message", message);
    }
  );
});
