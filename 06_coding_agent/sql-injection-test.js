// Test สำหรับการทดสอบ SQL injection prevention
const assert = require('assert');

// Mock database connection สำหรับการทดสอบ
class MockConnection {
    constructor() {
        this.lastQuery = '';
        this.lastParams = [];
    }
    
    query(sql, params, callback) {
        // หาก params เป็น function แสดงว่าไม่มีการส่ง parameters
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        this.lastQuery = sql;
        this.lastParams = params || [];
        
        // จำลองการ response ของฐานข้อมูล
        setTimeout(() => {
            callback(null, [{ id: 1, username: 'testuser', email: 'test@example.com' }]);
        }, 10);
    }
    
    getLastQuery() {
        return this.lastQuery;
    }
    
    getLastParams() {
        return this.lastParams;
    }
}

// สร้าง safe functions ที่ใช้ mock connection
function createSafeFunctions(connection) {
    return {
        safeLogin: (username, password) => {
            const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
            connection.query(query, [username, password], (err, results) => {
                // Mock response
            });
        },
        
        safeSearchUsers: (searchTerm) => {
            const query = 'SELECT * FROM users WHERE name LIKE ?';
            connection.query(query, [`%${searchTerm}%`], (err, results) => {
                // Mock response
            });
        },
        
        safeUpdateUser: (userId, newEmail) => {
            const query = 'UPDATE users SET email = ? WHERE id = ?';
            connection.query(query, [newEmail, userId], (err, results) => {
                // Mock response
            });
        }
    };
}

// สร้าง unsafe functions เพื่อเปรียบเทียบ
function createUnsafeFunctions(connection) {
    return {
        unsafeLogin: (username, password) => {
            const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
            connection.query(query, (err, results) => {
                // Mock response
            });
        },
        
        unsafeSearchUsers: (searchTerm) => {
            const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%'`;
            connection.query(query, (err, results) => {
                // Mock response
            });
        }
    };
}

// Test functions
function testParameterizedQueries() {
    console.log('🧪 Testing Parameterized Queries...');
    
    const mockConnection = new MockConnection();
    const safeFunctions = createSafeFunctions(mockConnection);
    
    // Test safe login
    safeFunctions.safeLogin('testuser', 'password123');
    assert.strictEqual(mockConnection.getLastQuery(), 'SELECT * FROM users WHERE username = ? AND password = ?');
    assert.deepStrictEqual(mockConnection.getLastParams(), ['testuser', 'password123']);
    console.log('✅ Safe login query test passed');
    
    // Test safe search
    safeFunctions.safeSearchUsers('john');
    assert.strictEqual(mockConnection.getLastQuery(), 'SELECT * FROM users WHERE name LIKE ?');
    assert.deepStrictEqual(mockConnection.getLastParams(), ['%john%']);
    console.log('✅ Safe search query test passed');
    
    // Test safe update
    safeFunctions.safeUpdateUser(1, 'newemail@example.com');
    assert.strictEqual(mockConnection.getLastQuery(), 'UPDATE users SET email = ? WHERE id = ?');
    assert.deepStrictEqual(mockConnection.getLastParams(), ['newemail@example.com', 1]);
    console.log('✅ Safe update query test passed');
}

function testSQLInjectionPrevention() {
    console.log('\n🛡️  Testing SQL Injection Prevention...');
    
    const mockConnection = new MockConnection();
    const safeFunctions = createSafeFunctions(mockConnection);
    const unsafeFunctions = createUnsafeFunctions(mockConnection);
    
    // ข้อมูลที่มี SQL injection payload
    const maliciousUsername = "admin' OR '1'='1' --";
    const maliciousPassword = "anything";
    
    // Test unsafe function (แสดงช่องโหว่)
    unsafeFunctions.unsafeLogin(maliciousUsername, maliciousPassword);
    const unsafeQuery = mockConnection.getLastQuery();
    console.log('❌ Unsafe query:', unsafeQuery);
    
    // ตรวจสอบว่า unsafe query มี SQL injection
    assert(unsafeQuery.includes("admin' OR '1'='1' --"), 'Unsafe query should contain injection payload');
    console.log('⚠️  SQL injection vulnerability detected in unsafe function');
    
    // Test safe function (ป้องกัน injection)
    safeFunctions.safeLogin(maliciousUsername, maliciousPassword);
    const safeQuery = mockConnection.getLastQuery();
    const safeParams = mockConnection.getLastParams();
    
    console.log('✅ Safe query:', safeQuery);
    console.log('✅ Safe parameters:', safeParams);
    
    // ตรวจสอบว่า safe query ใช้ placeholders
    assert.strictEqual(safeQuery, 'SELECT * FROM users WHERE username = ? AND password = ?');
    assert.deepStrictEqual(safeParams, [maliciousUsername, maliciousPassword]);
    console.log('✅ SQL injection prevented with parameterized query');
}

function testEdgeCases() {
    console.log('\n🔍 Testing Edge Cases...');
    
    const mockConnection = new MockConnection();
    const safeFunctions = createSafeFunctions(mockConnection);
    
    // Test with empty strings
    safeFunctions.safeLogin('', '');
    assert.deepStrictEqual(mockConnection.getLastParams(), ['', '']);
    console.log('✅ Empty string parameters handled correctly');
    
    // Test with special characters
    safeFunctions.safeLogin("user'with'quotes", 'pass"with"quotes');
    assert.deepStrictEqual(mockConnection.getLastParams(), ["user'with'quotes", 'pass"with"quotes']);
    console.log('✅ Special characters handled correctly');
    
    // Test with null values
    safeFunctions.safeLogin(null, null);
    assert.deepStrictEqual(mockConnection.getLastParams(), [null, null]);
    console.log('✅ Null values handled correctly');
    
    // Test with numbers
    safeFunctions.safeUpdateUser(123, 'test@example.com');
    assert.deepStrictEqual(mockConnection.getLastParams(), ['test@example.com', 123]);
    console.log('✅ Number parameters handled correctly');
}

function runAllTests() {
    console.log('🚀 Starting SQL Injection Prevention Tests\n');
    
    try {
        testParameterizedQueries();
        testSQLInjectionPrevention();
        testEdgeCases();
        
        console.log('\n🎉 All tests passed! SQL injection prevention is working correctly.');
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// เรียกใช้ tests หากไฟล์นี้ถูก run โดยตรง
if (require.main === module) {
    runAllTests();
}

module.exports = {
    MockConnection,
    createSafeFunctions,
    createUnsafeFunctions,
    runAllTests
};