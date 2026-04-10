"use client";

import { useState, useEffect } from "react";
import styles from "./BookingForm.module.css";

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
}

export default function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const result = await response.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Vui lòng nhập họ và tên";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[0-9]{9,10})$/.test(formData.customerPhone.replace(/\s/g, ""))) {
      newErrors.customerPhone = "Số điện thoại không hợp lệ";
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Email không hợp lệ";
    }

    if (!formData.serviceId) {
      newErrors.serviceId = "Vui lòng chọn dịch vụ";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Vui lòng chọn ngày hẹn";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = "Ngày hẹn không thể là ngày trong quá khứ";
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Vui lòng chọn giờ hẹn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(result.message || "Đặt lịch hẹn thành công!");
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          serviceId: "",
          appointmentDate: "",
          appointmentTime: "",
          notes: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.error || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Không thể kết nối server. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split("T")[0];

  // Time slots
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
    "18:30", "19:00", "19:30"
  ];

  return (
    <div className={styles.bookingWrapper}>
      <div className={styles.bookingHeader}>
        <h2 className={styles.bookingTitle}>Đặt Lịch Hẹn</h2>
        <p className={styles.bookingSubtitle}>
          Điền thông tin bên dưới để đặt lịch hẹn dịch vụ tại Tâm An
        </p>
      </div>

      {submitStatus === "success" && (
        <div className={styles.successAlert}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <div>
            <strong>{submitMessage}</strong>
            <p>Chúng tôi sẽ gọi điện xác nhận trong thời gian sớm nhất.</p>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className={styles.errorAlert}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{submitMessage}</span>
        </div>
      )}

      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Thông Tin Khách Hàng</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Họ và Tên <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className={`${styles.input} ${errors.customerName ? styles.inputError : ""}`}
              />
              {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Số Điện Thoại <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="0xxx xxx xxx"
                className={`${styles.input} ${errors.customerPhone ? styles.inputError : ""}`}
              />
              {errors.customerPhone && <span className={styles.errorText}>{errors.customerPhone}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="email@example.com"
              className={`${styles.input} ${errors.customerEmail ? styles.inputError : ""}`}
            />
            {errors.customerEmail && <span className={styles.errorText}>{errors.customerEmail}</span>}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Thông Tin Lịch Hẹn</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Dịch Vụ <span className={styles.required}>*</span>
            </label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className={`${styles.select} ${errors.serviceId ? styles.inputError : ""}`}
            >
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} {service.duration && `(${service.duration})`}
                </option>
              ))}
            </select>
            {errors.serviceId && <span className={styles.errorText}>{errors.serviceId}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Ngày Hẹn <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={today}
                className={`${styles.input} ${errors.appointmentDate ? styles.inputError : ""}`}
              />
              {errors.appointmentDate && <span className={styles.errorText}>{errors.appointmentDate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giờ Hẹn <span className={styles.required}>*</span>
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className={`${styles.select} ${errors.appointmentTime ? styles.inputError : ""}`}
              >
                <option value="">-- Chọn giờ --</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.appointmentTime && <span className={styles.errorText}>{errors.appointmentTime}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ghi Chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Mô tả tình trạng sức khỏe hoặc yêu cầu đặc biệt..."
              rows={4}
              className={styles.textarea}
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Đang xử lý...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              </svg>
              Xác Nhận Đặt Lịch
            </>
          )}
        </button>
      </form>
    </div>
  );
}
