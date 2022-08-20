let formElement = document.forms["formElement"];

formElement.addEventListener("focus",(evt) => {
    let activeElement = formElement.querySelector(".focused");
    if (activeElement) {
      activeElement.classList.remove("focused");
    }
    evt.target.classList.add("focused");
  },
  true
);

formElement.addEventListener("blur", () => {
    let activeElement = formElement.querySelector(".focused");
    if (activeElement) {
      activeElement.classList.remove("focused");
    }
  },
  true
);
