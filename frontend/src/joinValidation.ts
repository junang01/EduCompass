
document.addEventListener("DOMContentLoaded", function () {
  const formElements = {
    uname: document.getElementById("uname") as HTMLInputElement,
    umail: document.getElementById("umail") as HTMLInputElement,
    pwd: document.getElementById("pwd") as HTMLInputElement,
    pwdcheck: document.getElementById("pwdcheck") as HTMLInputElement,
    school: document.getElementById("school") as HTMLInputElement,
    grade: document.getElementById("grade") as HTMLSelectElement,
    line: document.getElementById("line") as HTMLSelectElement
  };

  const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
  let isElementarySelected = false;

  function validateEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }

  function showError(input: HTMLElement, message: string): void {
    input.classList.add("input-error");

    const parent = input.parentElement;
    if (parent?.classList.contains("emailBox") || parent?.classList.contains("pemailBox") || parent?.classList.contains("schoolBox")) {
      parent.classList.add("input-error");
    }

    const small = (input.nextElementSibling ?? parent?.nextElementSibling) as HTMLElement | null;
    if (small && small.classList.contains("error-message")) {
      small.textContent = message;
    }
  }

  function clearError(input: HTMLElement): void {
    input.classList.remove("input-error");

    const parent = input.parentElement;
    if (parent?.classList.contains("emailBox") || parent?.classList.contains("pemailBox") || parent?.classList.contains("schoolBox")) {
      parent.classList.remove("input-error");
    }

    const small = (input.nextElementSibling ?? parent?.nextElementSibling) as HTMLElement | null;
    if (small && small.classList.contains("error-message")) {
      small.textContent = "";
    }
  }

  function validateForm(): boolean {
    let isValid = true;

    if (!formElements.uname.value.trim()) {
      showError(formElements.uname, "이름을 입력해주세요.");
      isValid = false;
    } else {
      clearError(formElements.uname);
    }

    const emailValue = formElements.umail.value.trim();
    if (!emailValue) {
      showError(formElements.umail, "이메일을 입력해주세요.");
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      showError(formElements.umail, "올바른 이메일 형식을 입력해주세요.");
      isValid = false;
    } else {
      clearError(formElements.umail);
    }

    if (!validatePassword(formElements.pwd.value.trim())) {
      showError(formElements.pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.");
      isValid = false;
    } else {
      clearError(formElements.pwd);
    }

    if (formElements.pwd.value.trim() !== formElements.pwdcheck.value.trim()) {
      showError(formElements.pwdcheck, "비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      clearError(formElements.pwdcheck);
    }

    if (!formElements.school.value.trim()) {
      showError(formElements.school, "학교를 선택해주세요.");
      isValid = false;
    } else {
      clearError(formElements.school);
    }

    if (formElements.grade.value === "0") {
      formElements.grade.classList.add("input-error");
      (document.getElementById("grade-error") as HTMLElement).textContent = "학년을 선택해주세요.";
      isValid = false;
    } else {
      formElements.grade.classList.remove("input-error");
      (document.getElementById("grade-error") as HTMLElement).textContent = "";
    }

    if (!isElementarySelected && formElements.line.value === "0") {
      formElements.line.classList.add("input-error");
      (document.getElementById("line-error") as HTMLElement).textContent = "계열을 선택해주세요.";
      isValid = false;
    } else {
      formElements.line.classList.remove("input-error");
      (document.getElementById("line-error") as HTMLElement).textContent = "";
    }

    return isValid;
  }

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (validateForm()) {
      window.location.href = "joinComplete.html";
    }
  });

  function updateGradeOptions(schoolName: string): void {
    const gradeSelect = formElements.grade;
    const lineSelect = formElements.line;

    const isElementary = schoolName.includes("초등학교");
    isElementarySelected = isElementary;

    gradeSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "0";
    defaultOption.textContent = "학년";
    gradeSelect.appendChild(defaultOption);

    const maxGrade = isElementary ? 6 : 3;
    for (let i = 1; i <= maxGrade; i++) {
      const option = document.createElement("option");
      option.value = i.toString();
      option.textContent = `${i}학년`;
      gradeSelect.appendChild(option);
    }

    if (isElementary) {
      lineSelect.value = "0";
      lineSelect.disabled = true;
    } else {
      lineSelect.disabled = false;
    }

    if (formElements.school.value.trim()) {
      clearError(formElements.school);
    }
  }


  window.updateGradeOptions = updateGradeOptions;

  formElements.school.addEventListener("input", () => {
    updateGradeOptions(formElements.school.value);
  });

  formElements.uname.addEventListener("input", () => {
    !formElements.uname.value.trim() ? showError(formElements.uname, "이름을 입력해주세요.") : clearError(formElements.uname);
  });

  formElements.umail.addEventListener("input", () => {
    const email = formElements.umail.value.trim();
    if (!email) {
      showError(formElements.umail, "이메일을 입력해주세요.");
    } else if (!validateEmail(email)) {
      showError(formElements.umail, "올바른 이메일 형식을 입력해주세요.");
    } else {
      clearError(formElements.umail);
    }
  });

  formElements.pwd.addEventListener("input", () => {
    !validatePassword(formElements.pwd.value.trim())
      ? showError(formElements.pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.")
      : clearError(formElements.pwd);
  });

  formElements.pwdcheck.addEventListener("input", () => {
    formElements.pwd.value.trim() !== formElements.pwdcheck.value.trim()
      ? showError(formElements.pwdcheck, "비밀번호가 일치하지 않습니다.")
      : clearError(formElements.pwdcheck);
  });

  formElements.school.addEventListener("input", () => {
    !formElements.school.value.trim()
      ? showError(formElements.school, "학교를 선택해주세요.")
      : clearError(formElements.school);
  });

  formElements.grade.addEventListener("change", () => {
    if (formElements.grade.value === "0") {
      formElements.grade.classList.add("input-error");
      (document.getElementById("grade-error") as HTMLElement).textContent = "학년을 선택해주세요.";
    } else {
      formElements.grade.classList.remove("input-error");
      (document.getElementById("grade-error") as HTMLElement).textContent = "";
    }
  });

  formElements.line.addEventListener("change", () => {
    if (isElementarySelected) {
      formElements.line.classList.remove("input-error");
      (document.getElementById("line-error") as HTMLElement).textContent = "";
      return;
    }

    if (formElements.line.value === "0") {
      formElements.line.classList.add("input-error");
      (document.getElementById("line-error") as HTMLElement).textContent = "계열을 선택해주세요.";
    } else {
      formElements.line.classList.remove("input-error");
      (document.getElementById("line-error") as HTMLElement).textContent = "";
    }
  });
});
