// โค้ดที่ต้องการ Refactoring
// ลองใช้ Copilot ปรับปรุงโค้ดเหล่านี้

// === ตัวอย่างที่ 1: โค้ดซ้ำซ้อน ===
function calculateRectangleArea(width, height) {
    if (width <= 0) {
        console.log("Width must be positive");
        return null;
    }
    if (height <= 0) {
        console.log("Height must be positive");
        return null;
    }
    return width * height;
}

function calculateTriangleArea(base, height) {
    if (base <= 0) {
        console.log("Base must be positive");
        return null;
    }
    if (height <= 0) {
        console.log("Height must be positive");
        return null;
    }
    return (base * height) / 2;
}

// TODO: ใช้ Copilot refactor โค้ดข้างบนเพื่อลดการซ้ำซ้อน


// === ตัวอย่างที่ 2: Performance ไม่ดี ===
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// TODO: ใช้ Copilot ปรับปรุง performance ของฟังก์ชันข้างบน


// === ตัวอย่างที่ 3: โค้ดยาวและอ่านยาก ===
function processUserData(users) {
    const result = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].age >= 18 && users[i].status === 'active' && users[i].email.includes('@') && users[i].email.includes('.')) {
            const userData = {
                id: users[i].id,
                name: users[i].firstName + ' ' + users[i].lastName,
                email: users[i].email.toLowerCase(),
                ageGroup: users[i].age < 30 ? 'young' : users[i].age < 50 ? 'middle' : 'senior',
                joinYear: new Date(users[i].joinDate).getFullYear()
            };
            result.push(userData);
        }
    }
    return result;
}

// TODO: ใช้ Copilot แยกฟังก์ชันนี้เป็นส่วนย่อยที่อ่านง่ายกว่า


// === ตัวอย่างที่ 4: การใช้ Loop ที่ไม่เหมาะสม ===
function sumEvenNumbers(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 === 0) {
            sum += numbers[i];
        }
    }
    return sum;
}

function multiplyOddNumbers(numbers) {
    let product = 1;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 !== 0) {
            product *= numbers[i];
        }
    }
    return product;
}

// TODO: ใช้ Copilot แนะนำการใช้ array methods แทน for loop


// === ตัวอย่างที่ 5: Hard-coded values ===
function calculateDiscount(price, customerType) {
    if (customerType === 'premium') {
        return price * 0.8; // 20% discount
    } else if (customerType === 'gold') {
        return price * 0.85; // 15% discount
    } else if (customerType === 'silver') {
        return price * 0.9; // 10% discount
    } else {
        return price * 0.95; // 5% discount
    }
}

// TODO: ใช้ Copilot refactor เพื่อลดการ hard-code values
