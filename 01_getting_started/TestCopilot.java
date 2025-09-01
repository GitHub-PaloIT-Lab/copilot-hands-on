// ไฟล์ทดสอบการทำงานของ Copilot ใน IntelliJ
// ลองพิมพ์โค้ดด้านล่างและดู Copilot แนะนำ

import java.util.stream.IntStream;

public class TestCopilot {
    
    // ตัวอย่าง 1: ฟังก์ชันทักทาย
    public String greet(String name) {
        // Copilot จะแนะนำการ return string
        return "Hello, " + name + "!";
    }
    
    // ตัวอย่าง 2: หาจำนวนเฉพาะ (Prime Number)
    public boolean isPrime(int number) {
        // ลองพิมพ์ return แล้วดู Copilot แนะนำ
        return number > 1 && IntStream.rangeClosed(2, (int)Math.sqrt(number))
            .noneMatch(i -> number % i == 0);
    }
    
    // ตัวอย่าง 3: เช็คเลขคู่คี่
    public boolean isEven(int number) {
        // Copilot จะแนะนำการเช็คเลขคู่คี่
        return number % 2 == 0;
    }
    
    // ตัวอย่าง 4: main method
    public static void main(String[] args) {
        System.out.println(new TestCopilot().greet("Alice"));
        System.out.println(new TestCopilot().isPrime(7));
        System.out.println(new TestCopilot().isEven(10));
    }
}
