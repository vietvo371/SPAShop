"use client";
import { useState, useEffect } from "react";
import { 
  User, 
  Eye, 
  Activity, 
  Sparkles, 
  Clock, 
  Calendar, 
  Stethoscope, 
  Hand, 
  Zap, 
  Heart, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight,
  TrendingUp,
  Wind
} from "lucide-react";
import styles from "./Quiz.module.css";

const steps = [
  {
    id: "age",
    title: "Bao nhiêu tuổi?",
    subtitle: "Thông tin này giúp chúng tôi tư vấn liệu trình phù hợp nhất với thể trạng của bạn.",
    options: [
      { id: "under-25", label: "Dưới 25 tuổi", icon: <User size={24} /> },
      { id: "25-35", label: "Từ 25 - 35 tuổi", icon: <User size={24} /> },
      { id: "36-50", label: "Từ 36 - 50 tuổi", icon: <User size={24} /> },
      { id: "over-50", label: "Trên 50 tuổi", icon: <User size={24} /> },
    ]
  },
  {
    id: "target",
    title: "Vùng nào bạn muốn cải thiện nhất hiện tại?",
    subtitle: "Hãy chọn khu vực đang gặp vấn đề khiến bạn lo lắng nhất nhé.",
    layout: "grid",
    options: [
      { id: "face", label: "Da mặt", desc: "Nếp nhăn, chảy xệ, thiếu sức sống", icon: <Sparkles size={24} /> },
      { id: "eyes", label: "Vùng mắt", desc: "Quầng thâm, nhức mỏi, bọng mắt", icon: <Eye size={24} /> },
      { id: "neck", label: "Cổ, vai, gáy", desc: "Đau nhức, căng cơ, mệt mỏi", icon: <Activity size={24} /> },
      { id: "body", label: "Toàn thân", desc: "Tuần hoàn kém, mất ngủ, uể oải", icon: <Zap size={24} /> },
    ]
  },
  {
    id: "duration",
    title: "Tình trạng này đã kéo dài bao lâu?",
    subtitle: "Xác định mức độ để đưa ra phác đồ phục hồi tối ưu.",
    options: [
      { id: "recent", label: "Mới xuất hiện gần đây", icon: <Clock size={24} /> },
      { id: "mid", label: "Khoảng 1 - 3 tháng", icon: <Calendar size={24} /> },
      { id: "chronic", label: "Đã bị lâu năm (mãn tính)", icon: <TrendingUp size={24} /> },
    ]
  },
  {
    id: "current_solution",
    title: "Bạn đang dùng cách nào để xử lý?",
    subtitle: "Chúng tôi muốn biết bạn đã trải nghiệm những gì.",
    options: [
      { id: "spa", label: "Tốn tiền đi Spa/Clinic định kỳ", icon: <Stethoscope size={24} /> },
      { id: "meds", label: "Dùng kem thoa/thuốc uống", icon: <Zap size={24} /> },
      { id: "massage", label: "Massage bằng tay thông thường", icon: <Hand size={24} /> },
      { id: "none", label: "Chưa có giải pháp nào", icon: <Sparkles size={24} /> },
    ]
  },
  {
    id: "free_time",
    title: "Bạn có bao nhiêu thời gian rảnh mỗi ngày?",
    subtitle: "Liệu trình sẽ được thiết kế khớp với lịch trình của bạn.",
    options: [
      { id: "5-10", label: "Chỉ 5 - 10 phút (rất bận)", icon: <Clock size={20} /> },
      { id: "15-30", label: "Khoảng 15 - 30 phút", icon: <Clock size={24} /> },
      { id: "over-30", label: "Hơn 30 phút (thoải mái)", icon: <Clock size={28} /> },
    ]
  },
  {
    id: "goal",
    title: "Mục tiêu lớn nhất của bạn là gì?",
    subtitle: "Đây là kết quả quan trọng nhất mà chúng ta cùng hướng tới.",
    options: [
      { id: "rejuvenation", label: "Trẻ hóa, nâng cơ mặt rõ rệt", icon: <Sparkles size={24} /> },
      { id: "pain-relief", label: "Hết hẳn đau nhức, nhẹ nhõm cơ thể", icon: <Activity size={24} /> },
      { id: "circulation", label: "Lưu thông khí huyết, ngủ sâu giấc", icon: <Wind size={24} /> },
    ]
  }
];

