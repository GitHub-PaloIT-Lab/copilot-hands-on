// ข้อมูลสินค้าตัวอย่างสำหรับ E-commerce
const products = [
    {
        id: 'phone',
        name: 'โทรศัพท์มือถือ',
        price: 15000,
        description: 'สมาร์ทโฟนรุ่นใหม่ล่าสุด จอ 6.5 นิ้ว กล้อง 108MP แบตเตอรี่ 5000mAh',
        image: 'https://via.placeholder.com/300x300?text=Phone',
        colors: ['ดำ', 'ขาว', 'น้ำเงิน'],
        category: 'อิเล็กทรอนิกส์'
    },
    {
        id: 'headphone',
        name: 'หูฟัง Bluetooth',
        price: 2500,
        description: 'หูฟังไร้สายคุณภาพเสียงระดับ Hi-Fi ตัดเสียงรบกวน แบตเตอรี่ใช้ได้ 30 ชั่วโมง',
        image: 'https://via.placeholder.com/300x300?text=Headphone',
        colors: ['ดำ', 'ขาว', 'แดง'],
        category: 'อิเล็กทรอนิกส์'
    },
    {
        id: 'case',
        name: 'เคสโทรศัพท์',
        price: 350,
        description: 'เคสกันกระแทกคุณภาพสูง วัสดุ TPU ป้องกันรอยขีดข่วน',
        image: 'https://via.placeholder.com/300x300?text=Case',
        colors: ['ดำ', 'ใส', 'น้ำเงิน', 'แดง'],
        category: 'อุปกรณ์เสริม'
    },
    {
        id: 'cable',
        name: 'สายชาร์จ USB-C',
        price: 450,
        description: 'สายชาร์จเร็ว USB-C ยาว 1.5 เมตร รองรับ Fast Charging 65W',
        image: 'https://via.placeholder.com/300x300?text=Cable',
        colors: ['ดำ', 'ขาว'],
        category: 'อุปกรณ์เสริม'
    },
    {
        id: 'stand',
        name: 'แท่นวางโทรศัพท์',
        price: 750,
        description: 'แท่นวางโทรศัพท์อลูมิเนียม ปรับมุมได้ รองรับการชาร์จไร้สาย',
        image: 'https://via.placeholder.com/300x300?text=Stand',
        colors: ['เงิน', 'ดำ'],
        category: 'อุปกรณ์เสริม'
    },
    {
        id: 'powerbank',
        name: 'พาวเวอร์แบงค์',
        price: 1200,
        description: 'พาวเวอร์แบงค์ความจุ 20000mAh ชาร์จเร็ว พอร์ต USB-C และ USB-A',
        image: 'https://via.placeholder.com/300x300?text=Powerbank',
        colors: ['ดำ', 'ขาว', 'น้ำเงิน'],
        category: 'อิเล็กทรอนิกส์'
    }
];

module.exports = products;
