import React, { useState } from 'react';
import '../css/plancallstyle.css';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

const PlanCallPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const navigate = useNavigate();

  const dummyPlans: Plan[] = [
    { id: 1, title: '수학 영어 중간고사', startDate: '2025-06-11', endDate: '2025-07-01' },
    { id: 2, title: '중간고사 대비', startDate: '2025-06-15', endDate: '2025-07-10' },
    { id: 3, title: '영어 내신 기출 분석', startDate: '2025-07-01', endDate: '2025-07-31' }
  ];

  const handleLoadPlans = () => {
    setPlans(dummyPlans);
  };

  const handleCheckboxChange = (planId: number) => {
    setSelectedPlanId(planId);
  };

  const handleConfirm = () => {
    if (!selectedPlanId) {
      alert("계획을 선택해주세요!");
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
    navigate('/plan', { state: { selectedPlan } });
  };

  const handleCancel = () => {
    setSelectedPlanId(null);
  };

  return (
    <div className="container">
      <h2 className="title">조정할 계획 불러오기</h2>

      <button className="load-btn" onClick={handleLoadPlans}>
        계획 목록 불러오기
      </button>

      <table className="plan-table">
        <thead>
          <tr>
            <th>선택</th>
            <th>계획 이름</th>
            <th>계획 기간</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPlanId === plan.id}
                  onChange={() => handleCheckboxChange(plan.id)}
                />
              </td>
              <td>{plan.title}</td>
              <td>{plan.startDate} ~ {plan.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-container">
        <button className="cancel-btn" onClick={handleCancel}>취소</button>
        <button className="confirm-btn" onClick={handleConfirm}>확인</button>
      </div>
    </div>
  );
};

export default PlanCallPage;
