"use client";
import { useState } from "react";

const faqData = [
  {
    question: "Ai có thể sử dụng dịch vụ tại Tâm An?",
    answer: "Tất cả mọi người từ trẻ em đến người lớn tuổi đều có thể sử dụng dịch vụ tại Tâm An. Đặc biệt là những người gặp vấn đề về đau nhức xương khớp, mất ngủ, căng thẳng kéo dài hoặc cần phục hồi sức khỏe sau ốm dậy."
  },
  {
    question: "Tôi cần bao nhiêu buổi để thấy hiệu quả?",
    answer: "Điều này phụ thuộc vào thể trạng, mục tiêu và mức độ vấn đề của mỗi người. Nhiều khách hàng cảm nhận sự thư giãn, ngủ ngon hơn chỉ sau vài buổi. Với các tình trạng mãn tính hoặc cần phục hồi chuyên sâu, thường khuyến nghị liệu trình từ 5 - 12 buổi để cơ thể có thời gian tự tái tạo và cân bằng."
  },
  {
    question: "Một buổi trị liệu thường kéo dài bao lâu?",
    answer: "Thông thường một buổi trị liệu tại Tâm An kéo dài từ 45 đến 90 phút tùy theo liệu trình bạn lựa chọn. Chúng tôi luôn dành thời gian thăm khám ban đầu để tư vấn khoảng thời gian tối ưu cho bạn."
  },
  {
    question: "FIR có thể thay thế điều trị y khoa không?",
    answer: "Công nghệ Hồng Ngoại Xa (FIR) là liệu pháp hỗ trợ phục hồi sức khỏe tự nhiên tuyệt vời, giúp tăng cường hệ miễn dịch và giảm đau. Tuy nhiên, FIR không thay thế hoàn toàn các chỉ định y khoa đặc hiệu. Bạn nên tham khảo ý kiến bác sĩ nếu đang trong quá trình điều trị bệnh lý nghiêm trọng."
  },
  {
    question: "Liệu pháp FIR tại Tâm An có an toàn không?",
    answer: "Hoàn toàn an toàn. Liệu pháp FIR tại Tâm An là phương pháp không xâm lấn, không dùng thuốc, sử dụng các thiết bị chính hãng đạt tiêu chuẩn quốc tế, mang lại cảm giác dễ chịu và thư giãn sâu cho người sử dụng."
  },
  {
    question: "Sau buổi trị liệu, tôi cần lưu ý điều gì?",
    answer: "Bạn nên uống nhiều nước ấm để hỗ trợ quá trình thải độc của cơ thể, tránh tắm ngay bằng nước lạnh sau khi trị liệu và giữ tinh thần thoải mái để đạt hiệu quả phục hồi tốt nhất."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2 className="section-title">Hỏi Đáp Cùng Tâm An</h2>
        <div className="faq-accordion">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <span className="faq-icon">{activeIndex === index ? "−" : "+"}</span>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
