import nodemailer from "nodemailer";

// ============================================
// EMAIL CONFIGURATION
// ============================================
// Hỗ trợ nhiều provider:
// 1. Gmail (cần App Password)
// 2. SMTP Server tùy chỉnh
// 3. SendGrid, Mailgun, Resend (API-based)
//
// Cấu hình trong .env:
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_SECURE=false
// SMTP_USER=your-email@gmail.com
// SMTP_PASS=your-app-password
// SMTP_FROM="Tâm An" <noreply@chanan.vn>
// ============================================

// Create transporter
function createTransporter() {
  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  };

  return nodemailer.createTransport(config);
}

// Email templates
const templates = {
  // ============================================
  // CONTACT FORM NOTIFICATION
  // ============================================
  contactNotification: (data: {
    name: string;
    phone: string;
    email?: string;
    message: string;
  }) => ({
    subject: `[Tâm An] Tin nhắn mới từ ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #680ab2, #490770); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Tâm An Energy Healing</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Tin nhắn liên hệ mới</p>
        </div>
        
        <div style="padding: 30px; background: #fafafa;">
          <h2 style="color: #333; margin-top: 0;">Khách hàng: ${data.name}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">Số điện thoại:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${data.phone}" style="color: #680ab2;">${data.phone}</a>
              </td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${data.email}" style="color: #680ab2;">${data.email}</a>
              </td>
            </tr>
            ` : ""}
          </table>
          
          <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #680ab2;">
            <h3 style="margin-top: 0; color: #680ab2;">Nội dung tin nhắn:</h3>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/contact" 
               style="display: inline-block; padding: 12px 30px; background: #680ab2; color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Xem chi tiết trong Admin
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
          Email này được gửi tự động từ hệ thống Tâm An Energy Healing
        </div>
      </div>
    `,
    text: `
TIN NHẮN LIEN HE MOI

Khach hang: ${data.name}
So dien thoai: ${data.phone}
${data.email ? `Email: ${data.email}` : ""}

Noi dung:
${data.message}

Xem chi tiet: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/contact
    `,
  }),

  // ============================================
  // APPOINTMENT NOTIFICATION (Admin)
  // ============================================
  appointmentAdminNotification: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
  }) => ({
    subject: `[Tâm An] Lịch hẹn mới: ${data.customerName} - ${data.appointmentDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #680ab2, #490770); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Tâm An Energy Healing</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Lịch hẹn mới</p>
        </div>
        
        <div style="padding: 30px; background: #fafafa;">
          <div style="background: #d1fae5; color: #059669; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <strong>Co lich hen moi can xac nhan!</strong>
          </div>
          
          <h2 style="color: #333; margin-top: 0;">Khach hang: ${data.customerName}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Dich vu:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #680ab2; font-weight: bold;">
                ${data.serviceName}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Ngay hen:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Gio hen:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">So dien thoai:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${data.customerPhone}" style="color: #680ab2;">${data.customerPhone}</a>
              </td>
            </tr>
            ${data.customerEmail ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${data.customerEmail}" style="color: #680ab2;">${data.customerEmail}</a>
              </td>
            </tr>
            ` : ""}
            ${data.notes ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Ghi chu:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.notes}</td>
            </tr>
            ` : ""}
          </table>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/appointments" 
               style="display: inline-block; padding: 12px 30px; background: #680ab2; color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Quan ly lich hen
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
          Email nay duoc gui tu dong tu he thong Tâm An Energy Healing
        </div>
      </div>
    `,
    text: `
LICH HEN MOI

Khach hang: ${data.customerName}
Dich vu: ${data.serviceName}
Ngay hen: ${data.appointmentDate}
Gio hen: ${data.appointmentTime}
So dien thoai: ${data.customerPhone}
${data.customerEmail ? `Email: ${data.customerEmail}` : ""}
${data.notes ? `Ghi chu: ${data.notes}` : ""}

Quan ly lich hen: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/appointments
    `,
  }),

  // ============================================
  // APPOINTMENT CONFIRMATION (Customer)
  // ============================================
  appointmentConfirmation: (data: {
    customerName: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    phone: string;
  }) => ({
    subject: `[Tâm An] Xac nhan lich hen - ${data.appointmentDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #680ab2, #490770); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Tâm An Energy Healing</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Xac nhan lich hen</p>
        </div>
        
        <div style="padding: 30px; background: #fafafa;">
          <p style="font-size: 16px; color: #333;">Xin chao <strong>${data.customerName}</strong>,</p>
          
          <p style="color: #666;">Cam on ban da dat lich hen tai Tâm An. Day la thong tin lich hen cua ban:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #888;">Dich vu:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #680ab2;">${data.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Ngay:</td>
                <td style="padding: 8px 0; font-weight: bold;">${data.appointmentDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Gio:</td>
                <td style="padding: 8px 0; font-weight: bold;">${data.appointmentTime}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Luu y:</strong> Vui long den truoc ${data.appointmentTime} 15 phut de chuan bi. 
              Neu can huy hoac thay doi, vui long lien he <strong>${data.phone}</strong>.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Dia chi: <strong>02 Phan Long Bang, Quang Ngai</strong>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Chung toi se goi dien xac nhan trong thoi gian som nhat.
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
          Tâm An Energy Healing - Khoe Tu Ben Trong
        </div>
      </div>
    `,
    text: `
XIN CHAO ${data.customerName},

Cam on ban da dat lich hen tai Tâm An Energy Healing!

THONG TIN LICH HEN:
- Dich vu: ${data.serviceName}
- Ngay: ${data.appointmentDate}
- Gio: ${data.appointmentTime}

Dia chi: 02 Phan Long Bang, Quang Ngai
Dien thoai: ${data.phone}

Vui long den truoc 15 phut de chuan bi.
    `,
  }),
};

// ============================================
// SEND EMAIL FUNCTION
// ============================================
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  // Skip if email is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 Email not configured, skipping email send:");
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    return { success: true, skipped: true };
  }

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Tâm An" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("✅ Email sent successfully:");
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  MessageId: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

// Send contact notification to admin
export async function sendContactNotification(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@chanan.vn";
  const template = templates.contactNotification(data);
  return sendEmail({
    to: adminEmail,
    ...template,
  });
}

// Send appointment notification to admin
export async function sendAppointmentAdminNotification(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@chanan.vn";
  const template = templates.appointmentAdminNotification(data);
  return sendEmail({
    to: adminEmail,
    ...template,
  });
}

// Send appointment confirmation to customer
export async function sendAppointmentConfirmation(data: {
  customerName: string;
  customerEmail?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
}) {
  if (!data.customerEmail) {
    return { success: false, error: "No customer email" };
  }

  const template = templates.appointmentConfirmation(data);
  return sendEmail({
    to: data.customerEmail,
    ...template,
  });
}
