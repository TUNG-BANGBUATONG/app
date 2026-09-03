import re

file_path = "/Users/miyabinarakmakmak/app/app/index.tsx"

replacements = {
    "{/* Top Header Row with Back, Edit and Status toggle */}": "{/* แถบด้านบนสุด: ปุ่มกลับ, แก้ไข, และสลับสถานะ */}",
    "{/* Main Hero Product Image with colored background box */}": "{/* รูปภาพหลักของสินค้า พร้อมพื้นหลังสี */}",
    "{/* Product Details Section */}": "{/* ส่วนรายละเอียดสินค้า */}",
    "{/* Rating Stars row */}": "{/* แถวแสดงคะแนนรีวิว */}",
    "{/* Description */}": "{/* คำอธิบายสินค้า */}",
    "{/* Size / Scale selector like Reebok App */}": "{/* ตัวเลือกขนาด / สเกลของโมเดล */}",
    "{/* Scale options grid */}": "{/* ตารางตัวเลือกสเกล */}",
    "{/* Floating bottom buy button */}": "{/* ปุ่มกดซื้อสินค้าด้านล่าง (ปุ่มลอย) */}",
    "{/* 1. HEADER (Explore title on Left, profile avatar on Right) */}": "{/* 1. ส่วนหัว: ชื่อหน้าอยู่ซ้าย, รูปโปรไฟล์อยู่ขวา */}",
    "{/* Search Bar / Add Button row (Hide on Add Tab) */}": "{/* แถบส่วนค้นหาและปุ่มเพิ่ม (ซ่อนในแท็บ Add) */}",
    "{/* Quick Add Shortcut */}": "{/* ปุ่มทางลัดสำหรับเพิ่มสินค้าด่วน */}",
    "{/* Categories Quick Filter Pill list */}": "{/* รายการปุ่มกรองหมวดหมู่แบบรวดเร็ว */}",
    "{/* Removed Segmented Control */}": "{/* (นำส่วนตัวเลือกแบบแบ่งส่วนออกแล้ว) */}",
    "{/* 2. BODY CONTENT AREA */}": "{/* 2. ส่วนพื้นที่เนื้อหาหลัก */}",
    "{/* --- HOME TAB VIEW (Explore) --- */}": "{/* --- เนื้อหาแท็บหน้าแรก (Explore) --- */}",
    "{/* Styled Image background with Reebok colored corner style */}": "{/* พื้นหลังรูปภาพแบบมีดีไซน์สีตัดกันที่มุม */}",
    "{/* Product Details under image */}": "{/* รายละเอียดสินค้าที่อยู่ใต้รูปภาพ */}",
    "{/* --- PRODUCTS TAB VIEW (Standard list + active actions) --- */}": "{/* --- เนื้อหาแท็บรายการสินค้า (แสดงผลแบบรายการยาว) --- */}",
    "{/* Visual Card Image with gradient styling */}": "{/* รูปภาพสินค้าในการ์ด พร้อมสไตล์ไล่สี */}",
    "{/* Card Content details */}": "{/* รายละเอียดเนื้อหาภายในการ์ด */}",
    "{/* Action buttons (Edit & Delete) */}": "{/* ปุ่มจัดการ (แก้ไข & ลบ) */}",
    "{/* --- ADD PRODUCT TAB VIEW --- */}": "{/* --- เนื้อหาแท็บฟอร์มเพิ่มสินค้า --- */}",
    "{/* Form Input fields */}": "{/* ช่องกรอกข้อมูลต่างๆ ในฟอร์ม */}",
    "{/* Grade Selection Row */}": "{/* แถวสำหรับเลือกเกรดของโมเดล */}",
    "{/* Submit button */}": "{/* ปุ่มกดยืนยันข้อมูล */}",
    "{/* --- CATEGORIES TAB VIEW --- */}": "{/* --- เนื้อหาแท็บหมวดหมู่ / แดชบอร์ด --- */}",
    "{/* Progress bar representer */}": "{/* แถบหลอดแสดงความคืบหน้า / สัดส่วน */}",
    "{/* 3. BOTTOM NAVIGATION (Reebok style menu layout) */}": "{/* 3. ส่วนเมนูด้านล่าง (Footbar) */}",
    "{/* Grade Selection */}": "{/* ตัวเลือกเกรดของโมเดล */}"
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for eng, thai in replacements.items():
    content = content.replace(eng, thai)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done JSX")
