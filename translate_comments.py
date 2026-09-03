import re

file_path = "/Users/miyabinarakmakmak/app/app/index.tsx"

replacements = {
    "// Dimensions helper for layout": "// ตัวช่วยคำนวณขนาดหน้าจอสำหรับการจัดวางเลย์เอาต์",
    "// Mock Product Interface": "// โครงสร้างข้อมูลจำลองของสินค้า",
    "// Initial Mock Data (Gunpla Kits)": "// ข้อมูลจำลองเริ่มต้น (โมเดลกันพลา)",
    "// Navigation / Login / View Details States": "// สถานะต่างๆ สำหรับการนำทาง / ล็อกอิน / ดูรายละเอียด",
    "// App Core States": "// สถานะหลักของแอปพลิเคชัน (รายการสินค้า)",
    "// Reusable fetch products": "// ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก API",
    "// Fetch product by ID details": "// ฟังก์ชันสำหรับดึงข้อมูลรายละเอียดสินค้าตาม ID",
    "// Add Product Form States": "// สถานะสำหรับฟอร์มเพิ่มสินค้า",
    "// Edit Product States": "// สถานะสำหรับฟอร์มแก้ไขสินค้า",
    "// Web-safe Alert": "// ฟังก์ชันแจ้งเตือนที่รองรับทั้งบนเว็บและมือถือ",
    "// Authentication Handlers": "// ฟังก์ชันจัดการการล็อกอินและสมัครสมาชิก",
    "// Logout Handler": "// ฟังก์ชันจัดการการล็อกเอาต์",
    "// Add Product Handler": "// ฟังก์ชันจัดการการเพิ่มสินค้าใหม่",
    "// Reset Form": "// ล้างข้อมูลในฟอร์ม",
    "// Refresh list": "// อัปเดตรายการสินค้าใหม่",
    "// Start Edit Mode": "// เปิดโหมดแก้ไขสินค้า (นำข้อมูลเดิมมาใส่ในฟอร์ม)",
    "// Submit Edit Handler": "// ฟังก์ชันยืนยันการแก้ไขข้อมูลสินค้า",
    "// Refresh Detail View if active": "// อัปเดตหน้ารายละเอียดสินค้าถ้ายอมเปิดดูอยู่",
    "// Toggle Active Status via Server": "// ฟังก์ชันสลับสถานะเปิด/ปิดการขายของสินค้า",
    "// Delete Product via Server": "// ฟังก์ชันลบสินค้าผ่าน API",
    "// Filtering Logic": "// ตรรกะการกรองและค้นหาสินค้า",
    "// Calculate stats for Categories / Dashboard": "// คำนวณสถิติสำหรับหน้าหมวดหมู่และแดชบอร์ด",
    "// RENDER LOGIN SCREEN (Clean Light theme matching Reebok app card style)": "// ส่วนแสดงผลหน้าล็อกอิน (ดีไซน์สว่าง เรียบง่าย)",
    "// RENDER PRODUCT DETAIL VIEW (Reebok Product Details Screen Style)": "// ส่วนแสดงผลหน้ารายละเอียดสินค้า",
    "// Mock purchase: remove from state for users": "// จำลองการซื้อ: ลบออกจากระบบ (เฉพาะฝั่งลูกค้า)",
    "// RENDER APP MAIN SCREEN (Reebok style list and UI flow)": "// ส่วนแสดงผลหน้าหลักของแอปพลิเคชัน",
    "// CSS STYLING (StyleSheet.create - Theme: Reebok Light/Mint and Coral Red)": "// สไตล์ CSS ทั้งหมดของแอป (กำหนดสี รูปแบบต่างๆ)",
    "// LOGIN SCREEN STYLING (Light clean UI matching Reebok card aesthetics)": "// สไตล์ CSS สำหรับหน้าล็อกอิน",
    "// MAIN SCREEN CONTAINER": "// สไตล์สำหรับคอนเทนเนอร์หน้าหลัก",
    "// HEADER STYLING (Reebok explore theme style)": "// สไตล์สำหรับส่วนหัว (Header)",
    "// BODY & TAB CONTAINER STYLING": "// สไตล์สำหรับเนื้อหาและแท็บเมนู",
    "// HERO BANNER STYLING (Premium Red Box Reebok Style)": "// สไตล์สำหรับแบนเนอร์ด้านบน",
    "// METRICS STYLING": "// สไตล์สำหรับกล่องแสดงสถิติต่างๆ",
    "// FEATURED ITEMS STYLING (Reebok Cards Layout)": "// สไตล์สำหรับสินค้าแนะนำ",
    "// PRODUCTS LIST TAB STYLING": "// สไตล์สำหรับแท็บรายการสินค้า",
    "// EMPTY STATE STYLING": "// สไตล์สำหรับตอนที่ไม่มีข้อมูล",
    "// ADD FORM STYLING": "// สไตล์สำหรับฟอร์มเพิ่มสินค้า",
    "// CATEGORIES TAB STYLING": "// สไตล์สำหรับแท็บหมวดหมู่ (แดชบอร์ด)",
    "// BOTTOM NAVIGATION BAR STYLING (Reebok Style Custom Nav)": "// สไตล์สำหรับแถบเมนูด้านล่าง (Footbar)",
    "// PRODUCT DETAIL VIEW STYLING (Reebok Product Details screen)": "// สไตล์สำหรับหน้ารายละเอียดสินค้า"
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for eng, thai in replacements.items():
    content = content.replace(eng, thai)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
