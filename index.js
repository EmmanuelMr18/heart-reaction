const heartAngles = [340, 0, 20];

function heartAnimation(element, rotation) {
  const deg = `${rotation}deg`;
  // Keyframes to create the animation
  // NOTE: Probably could be better, but I just want to release something and start using it.
  const keyframes = [
    { transform: `scale(1.3) rotate(${deg})` },
    { transform: `scale(1) rotate(${deg})` },
    { transform: `scale(1.1) rotate(${deg})`, opacity: 1 },
    {},
    { transform: `scale(1.1) rotate(${deg})` },
    { transform: `scale(1.2) rotate(${deg})`, opacity: 0.5 },
    { transform: `scale(2.2) rotate(${deg})`, opacity: 0 },
  ];

  const animationEffect = new KeyframeEffect(element, keyframes, {
    duration: 1300,
    iterations: 1,
  });

  const animationPlayer = new Animation(animationEffect, document.timeline);
  animationPlayer.play();
}

// disableElementDragAndDrop disable the possibility to drag and drop the heart image
function disableElementDragAndDrop(element) {
  element.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  element.addEventListener("drop", (event) => {
    event.preventDefault();
  });
}

// addStyles create the css styles to show the heart correctly
function addStyles(heartElement, tapX, tapY, heartSize) {
  // Set the image's position
  heartElement.style.left = `${tapX}px`; // X-coordinate
  heartElement.style.top = `${tapY}px`; // Y-coordinate
  heartElement.style.position = `absolute`;
  heartElement.style.userSelect = `none`;
  heartElement.style.width = `${heartSize}px`;
  heartElement.style.height = `${heartSize}px`;
}

function HeartReaction({ heartSize, enableRotation, canvasClassName }) {
  const target = document.getElementsByClassName(canvasClassName);
  target.addEventListener("click", handleTap);
  let secondTapWaiting = false;
  function handleTap(event) {
    // User have 500ms to tap again and continue with the animation
    if (secondTapWaiting === false) {
      secondTapWaiting = true;
      // After 500ms stop waiting for the second tap
      setTimeout(() => {
        secondTapWaiting = false;
      }, 500);
      return;
    }

    // Create heart element
    const heartElement = document.createElement("img");
    heartElement.src = "./heart-icon.png";

    disableElementDragAndDrop(heartElement);

    // Get the tap position relative to the target element
    const tapX = event.clientX - heartSize / 2;
    const tapY = event.clientY - heartSize / 2;
    addStyles(heartElement, tapX, tapY, heartSize);

    // Randomly choose an angle (just like in tiktok)
    const rotationValue = enableRotation
      ? heartAngles[Math.floor(Math.random() * 3)]
      : 0;
    
    heartAnimation(heartElement, rotationValue, tapX, tapY);

    document.body.appendChild(heartElement);

    // remove the dom element (heart) 50ms before the animation ends, this is due to an odd behavior that shows the image for a couple of ms when the animation finishes.
    setTimeout(() => {
      heartElement.remove();
    }, 1250);
  }
}
module.exports = HeartReaction

