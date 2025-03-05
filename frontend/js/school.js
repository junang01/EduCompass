const openModal = document.getElementById("openSchoolModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");

    // 모달 열기
    openModal.addEventListener("click", () => {
      modal.style.display = "block";
      overlay.style.display = "block";
    });

    // 모달 닫기
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    });

    // 배경 클릭 시 모달 닫기
    overlay.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    });

    // 학교 검색 기능
    document.getElementById("search").addEventListener("click", () => {
      const schoolName = document.getElementById("schoolSearch").value.trim();

      if (!schoolName) {
        alert("학교 이름을 입력하세요.");
        return;
      }

      const apiKey = "498e421b6ad84ace9deb49e28d3b39a7"; // NEIS OpenAPI 키
      const apiUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${apiKey}&Type=json&SCHUL_NM=${encodeURIComponent(schoolName)}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("API 호출 실패");
          }
          return response.json();
        })
        .then((data) => {
          const resultsDiv = document.getElementById("results");
          resultsDiv.innerHTML = ""; // 이전 결과 초기화

          if (data.schoolInfo) {
            const schools = data.schoolInfo[1].row;
            schools.forEach((school) => {
              const schoolInfoDiv = document.createElement("div");
              schoolInfoDiv.classList.add("school-detail");
              schoolInfoDiv.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                  <strong>${school.SCHUL_NM}</strong> (${school.SCHUL_KND_SC_NM})<br>
                  주소: ${school.ORG_RDNMA}<br>
                  <button class="selectSchool">이 학교 선택</button>
                </div>
              `;
              schoolInfoDiv.querySelector(".selectSchool").addEventListener("click", () => {
                // 학교 이름을 입력 필드에 채우기
                document.getElementById("school").value = school.SCHUL_NM;

                // 모달 닫기
                modal.style.display = "none";
                overlay.style.display = "none";
              });
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
    });