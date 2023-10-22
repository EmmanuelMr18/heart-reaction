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
    duration: 1100,
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

function displayFreePositionHeart({ event, canvasElement, heartSize }) {
  // Get the tap position relative to the target element
  const canvasMeta = canvasElement.getBoundingClientRect();
  const tapX = event.clientX - canvasMeta.left - heartSize / 2;
  const tapY = event.clientY - canvasMeta.top - heartSize / 2;

  return [tapX, tapY];
}

function displayCenterHeart({ heartSize, canvasElement }) {
  const canvasMeta = canvasElement.getBoundingClientRect();
  const canvasXPosition = canvasMeta.left;
  const canvasYPosition = canvasMeta.top;

  const canvasWidth = canvasMeta.width;
  const canvasHeight = canvasMeta.height;

  const tapX = canvasWidth / 2 - heartSize / 2;
  const tapY = canvasHeight / 2 - heartSize / 2;

  return [tapX, tapY];
}

function test(e) {}
export function HeartReaction({
  heartSize,
  heartFreemode,
  enableRotation,
  canvasElement,
  icon,
  onSlingleClick,
}) {
  canvasElement.addEventListener("click", handleTap);
  if (!handleTap) {
    return;
  }
  let waitingForSecondTap = false;
  let animationInProgress = false;
  function handleTap(event) {
    if (animationInProgress) {
      return;
    }
    // User have 500ms to tap again and continue with the animation
    if (waitingForSecondTap === false) {
      waitingForSecondTap = true;
      // After 500ms stop waiting for the second tap
      setTimeout(() => {
        if (waitingForSecondTap === true) {
          onSlingleClick();
          waitingForSecondTap = false;
        }
      }, 250);
      return;
    }
    waitingForSecondTap = false;
    animationInProgress = true;

    // Create heart element
    const heartElement = document.createElement("img");
    heartElement.src = icon;

    disableElementDragAndDrop(heartElement);
    let positionX, positionY;

    if (heartFreemode) {
      const [x, y] = displayFreePositionHeart({
        event,
        canvasElement,
        heartSize,
      });
      positionX = x;
      positionY = y;
    } else {
      const [x, y] = displayCenterHeart({ canvasElement, heartSize });
      positionX = x;
      positionY = y;
    }
    addStyles(heartElement, positionX, positionY, heartSize);

    // Randomly choose an angle (just like in tiktok)
    const rotationValue = enableRotation
      ? heartAngles[Math.floor(Math.random() * 3)]
      : 0;

    heartAnimation(heartElement, rotationValue, positionX, positionY);

    canvasElement.appendChild(heartElement);

    // remove the dom element (heart) 50ms before the animation ends, this is due to an odd behavior that shows the image for a couple of ms when the animation finishes.
    setTimeout(() => {
      heartElement.remove();
      animationInProgress = false;
    }, 1050);
  }

  return {
    removeEventListener() {
      canvasElement.removeEventListener("click", handleTap);
    },
  };
}
