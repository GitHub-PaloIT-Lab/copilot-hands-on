// ตัวอย่างปัญหา SQL Injection และการแก้ไข
// ไฟล์นี้แสดงวิธีการแก้ไขปัญหา SQL injection ด้วย parameterized queries

// Mock database connection สำหรับการสาธิต (ในการใช้งานจริงใช้ mysql2 หรือ database library อื่น)
class MockConnection {
    query(sql, params, callback) {
        // หาก params เป็น function แสดงว่าไม่มีการส่ง parameters
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        console.log('Query executed:', sql);
        if (params && params.length > 0) {
            console.log('Parameters:', params);
        }
        
        // จำลองการ response ของฐานข้อมูล
        setTimeout(() => {
            callback(null, [{ id: 1, username: 'testuser', email: 'test@example.com' }]);
        }, 10);
    }
}

const connection = new MockConnection();

// ❌ วิธีที่ไม่ปลอดภัย - เสี่ยงต่อ SQL injection
function unsafeLogin(username, password) {
    // การใช้ string concatenation ทำให้เกิดช่องโหว่ SQL injection
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('Unsafe query:', query);
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        
        if (results.length > 0) {
            console.log('Login successful:', results[0]);
        } else {
            console.log('Invalid credentials');
        }
    });
}

// ✅ วิธีที่ปลอดภัย - ใช้ parameterized queries
function safeLogin(username, password) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        
        if (results.length > 0) {
            console.log('Login successful:', results[0]);
        } else {
            console.log('Invalid credentials');
        }
    });
}

// ❌ ตัวอย่างการ query ที่ไม่ปลอดภัย
function unsafeSearchUsers(searchTerm) {
    const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%'`;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        console.log('Search results:', results);
    });
}

// ✅ ตัวอย่างการ query ที่ปลอดภัย
function safeSearchUsers(searchTerm) {
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        console.log('Search results:', results);
    });
}

// ❌ การ update ที่ไม่ปลอดภัย
function unsafeUpdateUser(userId, newEmail) {
    const query = `UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        console.log('User updated:', results);
    });
}

// ✅ การ update ที่ปลอดภัย
function safeUpdateUser(userId, newEmail) {
    const query = 'UPDATE users SET email = ? WHERE id = ?';
    
    connection.query(query, [newEmail, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        console.log('User updated:', results);
    });
}

// ตัวอย่างการโจมตี SQL injection
function demonstrateSQLInjection() {
    console.log('=== SQL Injection Attack Demonstration ===');
    
    // การโจมตีแบบ authentication bypass
    const maliciousUsername = "admin' OR '1'='1' --";
    const maliciousPassword = "anything";
    
    console.log('\n❌ Unsafe query with malicious input:');
    console.log(`Username: ${maliciousUsername}`);
    console.log(`Password: ${maliciousPassword}`);
    
    // สร้าง query ที่เกิดขึ้นจากการ concatenation
    const unsafeQuery = `SELECT * FROM users WHERE username = '${maliciousUsername}' AND password = '${maliciousPassword}'`;
    console.log('Resulting query:', unsafeQuery);
    console.log('⚠️  This query will return all users because of SQL injection!');
    
    console.log('\n✅ Safe query with the same input:');
    const safeQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    console.log('Safe query template:', safeQuery);
    console.log('Parameters:', [maliciousUsername, maliciousPassword]);
    console.log('✅ This query will safely search for exact username and password');
}

// Export functions สำหรับการทดสอบ
module.exports = {
    safeLogin,
    safeSearchUsers,
    safeUpdateUser,
    demonstrateSQLInjection
};

// เรียกใช้ demonstration หากไฟล์นี้ถูก run โดยตรง
if (require.main === module) {
    demonstrateSQLInjection();
}