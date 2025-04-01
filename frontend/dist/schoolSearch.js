const openModal = document.getElementById("openSchoolModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
// 모달 열기
if (openModal && modal && overlay) {
    openModal.addEventListener("click", () => {
        console.log("✅ 모달 열기 버튼 클릭됨");
        modal.style.display = "block";
        overlay.style.display = "block";
    });
}
// 모달 닫기
if (closeModal && modal && overlay) {
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        overlay.style.display = "none";
    });
}
// 오버레이 클릭 시 닫기
if (overlay && modal) {
    overlay.addEventListener("click", () => {
        modal.style.display = "none";
        overlay.style.display = "none";
    });
}
// 학교 검색 버튼 클릭
const searchBtn = document.getElementById("search");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const schoolInput = document.getElementById("schoolSearch");
        const resultsDiv = document.getElementById("results");
        if (!schoolInput || !resultsDiv)
            return;
        const schoolName = schoolInput.value.trim();
        if (!schoolName) {
            alert("학교 이름을 입력하세요.");
            return;
        }
        const apiKey = "498e421b6ad84ace9deb49e28d3b39a7";
        const apiUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${apiKey}&Type=json&SCHUL_NM=${encodeURIComponent(schoolName)}`;
        fetch(apiUrl)
            .then((response) => {
            if (!response.ok) {
                throw new Error("API 호출 실패");
            }
            return response.json();
        })
            .then((data) => {
            resultsDiv.innerHTML = "";
            if (data.schoolInfo && data.schoolInfo.length > 1) {
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
                    const selectBtn = schoolInfoDiv.querySelector(".selectSchool");
                    if (selectBtn) {
                        selectBtn.addEventListener("click", () => {
                            const schoolField = document.getElementById("school");
                            if (schoolField) {
                                schoolField.value = school.SCHUL_NM;
                                if (typeof window.updateGradeOptions === "function") {
                                    window.updateGradeOptions(school.SCHUL_NM); // ✅ 안전하게 호출
                                }
                            }
                            if (modal && overlay) {
                                modal.style.display = "none";
                                overlay.style.display = "none";
                            }
                        });
                    }
                    resultsDiv.appendChild(schoolInfoDiv);
                });
            }
            else {
                resultsDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
            }
        })
            .catch((error) => {
            console.error("오류 발생:", error);
            alert("학교 정보를 가져오는 중 문제가 발생했습니다.");
        });
    });
}
export {};
