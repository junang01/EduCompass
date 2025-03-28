document.addEventListener("DOMContentLoaded", function () {
  const formElements = {
    uname: document.getElementById("uname"),
    umail: document.getElementById("umail"),
    pwd: document.getElementById("pwd"),
    pwdcheck: document.getElementById("pwdcheck"),
    school: document.getElementById("school"),
    grade: document.getElementById("grade"),
    line: document.getElementById("line")
  };

  const submitButton = document.getElementById("submitButton");
  let isElementarySelected = false;

  function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }

  function showError(input, message) {
    input.classList.add("input-error");
    if (
      input.parentElement.classList.contains("emailBox") ||
      input.parentElement.classList.contains("pemailBox") ||
      input.parentElement.classList.contains("schoolBox")
    ) {
      input.parentElement.classList.add("input-error");
    }

    const small = input.nextElementSibling || input.parentElement.nextElementSibling;
    if (small && small.classList.contains("error-message")) {
      small.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove("input-error");
    if (
      input.parentElement.classList.contains("emailBox") ||
      input.parentElement.classList.contains("pemailBox") ||
      input.parentElement.classList.contains("schoolBox")
    ) {
      input.parentElement.classList.remove("input-error");
    }

    const small = input.nextElementSibling || input.parentElement.nextElementSibling;
    if (small && small.classList.contains("error-message")) {
      small.textContent = "";
    }
  }

  function validateForm() {
    let isValid = true;

    // 이름
    if (!formElements.uname.value.trim()) {
      showError(formElements.uname, "이름을 입력해주세요.");
      isValid = false;
    } else {
      clearError(formElements.uname);
    }

    // 이메일
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

    // 비밀번호
    if (!validatePassword(formElements.pwd.value.trim())) {
      showError(formElements.pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.");
      isValid = false;
    } else {
      clearError(formElements.pwd);
    }

    // 비밀번호 확인
    if (formElements.pwd.value.trim() !== formElements.pwdcheck.value.trim()) {
      showError(formElements.pwdcheck, "비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      clearError(formElements.pwdcheck);
    }

    // 학교
    if (!formElements.school.value.trim()) {
      showError(formElements.school, "학교를 선택해주세요.");
      isValid = false;
    } else {
      clearError(formElements.school);
    }

    // 학년
    if (formElements.grade.value === "0") {
      formElements.grade.classList.add("input-error");
      document.getElementById("grade-error").textContent = "학년을 선택해주세요.";
      isValid = false;
    } else {
      formElements.grade.classList.remove("input-error");
      document.getElementById("grade-error").textContent = "";
    }

    // 계열
    if (!isElementarySelected && formElements.line.value === "0") {
      formElements.line.classList.add("input-error");
      document.getElementById("line-error").textContent = "계열을 선택해주세요.";
      isValid = false;
    } else {
      formElements.line.classList.remove("input-error");
      document.getElementById("line-error").textContent = "";
    }

    return isValid;
  }

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      window.location.href = "joinComplete.html";
    }
  });

  function updateGradeOptions(schoolName) {
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

    // ✅ 학교 입력 시 유효성 제거
    if (formElements.school.value.trim()) {
      clearError(formElements.school);
    }
  }

  window.updateGradeOptions = updateGradeOptions;

  formElements.school.addEventListener("input", function () {
    updateGradeOptions(formElements.school.value);
  });

  // ✅ 실시간 유효성 검사
  formElements.uname.addEventListener("input", () => {
    if (!formElements.uname.value.trim()) {
      showError(formElements.uname, "이름을 입력해주세요.");
    } else {
      clearError(formElements.uname);
    }
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
    const pwd = formElements.pwd.value.trim();
    if (!validatePassword(pwd)) {
      showError(formElements.pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.");
    } else {
      clearError(formElements.pwd);
    }
  });

  formElements.pwdcheck.addEventListener("input", () => {
    if (formElements.pwd.value.trim() !== formElements.pwdcheck.value.trim()) {
      showError(formElements.pwdcheck, "비밀번호가 일치하지 않습니다.");
    } else {
      clearError(formElements.pwdcheck);
    }
  });

  formElements.school.addEventListener("input", () => {
    if (!formElements.school.value.trim()) {
      showError(formElements.school, "학교를 선택해주세요.");
    } else {
      clearError(formElements.school);
    }
  });

  // ✅ 학년 실시간 검사
  formElements.grade.addEventListener("change", () => {
    if (formElements.grade.value === "0") {
      formElements.grade.classList.add("input-error");
      document.getElementById("grade-error").textContent = "학년을 선택해주세요.";
    } else {
      formElements.grade.classList.remove("input-error");
      document.getElementById("grade-error").textContent = "";
    }
  });

  // ✅ 계열 실시간 검사
  formElements.line.addEventListener("change", () => {
    if (isElementarySelected) {
      // 초등학교는 계열 선택 무시
      formElements.line.classList.remove("input-error");
      document.getElementById("line-error").textContent = "";
      return;
    }
  
    if (formElements.line.value === "0") {
      formElements.line.classList.add("input-error");
      document.getElementById("line-error").textContent = "계열을 선택해주세요.";
    } else {
      formElements.line.classList.remove("input-error");
      document.getElementById("line-error").textContent = "";
    }
  });
  
});
