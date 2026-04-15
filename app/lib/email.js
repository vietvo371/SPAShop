// Email service cho Tâm An Energy Healing
// Cần cài đặt: yarn add nodemailer

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Format ngày giờ tiếng Việt
function formatDateTime(date) {
  return new Date(date).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Gửi email xác nhận lịch hẹn cho khách hàng
export async function sendAppointmentConfirmation(appointment) {
  const serviceName = appointment.service?.name || appointment.serviceNote || "Dịch vụ";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #680ab2, #8e44ad); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #680ab2; }
        .info-row { display: flex; margin: 10px 0; }
        .info-label { font-weight: bold; width: 120px; color: #666; }
        .info-value { flex: 1; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 0.85rem; }
        .btn { display: inline-block; background: #680ab2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Tâm An Energy Healing</h1>
          <p style="margin: 10px 0 0;">Xác nhận lịch hẹn</p>
        </div>
        <div class="content">
          <p>Xin chào <strong>${appointment.customerName}</strong>,</p>
          <p>Tâm An Energy Healing xác nhận đã nhận được lịch hẹn của bạn:</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">📅 Ngày giờ:</span>
              <span class="info-value">${formatDateTime(appointment.appointmentDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🛠️ Dịch vụ:</span>
              <span class="info-value">${serviceName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Địa chỉ:</span>
              <span class="info-value">02 Phan Long Bằng, Quảng Ngãi</span>
            </div>
            <div class="info-row">
              <span class="info-label">📞 Liên hệ:</span>
              <span class="info-value">035 630 8211</span>
            </div>
          </div>
          
          <p>Vui lòng đến đúng giờ đã đặt. Nếu cần thay đổi hoặc hủy lịch, xin liên hệ trước 24 giờ.</p>
          
          <p style="margin-top: 30px;">Trân trọng,<br/><strong>Tâm An Energy Healing</strong></p>
        </div>
        <div class="footer">
          <p>Email này được gửi tự động từ chanan.vn</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Tâm An Energy Healing" <${process.env.SMTP_USER || "noreply@chanan.vn"}>`,
      to: appointment.customerEmail,
      subject: `[Tâm An] Xác nhận lịch hẹn ngày ${new Date(appointment.appointmentDate).toLocaleDateString("vi-VN")}`,
      html,
    });
    console.log("Email xác nhận đã được gửi cho:", appointment.customerEmail);
    return { success: true };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return { success: false, error: error.message };
  }
}

// Gửi email thông báo cho admin khi có liên hệ mới
export async function sendNewContactNotification(contact) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #680ab2; }
        .btn { display: inline-block; background: #680ab2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📩 Liên hệ mới</h1>
        </div>
        <div class="content">
          <p>Có liên hệ mới từ website:</p>
          
          <div class="info-box">
            <p><strong>Tên:</strong> ${contact.name}</p>
            <p><strong>Điện thoại:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>
            <p><strong>Email:</strong> ${contact.email || "Không có"}</p>
          </div>
          
          <h3>Tin nhắn:</h3>
          <div class="message-box">
            ${contact.message}
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://chanan.vn"}/admin/contact" class="btn">
            Xem chi tiết trong Admin
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Tâm An Website" <${process.env.SMTP_USER || "noreply@chanan.vn"}>`,
      to: process.env.ADMIN_EMAIL || "contact@chanan.vn",
      subject: `[Website] Liên hệ mới từ ${contact.name}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Lỗi gửi email thông báo:", error);
    return { success: false, error: error.message };
  }
}

// Gửi email xác nhận đặt lịch thành công
export async function sendBookingSuccessEmail(email, bookingInfo) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #680ab2, #8e44ad); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Đặt lịch thành công!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; text-align: center;">
          <div class="success-icon">✅</div>
          <p>Cảm ơn bạn đã đặt lịch tại Tâm An Energy Healing.</p>
          <p>Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Tâm An Energy Healing" <${process.env.SMTP_USER || "noreply@chanan.vn"}>`,
      to: email,
      subject: "[Tâm An] Đặt lịch thành công",
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return { success: false, error: error.message };
  }
}