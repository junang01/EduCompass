// schoolSearch.ts

// 윈도우 객체 확장 선언
declare global {
  interface Window {
    updateGradeOptions?: (schoolName: string) => void;
  }
}

export function openSchoolSearchModal(): void {
  const modal = document.getElementById("modal") as HTMLElement | null;
  const overlay = document.getElementById("overlay") as HTMLElement | null;
  const closeModal = document.getElementById("closeModal") as HTMLElement | null;
  const searchBtn = document.getElementById("search") as HTMLButtonElement | null;

  if (!modal || !overlay) return;

  // 모달 열기
  modal.style.display = "block";
  overlay.style.display = "block";

  // 모달 닫기 버튼
  if (closeModal) {
    closeModal.onclick = () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    };
  }

  // 오버레이 클릭 시 닫기
  overlay.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  };

  // 검색 버튼
  if (searchBtn) {
    searchBtn.onclick = () => {
      const schoolInput = document.getElementById("schoolSearch") as HTMLInputElement | null;
      const resultsDiv = document.getElementById("results") as HTMLElement | null;

      if (!schoolInput || !resultsDiv) return;

      const schoolName = schoolInput.value.trim();
      if (!schoolName) {
        alert("학교 이름을 입력하세요.");
        return;
      }

      const apiKey = "498e421b6ad84ace9deb49e28d3b39a7";
      const apiUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${apiKey}&Type=json&SCHUL_NM=${encodeURIComponent(schoolName)}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) throw new Error("API 호출 실패");
          return response.json();
        })
        .then((data) => {
          resultsDiv.innerHTML = "";

          if (data.schoolInfo && data.schoolInfo.length > 1) {
            const schools = data.schoolInfo[1].row;
            schools.forEach((school: any) => {
              const schoolInfoDiv = document.createElement("div");
              schoolInfoDiv.classList.add("school-detail");
              schoolInfoDiv.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                  <strong>${school.SCHUL_NM}</strong> (${school.SCHUL_KND_SC_NM})<br>
                  주소: ${school.ORG_RDNMA}<br>
                  <button class="selectSchool">이 학교 선택</button>
                </div>
              `;

              const selectBtn = schoolInfoDiv.querySelector(".selectSchool") as HTMLButtonElement | null;
              if (selectBtn) {
                selectBtn.addEventListener("click", () => {
                  const schoolField = document.getElementById("school") as HTMLInputElement | null;
                  if (schoolField) {
                    schoolField.value = school.SCHUL_NM;

                    if (typeof window.updateGradeOptions === "function") {
                      window.updateGradeOptions(school.SCHUL_NM); // 안전 호출
                    }
                  }

                  modal.style.display = "none";
                  overlay.style.display = "none";
                });
              }

              resultsDiv.appendChild(schoolInfoDiv);
            });
          } else {
            resultsDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
          }
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          alert("학교 정보를 가져오는 중 문제가 발생했습니다.");
        });
    };
  }
}
