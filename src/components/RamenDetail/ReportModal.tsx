import React, { useState } from "react";
import "./ReportModal.scss";

interface ReportModalProps {
    onSubmit: (reportReason: string) => Promise<boolean>; // onSubmit이 백엔드에 요청을 보내고, 성공 여부를 반환하는 Promise를 반환한다고 가정합니다.
    onCancel: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onSubmit, onCancel }) => {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");

    const reasons = ["욕설 및 비방", "스팸성 광고", "개인 정보 노출", "허위 정보", "기타"];

    const handleSubmit = async () => {
        const reportReason = selectedReason === "기타" ? otherReason : selectedReason;
        const isSuccessful = await onSubmit(reportReason);

        if (isSuccessful) {
            alert("신고가 접수되었습니다");
        } else {
            alert("신고가 이미 접수되었습니다.");
        }
    };

    return (
        <div className="report-modal">
            <div className="report-modal-content">
                <h2>신고하기</h2>
                <div className="report-reasons">
                    {reasons.map((reason, index) => (
                        <div key={index}>
                            <label className="report-reason">
                                <input
                                    type="radio"
                                    name="reportReason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                {reason}
                            </label>
                        </div>
                    ))}
                    <textarea
                        placeholder="신고 사유를 입력하세요"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        disabled={selectedReason !== "기타"}
                    />
                </div>
                <div className="report-modal-actions">
                    <button onClick={handleSubmit}>제출</button>
                    <button onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
