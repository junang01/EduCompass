// 외부에서 접근 가능한 상태를 유지하기 위한 변수
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
  const uname = document.getElementById("uname") as HTMLInputElement;
  const umail = document.getElementById("umail") as HTMLInputElement;
  const pwd = document.getElementById("pwd") as HTMLInputElement;
  const pwdcheck = document.getElementById("pwdcheck") as HTMLInputElement;
  const school = document.getElementById("school") as HTMLInputElement;
  const grade = document.getElementById("grade") as HTMLSelectElement;
  const line = document.getElementById("line") as HTMLSelectElement;

  let isValid = true;

  if (!uname.value.trim()) {
    showError(uname, "이름을 입력해주세요.");
    isValid = false;
  } else {
    clearError(uname);
  }

  const emailValue = umail.value.trim();
  if (!emailValue) {
    showError(umail, "이메일을 입력해주세요.");
    isValid = false;
  } else if (!validateEmail(emailValue)) {
    showError(umail, "올바른 이메일 형식을 입력해주세요.");
    isValid = false;
  } else {
    clearError(umail);
  }

  if (!validatePassword(pwd.value.trim())) {
    showError(pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.");
    isValid = false;
  } else {
    clearError(pwd);
  }

  if (pwd.value.trim() !== pwdcheck.value.trim()) {
    showError(pwdcheck, "비밀번호가 일치하지 않습니다.");
    isValid = false;
  } else {
    clearError(pwdcheck);
  }

  if (!school.value.trim()) {
    showError(school, "학교를 선택해주세요.");
    isValid = false;
  } else {
    clearError(school);
  }

  if (grade.value === "0") {
    grade.classList.add("input-error");
    (document.getElementById("grade-error") as HTMLElement).textContent = "학년을 선택해주세요.";
    isValid = false;
  } else {
    grade.classList.remove("input-error");
    (document.getElementById("grade-error") as HTMLElement).textContent = "";
  }

  if (!isElementarySelected && line.value === "0") {
    line.classList.add("input-error");
    (document.getElementById("line-error") as HTMLElement).textContent = "계열을 선택해주세요.";
    isValid = false;
  } else {
    line.classList.remove("input-error");
    (document.getElementById("line-error") as HTMLElement).textContent = "";
  }

  return isValid;
}

// ✅ 외부에서 버튼 클릭 시 호출할 유효성 검사 함수
export function validateJoinForm(): boolean {
  return validateForm();
}

// ✅ 페이지 로드 후 유효성 검사 이벤트 바인딩
export function joinValidation(): void {
  setTimeout(() => {
    const uname = document.getElementById("uname") as HTMLInputElement | null;
    const umail = document.getElementById("umail") as HTMLInputElement | null;
    const pwd = document.getElementById("pwd") as HTMLInputElement | null;
    const pwdcheck = document.getElementById("pwdcheck") as HTMLInputElement | null;
    const school = document.getElementById("school") as HTMLInputElement | null;
    const grade = document.getElementById("grade") as HTMLSelectElement | null;
    const line = document.getElementById("line") as HTMLSelectElement | null;

    if (!uname || !umail || !pwd || !pwdcheck || !school || !grade || !line) {
      console.warn("❌ DOM 요소를 찾을 수 없습니다. joinValidation 실패");
      return;
    }

    function updateGradeOptions(schoolName: string): void {
      const grade = document.getElementById("grade") as HTMLSelectElement;
      const line = document.getElementById("line") as HTMLSelectElement;
      const school = document.getElementById("school") as HTMLInputElement;
      

      const isElementary = schoolName.includes("초등학교");
      isElementarySelected = isElementary;

      grade.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "0";
      defaultOption.textContent = "학년";
      grade.appendChild(defaultOption);

      const maxGrade = isElementary ? 6 : 3;
      for (let i = 1; i <= maxGrade; i++) {
        const option = document.createElement("option");
        option.value = i.toString();
        option.textContent = `${i}학년`;
        grade.appendChild(option);
      }

      if (isElementary) {
        line.value = "0";
        line.disabled = true;
      } else {
        line.disabled = false;
      }

      if (school.value.trim()) {
        clearError(school);
      }
    }

    // ✅ 전역 등록
    window.updateGradeOptions = updateGradeOptions;

    // ✅ 실시간 유효성 검사 이벤트 등록
    uname.addEventListener("input", () => {
      uname.value.trim()
        ? clearError(uname)
        : showError(uname, "이름을 입력해주세요.");
    });

    umail.addEventListener("input", () => {
      const email = umail.value.trim();
      if (!email) {
        showError(umail, "이메일을 입력해주세요.");
      } else if (!validateEmail(email)) {
        showError(umail, "올바른 이메일 형식을 입력해주세요.");
      } else {
        clearError(umail);
      }
    });

    pwd.addEventListener("input", () => {
      validatePassword(pwd.value.trim())
        ? clearError(pwd)
        : showError(pwd, "8자 이상, 숫자/소문자/특수문자를 포함해야 합니다.");
    });

    pwdcheck.addEventListener("input", () => {
      pwd.value.trim() === pwdcheck.value.trim()
        ? clearError(pwdcheck)
        : showError(pwdcheck, "비밀번호가 일치하지 않습니다.");
    });

    school.addEventListener("input", () => {
      school.value.trim()
        ? clearError(school)
        : showError(school, "학교를 선택해주세요.");
    });

    grade.addEventListener("change", () => {
      if (grade.value === "0") {
        grade.classList.add("input-error");
        (document.getElementById("grade-error") as HTMLElement).textContent = "학년을 선택해주세요.";
      } else {
        grade.classList.remove("input-error");
        (document.getElementById("grade-error") as HTMLElement).textContent = "";
      }
    });

    line.addEventListener("change", () => {
      if (isElementarySelected) {
        line.classList.remove("input-error");
        (document.getElementById("line-error") as HTMLElement).textContent = "";
        return;
      }

      if (line.value === "0") {
        line.classList.add("input-error");
        (document.getElementById("line-error") as HTMLElement).textContent = "계열을 선택해주세요.";
      } else {
        line.classList.remove("input-error");
        (document.getElementById("line-error") as HTMLElement).textContent = "";
      }
    });
  }, 100); // 🔥 DOM 완성 이후에 바인딩
}