export default function ConsultationQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, isFinished]);

  const handleOptionSelect = (optionId) => {
    setAnswers({ ...answers, [steps[currentStep].id]: optionId });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          answers,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        throw new Error(result.error || "Gửi thất bại");
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = isFinished ? 100 : ((currentStep) / steps.length) * 100;

  if (isSuccess) {
    return (
      <section className="page-content" style={{ background: "var(--color-cream)", minHeight: "100vh", paddingTop: "120px" }}>
        <div className="container">
          <div className={styles.quizContainer}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className={styles.stepTitle}>Đăng ký thành công!</h2>
              <p className={styles.stepSubtitle}>
                Cảm ơn <strong>{formData.name}</strong>. Chuyên gia của Tâm An sẽ sớm liên hệ qua số <strong>{formData.phone}</strong> để gửi liệu trình cá nhân hóa dành riêng cho bạn.
              </p>
              <div style={{ marginTop: "40px" }}>
                <a href="/" className={styles.nextBtn} style={{ display: "inline-block" }}>Về Trang Chủ</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero" style={{ padding: "80px 0 40px" }}>
        <div className="container">
          <h1>Tư Vấn Liệu Trình Cá Nhân Hóa</h1>
          <p>Dựa trên công nghệ hồng ngoại xa (FIR) và phương pháp chữa lành tự nhiên</p>
        </div>
      </section>

      <section className="page-content" style={{ background: "var(--color-cream)", minHeight: "80vh", paddingBottom: "100px" }}>
        <div className="container">
          <div className={styles.quizContainer}>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>

            {!isFinished ? (
              <div key={currentStep} className="animate-fadeIn">
                <div className={styles.stepHeader}>
                  <p className={styles.optionDesc} style={{ marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px", color: "var(--color-primary)" }}>Câu hỏi {currentStep + 1} / {steps.length}</p>
                  <h2 className={styles.stepTitle}>{steps[currentStep].title}</h2>
                  <p className={styles.stepSubtitle}>{steps[currentStep].subtitle}</p>
                </div>

                <div className={steps[currentStep].layout === "grid" ? styles.optionsGrid2Col : styles.optionsGrid}>
                  {steps[currentStep].options.map((opt) => (
                    <div 
                      key={opt.id} 
                      className={`${styles.optionCard} ${answers[steps[currentStep].id] === opt.id ? styles.optionCardSelected : ""}`}
                      onClick={() => handleOptionSelect(opt.id)}
                    >
                      <div className={styles.optionIcon}>{opt.icon}</div>
                      <div className={styles.optionLabel}>
                        <span className={styles.optionText}>{opt.label}</span>
                        {opt.desc && <span className={styles.optionDesc}>{opt.desc}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.navigation}>
                  <button 
                    className={styles.backBtn} 
                    onClick={handleBack}
                    style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
                  >
                    <ArrowLeft size={18} /> Quay lại
                  </button>
                  <button 
                    className={styles.nextBtn} 
                    onClick={handleNext}
                    disabled={!answers[steps[currentStep].id]}
                  >
                    Tiếp theo <ChevronRight size={18} style={{ marginLeft: "4px" }} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepTitle}>Tuyệt vời! Giải pháp cho bạn đã sẵn sàng.</h2>
                  <p className={styles.stepSubtitle}>Vui lòng để lại thông tin để chúng tôi gửi liệu trình cá nhân hóa và các bài tập hướng dẫn chăm sóc tại nhà hoàn toàn miễn phí.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Họ và Tên</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="Nhập tên của bạn..." 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại</label>
                    <input 
                      type="tel" 
                      className={styles.formInput} 
                      placeholder="Nhập số điện thoại..." 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email (Để nhận giáo trình)</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      placeholder="email@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.nextBtn} 
                    style={{ width: "100%", marginTop: "20px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Nhận Kết Quả Ngay"}
                  </button>

                  <p style={{ fontSize: "0.8rem", color: "var(--color-gray)", textAlign: "center", marginTop: "16px" }}>
                    Chúng tôi cam kết bảo mật thông tin của bạn tuyệt đối.
                  </p>
                </form>

                <div className={styles.navigation}>
                  <button className={styles.backBtn} onClick={() => setIsFinished(false)}>
                    <ArrowLeft size={18} /> Quay lại câu hỏi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
