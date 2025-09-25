import React, { useEffect, useState } from 'react';
import './changePlanSurvey1.css';
import { useNavigate } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';

interface Plan {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

const GET_MY_STUDY_PLANS = gql`
  query FindStudyPlans {
    findStudyPlans {
      id
      title
      studyPeriod
    }
  }
`;

const PlanCallPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [loadPlans, { loading, error, data }] = useLazyQuery<{ findStudyPlans: any[] }>(
    GET_MY_STUDY_PLANS,
    { fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    if (data?.findStudyPlans) {
      const mapped: Plan[] = data.findStudyPlans.map((p: any) => {
        const [sd, ed] = (p.studyPeriod || '').split('~').map((s: string) => s.trim());
        return { id: p.id, title: p.title, startDate: sd || '', endDate: ed || '' };
      });
      setPlans(mapped);
    }
  }, [data]);

  const handleLoadPlans = () => {
    loadPlans();
  };

  const handleCheckboxChange = (planId: number) => {
    setSelectedPlanId(planId);
  };

  const handleConfirm = () => {
    if (!selectedPlanId) {
      alert('계획을 선택해주세요!');
      return;
    }
    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    navigate("/changePlanSurvey2", { 
      state: { selectedPlan: { ...selectedPlan, id: Number(selectedPlan?.id) } } 
    });
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className='changePlan-bg'>
      <div className="changePlan-container">
        <h2 className="title">조정할 계획 불러오기</h2>

        <button className="load-btn" onClick={handleLoadPlans} disabled={loading}>
          {loading ? '불러오는 중...' : '계획 목록 불러오기'}
        </button>

        {error && <p className="error">불러오기 실패: {error.message}</p>}

        <table className="plan-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>계획 이름</th>
              <th>계획 기간</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPlanId === plan.id}
                    onChange={() => handleCheckboxChange(plan.id)}
                  />
                </td>
                <td>{plan.title}</td>
                <td>
                  {plan.startDate} ~ {plan.endDate}
                </td>
              </tr>
            ))}
            {!loading && plans.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  불러온 계획이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="change-button-container">
          <button className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCallPage;
