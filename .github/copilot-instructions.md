### development workflow
 - Build
 - Test

 ### Rules
 - ก่อนที่จะรันเทส ให้เช็คก่อนว่ามี server หรือ client รันอยู่หรือเปล่า ถ้ามีไม่ต้องรันใหม่
 - ใช้ภาษาไทยในการตอบเท่านั้น

### การลบ Worktree และ Branch ที่ Copilot Agent สร้างขึ้น

หากพบข้อผิดพลาด `error: cannot delete branch '<branch>' used by worktree at '<path>'` ให้ทำตามขั้นตอนดังนี้:

**ขั้นตอนที่ 1: ลบ worktree ก่อน**
```bash
git worktree remove <path-to-worktree>
```
ตัวอย่าง:
```bash
git worktree remove /path/to/copilot-hands-on.worktrees/copilot-worktree-2026-03-08T16-17-45
```

**ขั้นตอนที่ 2: ถ้า directory ไม่มีอยู่แล้ว ให้ prune ก่อน**
```bash
git worktree prune
```

**ขั้นตอนที่ 3: ลบ branch**
```bash
git branch -d <branch-name>
```
> หมายเหตุ: `-d` จะลบได้เฉพาะ branch ที่ merge แล้วเท่านั้น หากต้องการบังคับลบ branch ที่ยังไม่ได้ merge ให้ใช้ `-D` แทน
ตัวอย่าง:
```bash
git branch -d copilot-worktree-2026-03-08T16-17-45
```

**ตรวจสอบ worktrees ทั้งหมด:**
```bash
git worktree list
```
