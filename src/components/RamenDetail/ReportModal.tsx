import React, { useState } from "react";
import "./ReportModal.scss";

interface ReportModalProps {
    onSubmit: (reportReason: string) => void;
    onCancel: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onSubmit, onCancel }) => {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");

    const reasons = ["욕설 및 비방", "스팸성 광고", "개인 정보 노출", "허위 정보", "기타"];

    const handleSubmit = () => {
        const reportReason = selectedReason === "기타" ? otherReason : selectedReason;
        onSubmit(reportReason);
    };

    return (
        <div className="report-modal">
            <div className="report-modal-content">
                <h2>신고하기</h2>
                <div className="report-reasons">
                    {reasons.map((reason, index) => (
                        <label key={index} className="report-reason">
                            <input
                                type="radio"
                                name="reportReason"
                                value={reason}
                                checked={selectedReason === reason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            {reason}
                        </label>
                    ))}
                    {selectedReason === "기타" && (
                        <textarea
                            placeholder="신고 사유를 입력하세요"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                        />
                    )}
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
