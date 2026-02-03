# REACT MASTERY BLUEPRINT: TỪ TƯ DUY OBJECT ĐẾN KIẾN TRÚC ỨNG DỤNG

## GIỚI THIỆU

Tài liệu này được thiết kế dựa trên triết lý: **"React không phải là ma thuật, React là Cấu trúc dữ liệu và Hàm"**. Chương trình tập trung vào việc hiểu sâu bản chất (Deep Dive) thay vì chỉ học cú pháp bề mặt.

## PHẦN 1: LỘ TRÌNH HỌC TẬP CHI TIẾT (SYLLABUS)

### Giai đoạn 1: Bản chất cốt lõi (The Core & Mental Model)

_Mục tiêu: Hiểu những gì xảy ra "dưới nắp capo" trước khi React vẽ lên màn hình._

1. **React Element: Giải phẫu "Tế bào" của React**
    - 1.1. Định nghĩa lại
    - 1.2. Cấu trúc giải phẫu (Anatomy)
2. **Component: Cái máy in Object**
    - 2.1. Ôn tập: Cú pháp hàm chuẩn (Standard Function Syntax)
    - 2.2. Bản chất
    - 2.3. Phân loại `type`
3. **Props & Children: Cơ chế truyền tải**
    - 3.1. Props là bất biến (Read-only)
    - 3.2. Children: Lỗ hổng không gian
4. **Bài tập thực hành (Module 1)**

### Giai đoạn 2: Sự sống của Ứng dụng (State & Interactivity)

_Mục tiêu: Biến các Object tĩnh thành giao diện động._

1. **Tại sao biến thường không hoạt động?**
2. **Hook `useState`: Bộ nhớ của Component**
    - 2.1. Cú pháp chuẩn
    - 2.2. Mental Model: Snapshot (Ảnh chụp)
    - 2.3. Can you use other data types?
    - 2.4. A Warning on Objects & Arrays
3. **Event Handling: Bắt sự kiện đúng cách**
4. **Rendering Lists: Hiển thị mảng dữ liệu**
    - 4.0. Bản chất cốt lõi: Array vs Object
    - 4.1. Sử dụng `.map()`
    - 4.2. Tại sao cần `key`?
5. **Ví dụ tổng hợp (Complex Example)**
    - 5.0. Bài toán và Code mẫu
    - 5.1. Phân tích chi tiết ví dụ (Deep Dive)
    - 5.2. Luồng dữ liệu một chiều (One-way Data Flow)
    - 5.3. Props Destructuring: Hiểu sâu về Input
    - 5.4. Quy tắc đặt tên tham số (Parameter Naming)
    - 5.5. Quy ước đặt tên trong React (Naming Conventions)
    - 5.6. Tóm tắt: 4 Trụ cột React trong ví dụ
6. **Bài tập thực hành (Module 2)**

### Giai đoạn 3: Kết nối thế giới bên ngoài (Side Effects)

_Mục tiêu: Thoát khỏi "hộp kín" của React để tương tác với API, Browser._

1. **Pure Function vs Side Effects**
    - 1.1. Pure Function (Hàm thuần khiết) - Tiêu chuẩn vàng
    - 1.2. Side Effects (Tác dụng phụ) - Những kẻ phá bĩnh
2. **Hook `useEffect`: Nơi trú ẩn của Side Effects**
    - 2.1. Logic hoạt động
3. **Dependency Array: Cái phanh của useEffect**
4. **Cleanup Function: Dọn dẹp chiến trường**
5. **Bài tập thực hành (Module 3)**

### Giai đoạn 4: Kiến trúc và Luồng dữ liệu (Architecture)

_Mục tiêu: Tổ chức code cho ứng dụng lớn, Clean Code._

1. **Lifting State Up: Đưa trạng thái lên cao**
2. **Context API: Đường hầm xuyên không**
3. **Custom Hooks: Vũ khí của chuyên gia**
4. **Bài tập thực hành (Module 4)**

### Giai đoạn 5: Hiệu năng & Hệ sinh thái (Advanced)

1. **Performance: Nghệ thuật của việc "Lười biếng"**
    - 1.1. React.memo: Chiếc khiên bảo vệ
    - 1.2. useMemo & useCallback: Bộ nhớ đệm (Cache)
2. **Forms: Giao tiếp với người dùng**
    - 2.1. Controlled Component (Khuyên dùng)
    - 2.2. Uncontrolled Component
3. **Routing: Ảo thuật chuyển trang (SPA)**
    

## PHẦN 2: TÀI LIỆU CHI TIẾT - MODULE 1: BẢN CHẤT CỦA ELEMENT

### 1. React Element: Giải phẫu "Tế bào" của React

#### 1.1. Định nghĩa lại

React Element không phải là một node HTML thật trên trình duyệt. Nó là một **Plain JavaScript Object** (Object thuần túy) mô tả giao diện.

> **Mental Model:** Hãy coi Element là một "Bản thiết kế" hoặc một "Tờ order món ăn". Bạn đưa tờ order này cho React (đầu bếp), React sẽ làm ra món ăn thật (DOM Node).

#### 1.2. Cấu trúc giải phẫu (Anatomy)

Một Element Object tiêu chuẩn được React tạo ra sẽ có dạng:

```javascript
const element = {
  // 1. Loại danh tính (Identity)
  type: 'div', // Hoặc là function component: type: MyComponent
  
  // 2. Túi dữ liệu (Data bag)
  props: {
    id: 'container',
    className: 'wrapper',
    style: { color: 'red' }, // Style luôn là object (Lưu ý: property dùng camelCase, ví dụ `backgroundColor` thay vì `background-color`)
    
    // 3. Nội dung bên trong (Nesting)
    children: [
        // Chứa các Element Object con khác
        { type: 'span', props: { children: 'Hello' } } 
    ]
  },
  
  // 4. Các định danh đặc biệt (Sẽ học ở Module 2)
  key: null,
  ref: null
};
```

### 2. Component: Cái máy in Object

#### 2.1. Ôn tập: Cú pháp hàm chuẩn (Standard Function Syntax)

Cú pháp chung cho một hàm chuẩn trong JavaScript (và React) tuân theo mẫu sau:

```javascript
function functionName(parameters) {
  // Thân hàm (Body)
  // ... thực hiện công việc ...
  
  return value; // Kết quả trả về
}
```

Giải thích các thành phần:

1. **`function`**: Từ khóa báo hiệu "Tôi sắp định nghĩa một hành động mới."
2. **`functionName`**: Tên bạn đặt cho hàm (ví dụ: `calculateTotal`, `handleClick`).
3. **`(parameters)`**: Các đầu vào (inputs) cần thiết để hàm làm việc. Có thể để trống `()` nếu không cần đầu vào.
4. **`{ ... }`**: "Thân hàm" hay "khối lệnh". Mọi logic code đều nằm trong cặp ngoặc nhọn này.
5. **`return`**: Từ khóa để dừng hàm và gửi kết quả về nơi đã gọi nó.

**Ví dụ 1: Hàm có đầu vào và đầu ra**

Một cỗ máy nhận nguyên liệu và trả về một chiếc bánh.

```javascript
// Input: một số (x)
// Output: trả về một số
function double(x) {
  // 1. Thực hiện công việc (Do some work)
  console.log("Đang tính toán nhân đôi cho số: " + x);
  let result = x * 2;

  // 2. Trả về kết quả (Return result)
  return result;
}

// Sử dụng:
let result = double(5); // result trở thành 10
```

**Ví dụ 2: Hàm không có đầu vào (Tham số rỗng)**

Một cỗ máy chỉ đơn giản là cho bạn biết thời gian.

```javascript
// Input: Không
// Output: trả về chuỗi
function sayHello() {
  return "Hello World!";
}
```

**Ví dụ 3: Hàm không có giá trị trả về (Void)**

Một cỗ máy bật đèn lên nhưng không đưa lại cho bạn thứ gì.

```javascript
// Input: Không
// Output: Không (void)
function turnOnLight() {
  console.log("Light is on");
  // Không có từ khóa return ở đây ngầm hiểu là trả về 'undefined'
}
```

To understand the difference, think of a function like a **Calculator** (Returner), a **Commander** (Doer), or a **Cashier** (Both).

Here are the three types of arrow functions broken down by their behavior and syntax.

---

### **1. Returner Only (The "Calculator")**

These functions are pure logic. They take an input, process it, and hand back a result immediately. They do not change anything in the outside world.

```javascript
const double = (n) => n * 2;
```

| Category | Component | Description |
| --- | --- | --- |
| **Action** | `n * 2` | **Implicit Return:** The result is sent back automatically because there are no `{}`. |
| **Input** | `n` | **Data Type:** `Number`. |
| **Output** | `n * 2` | **Data Type:** `Number`. |
| **Behavior** | **Pure Calculation:** If you call this 100 times, nothing in your app changes; you just get numbers back. |  |

---

### **2. Doer Only (The "Commander")**

These functions perform an action but return "nothing" (`undefined`). They are used for side effects like logging, alerts, or updating global variables.

```javascript
const logSuccess = (userName) => {
  console.log("Access granted for: " + userName);
  alert("Welcome back!");
};
```

| Category | Component | Description |
| --- | --- | --- |
| **Action** | `console.log`, `alert` | **Side Effects:** Tasks performed in the browser/console. |
| **Input** | `userName` | **Data Type:** `String`. |
| **Output** | `undefined` | **Data Type:** `Undefined`. The function finishes and "dies" without giving data back. |
| **Behavior** | **Task Execution:** This changes the UI (shows an alert) but cannot be used to set a variable value. |  |

---

### **3. Both: Returner & Doer (The "Cashier")**

These functions perform a task (like logging or saving) **and** give you a result back. This is common when you want to confirm an action was successful or see the "before and after" of data.

```javascript
const updateAndNotify = (price, tax) => {
  const total = price + tax;          // 1. Math (Internal Variable)
  console.log("Total is: " + total);  // 2. Doer (Action)
  return total;                       // 3. Returner (Output)
};
```

| Category | Component | Description |
| --- | --- | --- |
| **Action** | `total = p + t` | **Calculation:** Preparing the data. |
| **Action** | `console.log` | **Action:** Notifying the developer. |
| **Input** | `price`, `tax` | **Data Type:** `Number`, `Number`. |
| **Output** | `total` | **Data Type:** `Number`. The final result sent back to the caller. |
| **Behavior** | **Hybrid:** It changes the outside world (log) and provides a value to be stored in state or another variable. |  |

---

### **Summary Table**

| Type | Syntax Hint | Analogy | Resulting Value |
| --- | --- | --- | --- |
| **Returner Only** | No `{}` or `return` keyword | A **Thermometer** (tells you the temp). | The calculation result. |
| **Doer Only** | Uses `{}` but no `return` | A **Doorbell** (makes a sound). | `undefined` |
| **Both** | Uses `{}` AND `return` | A **ATM** (gives cash AND prints a receipt). | The returned value. |

---

### **Natural Language Summary**

"You choose your arrow function style based on the goal: use the shorthand 'Returner' for quick math, the bracketed 'Doer' for triggering actions, and the full 'Hybrid' version when you need to perform a task and get an answer back at the same time."

#### 2.2. Bản chất

Component hiện đại là một **Hàm (Function)** bắt buộc có tên bắt đầu bằng **chữ cái in hoa** (ví dụ: `UserCard`).

- **Input:** Nhận vào một object tên là `props`.
    
- **Process:** Xử lý logic, tính toán.
    
- **Output:** Trả về một Element Object (thường viết dưới dạng JSX).
    

#### 2.3. Phân loại `type`

React dựa vào thuộc tính `type` trong Element Object để quyết định hành động:

| **Loại type** | **Giá trị**                    | **Hành động của React**                                                                                             |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **DOM Tag**   | Chuỗi String (`'div'`, `'h1'`) | **Vẽ ngay:** Tạo DOM Node tương ứng trên trình duyệt.                                                               |
| **Component** | Hàm Function (`UserCard`)      | **Hỏi tiếp:** Gọi hàm `UserCard(props)` để xem bên trong nó trả về cái gì. Tiếp tục đệ quy đến khi đạt đến DOM Tag. |

### 3. Props & Children: Cơ chế truyền tải

#### 3.1. Props là bất biến (Read-only)

Một nguyên tắc vàng: **Component không bao giờ được sửa đổi `props` của chính nó.** `props` là dữ liệu từ "Sếp" (Component cha) đưa xuống. "Nhân viên" (Component con) chỉ được dùng, không được sửa.

#### 3.2. Children: Lỗ hổng không gian

`children` là một prop đặc biệt giúp tạo ra các Component dạng **Container** (Hộp chứa).

**Best Practice:** Sử dụng `children` để tối ưu hóa việc tái sử dụng layout.

**Ví dụ Code (Tư duy Best Practice):**

```jsx
// 1. Tạo cái Khung (Container)
// Component này không quan tâm nội dung bên trong là gì, chỉ lo cái vỏ.
const Card = ({ children, theme }) => { // Destructuring props trực tiếp
  const style = theme === 'dark' ? { background: '#333', color: '#fff' } : { background: '#fff' };
  return (
    <div className="card-shadow" style={style}>
      {children} {/* Nơi nội dung được bơm vào */}
    </div>
  );
};

// 2. Sử dụng (Implementation)
function App() {
  return (
    <main>
      {/* Tái sử dụng lần 1: Chứa ảnh và text */}
      <Card theme="light">
         <img src="avatar.png" />
         <h3>User Profile</h3>
      </Card>

      {/* Tái sử dụng lần 2: Chứa form */}
      <Card theme="dark">
         <h3>Login</h3>
         <input type="text" />
      </Card>
    </main>
  );
}
```

### 4. Bài tập thực hành (Module 1)

**Yêu cầu:** Không dùng JSX, hãy dùng `React.createElement` (hoặc viết object literal giả lập) để tạo ra cấu trúc sau. Bài tập này giúp não bộ khắc ghi cấu trúc Object.

**HTML mục tiêu:**

```html
<div id="app">
  <h1 class="title">My App</h1>
  <button onclick="alert('hi')">Click me</button>
</div>
```

**Lời giải (Tư duy Object):**

```javascript
const appElement = {
  type: 'div',
  props: {
    id: 'app',
    children: [
      {
        type: 'h1',
        props: { className: 'title', children: 'My App' }
      },
      {
        type: 'button',
        props: { 
            onClick: () => alert('hi'), // Chú ý: Event trong React dùng camelCase (onClick) khác với HTML (onclick) 
            children: 'Click me' 
        }
      }
    ]
  }
};
```

## PHẦN 3: TÀI LIỆU CHI TIẾT - MODULE 2: STATE VÀ SỰ TƯƠNG TÁC (INTERACTIVITY)

### 1. Tại sao biến thường không hoạt động?

Hãy bắt đầu bằng một sai lầm kinh điển của người mới học. Giả sử ta muốn làm bộ đếm số lần click.

**❌ Cách làm sai (Tư duy Javascript thường):**

```jsx
function Counter() {
  let count = 0; // Biến cục bộ

  function handleClick() {
    count = count + 1;
    console.log(count); // Log ra 1, 2, 3... nhưng màn hình vẫn hiện 0
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

**Tại sao sai?**

1. **Biến cục bộ không tồn tại lâu dài:** Mỗi khi Component render lại (chạy lại hàm `Counter`), biến `count` lại được khởi tạo lại bằng 0.
    
2. **React không biết:** Việc thay đổi biến `count` không kích hoạt cơ chế render lại. React "mù" trước sự thay đổi này.
    

👉 **Giải pháp:** Cần một cơ chế để báo hiệu cho React: _"Dữ liệu thay đổi rồi, hãy chạy lại hàm component và vẽ lại giao diện đi!"_ => Đó là **State**.

### 2. Hook `useState`: Bộ nhớ của Component

`useState` là một Hook (cái móc) giúp Component có thể "ghi nhớ" thông tin giữa các lần render.

#### 2.1. Cú pháp chuẩn

```javascript
const [state, setState] = useState(initialValue);
```

- **`state`**: Biến chứa giá trị hiện tại (Ví dụ: `count` = 0).
    
- **`setState`**: Hàm dùng để cập nhật giá trị **VÀ** kích hoạt React render lại.
    
- **`initialValue`**: Giá trị khởi tạo lần đầu tiên.
    

#### 2.2. Mental Model: Snapshot (Ảnh chụp)

Đây là phần khó hiểu nhất nhưng quan trọng nhất. Hãy khắc cốt ghi tâm câu này:

> **"State updates trigger re-renders." (Cập nhật State sẽ kích hoạt Render lại)**

**Quy trình diễn ra:**

1. **Lần đầu tiên (Mount):**
    
    - React gọi `Counter()`.
        
    - `useState(0)` trả về `[0, setCount]`.
        
    - Component trả về JSX với số `0`.
        
    - React vẽ số `0` lên màn hình.
        
2. **Người dùng bấm nút (Click):**
    
    - Hàm `handleClick` gọi `setCount(1)`.
        
    - React nhận tín hiệu: "À, dữ liệu cũ hỏng rồi, cần vẽ lại".
        
3. **Lần render thứ 2 (Re-render):**
    
    - React gọi lại `Counter()`.
        
    - `useState(0)` lúc này cực thông minh, nó nhớ giá trị cũ là 1, nên trả về `[1, setCount]`.
        
    - Component trả về JSX với số `1`.
        
    - React cập nhật số `1` lên màn hình.
        

**Ví dụ code minh họa:**

```jsx
import { useState } from 'react';

function Counter() {
  // useState creates a "memory slot" for this component
  // Initial value: 0
  const [count, setCount] = useState(0);

  function handleClick() {
    // This tells React: "Hey, the data changed! Please re-render!"
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>
        Click me!
      </button>
    </div>
  );
}

export default Counter;
```

**Điều gì xảy ra khi bạn click nút 3 lần?**

| Lần click | Giá trị `count` | Hành động của React |
|---|---|---|
| **Lần đầu (Mount)** | `0` | Render lần đầu, hiển thị "Count: 0" |
| **Click 1** | `0 → 1` | `setCount(1)` được gọi → React so sánh → Re-render → Hiển thị "Count: 1" |
| **Click 2** | `1 → 2` | `setCount(2)` được gọi → React so sánh → Re-render → Hiển thị "Count: 2" |
| **Click 3** | `2 → 3` | `setCount(3)` được gọi → React so sánh → Re-render → Hiển thị "Count: 3" |

**Điểm quan trọng:**

**Về Event Handler:**
- `handleClick() {}` là **Wrapper Function** (Outer Function), đóng vai trò là **Event Handler**.
- Khi user click, trình duyệt gọi Wrapper Function này, và bên trong nó mới gọi `setState()`/`setCount()`.

**Về cơ chế Nhân - Quả (Cause & Effect):**

> **NGUYÊN NHÂN:** Sự thay đổi của `A` (trong `setState(A)`) kích hoạt re-render.  
> **KẾT QUẢ:** Biến `state` thay đổi chỉ sau khi re-render hoàn tất.

**Lưu ý:** `A` có thể là:

**1. Giá trị cụ thể** (Literal Value): `setState(5)`, `setState("Hello")`
- React so sánh giá trị mới với giá trị cũ.
- **Nếu khác nhau** → Re-render.
- **Nếu giống nhau** → React bỏ qua, không re-render (tối ưu hóa).

**Ví dụ minh họa:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(5)}>Set to 5</button>
      <button onClick={() => setCount(10)}>Set to 10</button>
    </div>
  );
}
```

**Kịch bản click:**

| Hành động | Giá trị cũ | Giá trị mới (`A`) | So sánh | Kết quả |
|---|---|---|---|---|
| Click "Set to 5" lần 1 | `0` | `5` | `0 ≠ 5` | ✅ Re-render |
| Click "Set to 5" lần 2 | `5` | `5` | `5 = 5` | ❌ Không re-render |
| Click "Set to 5" lần 3 | `5` | `5` | `5 = 5` | ❌ Không re-render |
| Click "Set to 10" | `5` | `10` | `5 ≠ 10` | ✅ Re-render |
| Click "Set to 5" lần 4 | `10` | `5` | `10 ≠ 5` | ✅ Re-render (vì khác!) |

**Kết luận:** Giá trị cụ thể **không phải** chỉ re-render 1 lần. Nó có thể re-render nhiều lần, miễn là giá trị mới **khác** với giá trị hiện tại.

---

**2. Biến** (Variable): `setState(newValue)`

**Câu hỏi quan trọng:** Tôi có thể thay đổi biến `newValue` ở bên ngoài, sau đó gọi `setState(newValue)` để kích hoạt re-render không?

**Trả lời:** **CÓ**, nhưng phụ thuộc vào **kiểu dữ liệu** của biến.

React so sánh theo 2 cách khác nhau:

**A. Kiểu nguyên thủy (Primitive Types):** Number, String, Boolean
- React so sánh **GIÁ TRỊ** (Value Comparison).
- Bạn có thể thay đổi biến bên ngoài và `setState(newValue)` sẽ hoạt động.

**Ví dụ - Hoạt động tốt:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    let newValue = 10;        // Tạo biến bên ngoài
    newValue = newValue + 5;  // Biến đổi biến
    setCount(newValue);       // Gọi setState với biến đã thay đổi
    // React so sánh: 0 ≠ 15 → Re-render ✅
  }
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**B. Kiểu tham chiếu (Reference Types):** Object, Array
- React so sánh **ĐỊA CHỈ BỘ NHỚ** (Reference Comparison), không so sánh nội dung bên trong.
- **Nếu bạn chỉ sửa nội dung** mà không tạo object/array mới → React **KHÔNG** phát hiện thay đổi.

**Ví dụ - ❌ KHÔNG hoạt động:**

```jsx
function UserProfile() {
  const [user, setUser] = useState({ name: "An", age: 25 });
  
  function handleClick() {
    let newUser = user;      // newUser trỏ đến CÙNG địa chỉ với user
    newUser.age = 30;        // Sửa nội dung (Mutation)
    setUser(newUser);        // ❌ React so sánh địa chỉ: GIỐNG NHAU → Không re-render
  }
  
  return <button onClick={handleClick}>Age: {user.age}</button>;
}
```

**Ví dụ - ✅ Hoạt động (Tạo object mới):**

```jsx
function UserProfile() {
  const [user, setUser] = useState({ name: "An", age: 25 });
  
  function handleClick() {
    let newUser = { ...user };  // Tạo object MỚI (địa chỉ khác)
    newUser.age = 30;           // Sửa nội dung
    setUser(newUser);           // ✅ React so sánh địa chỉ: KHÁC NHAU → Re-render
  }
  
  return <button onClick={handleClick}>Age: {user.age}</button>;
}
```

**Bảng tóm tắt:**

| Kiểu dữ liệu | Cách so sánh | Thay đổi biến bên ngoài | Kết quả |
|---|---|---|---|
| **Primitive** (Number, String, Boolean) | So sánh **giá trị** | `let x = 5; x = 10; setState(x)` | ✅ Hoạt động |
| **Object/Array** (Mutation) | So sánh **địa chỉ** | `let obj = state; obj.x = 10; setState(obj)` | ❌ Không re-render |
| **Object/Array** (New Reference) | So sánh **địa chỉ** | `let obj = {...state}; obj.x = 10; setState(obj)` | ✅ Hoạt động |

**Kết luận:** Bạn có thể thay đổi biến bên ngoài, nhưng với Object/Array, bạn **PHẢI tạo bản sao mới** (new reference) thay vì sửa trực tiếp (mutation).

**3. Hàm** (Function/Callback): `setState(prev => prev + 1)`

---

#### Kiến thức nền tảng: Callback Function là gì?

Trước khi đi sâu vào `setState(prev => ...)`, hãy hiểu **Callback Function** - một khái niệm cốt lõi trong JavaScript.

**Định nghĩa:**

**Callback Function** là một hàm được bạn **truyền vào** một hàm khác như một tham số. Hàm nhận tham số đó sẽ thực thi (gọi lại - "call back") hàm của bạn tại một thời điểm nào đó.

> *"Tôi giao cho bạn nhiệm vụ này. Khi nào làm xong thì **gọi lại** (callback) cho tôi nhé."*

---

#### Mô hình cơ bản: `functionA(functionB)`

**Chính xác 100%!** Định nghĩa ngắn gọn nhất:

> Bất cứ khi nào bạn truyền **tên** một hàm (`functionB`) vào bên trong ngoặc đơn của một hàm khác (`functionA`), thì `functionB` chính là **Callback Function**.

Trong mô hình `functionA(functionB)`:

1. **`functionB`**: Được gọi là **Callback Function** (Hàm được gọi lại). Nó đóng vai trò là "khách" hoặc "công cụ" được gửi đi.
2. **`functionA`**: Trong kỹ thuật, người ta gọi nó là **Higher-Order Function** (Hàm bậc cao). Nó đóng vai trò là "chủ nhà" hoặc "người thực thi". Nó nhận `functionB` và sẽ quyết định *khi nào* thì kích hoạt `functionB`.

#### Quy tắc "sống còn" để nhận diện Callback

Để là một callback hợp lệ, khi truyền vào, bạn **KHÔNG ĐƯỢC** dùng dấu ngoặc tròn `()` sau tên hàm.

* ✅ **ĐÚNG là Callback:**
  ```javascript
  functionA(functionB)
  ```
  *(Dịch: "Này A, cầm lấy cái bản thiết kế B này, lúc nào cần thì dùng nhé.")*

* ❌ **SAI (Không phải Callback):**
  ```javascript
  functionA(functionB())
  ```
  *(Dịch: "Này A, tôi đã chạy xong hàm B rồi, tôi đưa cho ông cái kết quả (ví dụ số 10, hay chuỗi text) mà hàm B trả về nhé.")* 
  
  → Lúc này `functionA` nhận **kết quả** chứ không nhận **cái hàm**.

#### Hình ảnh ẩn dụ: Nồi đa năng

Bạn cứ nhớ hình ảnh này:

* **Callback (`functionB`)**: Là cái **phương pháp** (Ví dụ: phương pháp "chiên", "xào", "luộc").
* **Hàm chính (`functionA`)**: Là cái **nồi đa năng**.

Bạn bỏ phương pháp "chiên" vào nồi → Nồi sẽ chiên.  
Bạn bỏ phương pháp "luộc" vào nồi → Nồi sẽ luộc.

---

**Ví dụ đời sống: Đặt Pizza**

1. **Hành động:** Bạn gọi điện đặt Pizza.
2. **Vấn đề:** Pizza cần 20 phút để nướng. Bạn không muốn cầm điện thoại chờ im lặng suốt 20 phút (điều này sẽ làm "treo" bạn).
3. **Giải pháp (Callback):** Bạn nói: *"Khi nào Pizza xong, hãy gọi vào số này cho tôi"* (số điện thoại = **Callback Function**).
4. **Kết quả:** Bạn cúp máy và làm việc khác. Khi Pizza xong, nhân viên gọi lại số bạn đã đưa (thực thi Callback).

**Tại sao cần Callback?**

- **Xử lý bất đồng bộ (Asynchronous):** Máy tính không phải ngồi chờ một tác vụ nặng (tải file, gọi API, chờ user click) làm xong mới chạy tiếp. Chương trình không bị "đơ".
- **Tái sử dụng code:** Viết hàm chung, cho phép tùy biến hành động cuối cùng bằng các callback khác nhau.

**Phân loại Callback:**

**A. Callback Đồng bộ (Synchronous)** - Thực thi ngay lập tức

```javascript
const numbers = [1, 2, 3, 4, 5];

// isEven là callback function
function isEven(num) {
  return num % 2 === 0;
}

// filter() nhận isEven làm tham số và gọi nó cho từng phần tử
const evenNumbers = numbers.filter(isEven);
console.log(evenNumbers); // [2, 4]
```

**B. Callback Bất đồng bộ (Asynchronous)** - Thực thi sau khi tác vụ hoàn thành

```javascript
console.log("1. Bắt đầu");

// setTimeout nhận callback function làm tham số
setTimeout(function() {
  console.log("2. Xin chào sau 2 giây!");
}, 2000);

console.log("3. Kết thúc");

/*
Kết quả:
1. Bắt đầu
3. Kết thúc
... (chờ 2 giây) ...
2. Xin chào sau 2 giây!
*/
```

**Lưu ý:** Dòng số 3 chạy trước dòng số 2 - đó chính là lợi ích của bất đồng bộ: không chặn code phía sau.

---

#### Callback trong React `setState()`

Bây giờ áp dụng khái niệm callback vào React:

**Callback function logic trong `setState()` là gì?**

Thay vì truyền **giá trị cố định** vào `setState()`, bạn truyền một **hàm (callback function)**. React sẽ:
1. Gọi hàm này
2. Truyền vào tham số `prev` (giá trị state **mới nhất** từ hàng đợi cập nhật)
3. Lấy giá trị mà hàm **return** làm state mới

**Đặc điểm:** Callback trong `setState()` là **đồng bộ** (synchronous) - React gọi nó ngay lập tức trong quá trình xử lý hàng đợi cập nhật.

**Cú pháp:**
```jsx
setState(prev => prev + 1)
//       ↑      ↑
//       |      └─ Giá trị return (state mới)
//       └──────── Tham số (state hiện tại/mới nhất)
```

---

**So sánh: Giá trị trực tiếp vs Callback Function**

**Tình huống:** Bạn muốn tăng `count` lên 3 đơn vị khi click 1 lần.

**❌ Cách 1: Truyền giá trị trực tiếp (Sai - Stale Closure)**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    setCount(count + 1);  // count = 0 → Lên lịch cập nhật thành 1
    setCount(count + 1);  // count VẪN = 0 → Lên lịch cập nhật thành 1
    setCount(count + 1);  // count VẪN = 0 → Lên lịch cập nhật thành 1
    // Kết quả: count chỉ tăng lên 1 (không phải 3!)
  }
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Tại sao sai?**
- Trong **cùng một lần render**, biến `count` bị "đóng băng" (closure) ở giá trị `0`.
- Cả 3 lần gọi `setCount` đều đọc `count = 0`, nên cả 3 đều tính `0 + 1 = 1`.
- React nhận 3 lệnh: "Cập nhật thành 1", "Cập nhật thành 1", "Cập nhật thành 1" → Kết quả cuối: `1`.

---

**✅ Cách 2: Truyền callback function (Đúng)**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    setCount(prev => prev + 1);  // prev = 0 → return 1
    setCount(prev => prev + 1);  // prev = 1 → return 2
    setCount(prev => prev + 1);  // prev = 2 → return 3
    // Kết quả: count tăng lên 3 ✅
  }
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Tại sao đúng?**
- React xử lý **tuần tự** các callback trong hàng đợi (queue).
- Lần 1: `prev = 0` → return `1` → React lưu tạm `1`
- Lần 2: `prev = 1` (giá trị mới nhất) → return `2` → React lưu tạm `2`
- Lần 3: `prev = 2` → return `3` → React lưu tạm `3`
- Sau đó mới re-render với `count = 3`.

---

**Timeline so sánh chi tiết:**

| Thời điểm | Cách 1: `setCount(count + 1)` | Cách 2: `setCount(prev => prev + 1)` |
|---|---|---|
| **Trước click** | `count = 0` | `count = 0` |
| **Lệnh 1** | Đọc `count = 0` → Lên lịch `1` | Callback nhận `prev = 0` → return `1` |
| **Lệnh 2** | Đọc `count = 0` (vẫn cũ) → Lên lịch `1` | Callback nhận `prev = 1` → return `2` |
| **Lệnh 3** | Đọc `count = 0` (vẫn cũ) → Lên lịch `1` | Callback nhận `prev = 2` → return `3` |
| **Kết quả** | `count = 1` ❌ | `count = 3` ✅ |

---

**Khi nào dùng Callback Function?**

| Tình huống | Dùng gì? | Ví dụ |
|---|---|---|
| Cập nhật **dựa trên giá trị cũ** | ✅ Callback | `setCount(prev => prev + 1)` |
| Cập nhật **nhiều lần liên tiếp** trong cùng event | ✅ Callback | 3 lần `setCount` trong 1 `handleClick` |
| Cập nhật **giá trị cố định** | Giá trị trực tiếp | `setCount(10)` |
| Cập nhật **không phụ thuộc** state cũ | Giá trị trực tiếp | `setName("John")` |

---

**Ưu điểm của Callback Function:**
- ✅ Luôn nhận giá trị **mới nhất** từ hàng đợi cập nhật.
- ✅ Tránh lỗi **stale closure** (đọc giá trị cũ bị "đóng băng").
- ✅ An toàn khi có nhiều lần cập nhật liên tiếp.

**Kết luận:** Khi cập nhật state dựa trên giá trị cũ, **luôn dùng callback function** `setState(prev => ...)` thay vì `setState(state + 1)`.

**Timeline chi tiết (Quy trình thực tế):**

Ví dụ với `const [count, setCount] = useState(0)`:

1. **Hành động:** User click → `handleClick()` gọi `setCount(1)`.
2. **React kiểm tra:** React lấy giá trị `1` (đối số `A`) so sánh với `0` (giá trị cũ trong kho lưu trữ nội bộ).
3. **Quyết định:** Thấy khác nhau → React lên lịch (schedule) re-render.
4. **Thực thi:** React chạy lại hàm `Counter()` lần thứ 2.
5. **Kết quả:** Ở lần chạy thứ 2, `useState(0)` trả về `[1, setCount]`. Lúc này biến `count` mới chính thức mang giá trị `1`.

**Tại sao biến `state` không phải nguyên nhân?**
- Vì `const [state, setState] = useState(...)` → Từ khóa `const` có nghĩa biến `state` **bị đóng băng** trong mỗi lần render.
- Bạn **không thể** thay đổi `state` trực tiếp. Bạn chỉ có thể "yêu cầu" React đổi nó cho lần render sau thông qua `setState(A)`.

**Mental Model: Máy in ảnh**

Hãy tưởng tượng Component là **Máy in ảnh** và `state` là **Tờ ảnh** đang cầm trên tay.

- **Bạn (User):** Gọi `setState(Ảnh Mới)`.
- **React:** So sánh "Ảnh Mới" (A) và "Ảnh Cũ". Thấy khác nhau → React bấm nút "In lại".
- **Máy in (Re-render):** Chạy vù vù và in ra một tờ giấy mới.
- **Kết quả:** Lúc này trên tay bạn mới cầm **Tờ ảnh mới** (`state` mới).

**Bảng tóm tắt:**

| Đối tượng | Vai trò | Diễn giải |
|---|---|---|
| **`setState(A)`** | **Kích hoạt (Trigger/Cause)** | "Này React, tôi muốn giá trị lần tới là `A`. Hãy kiểm tra và chạy lại đi!" |
| **`state`** | **Kết quả (Result/Snapshot)** | Là giá trị React đưa cho bạn **SAU KHI** đã re-render xong. |

**Tóm lại:** Bạn gọi `setState(A)` → React so sánh `A` với giá trị cũ → Thấy khác biệt → React chạy lại hàm → Biến `state` mới được sinh ra.

#### 2.3. Can you use other data types?

When you write `useState(0)`, you are telling React: **"The initial value of this variable is the number `0`."**

Because JavaScript is dynamic, `count` becomes a **Number**.

**Yes!** `useState` can hold **absolutely anything** that JavaScript supports. It is not limited to numbers.

Here are the most common examples you will use:

##### 1. Text (String)

Used for names, input fields, or messages.

```javascript
const [name, setName] = useState("Phuong");
// usage: setName("Gemini")
```

##### 2. True/False (Boolean)

Used for toggles, switches, or showing/hiding things (like "Dark Mode").

```javascript
const [isMenuOpen, setIsMenuOpen] = useState(false);
// usage: setIsMenuOpen(true)
```

##### 3. Lists (Arrays)

Used for storing lists of data (like a list of tasks or products).

```javascript
const [tasks, setTasks] = useState(["Buy milk", "Clean room"]);
// usage: setTasks([...tasks, "New Task"])
```

*Note: We will talk about that `...` syntax later; it's a special way to add items to arrays in React.*

##### 4. Objects

Used when you have related data (like a user profile).

```javascript
const [user, setUser] = useState({ 
  name: "Phuong", 
  device: "iMac M1" 
});
```

##### 5. Nothing (null)

Used when you are waiting for data to load (like waiting for a stock price to download).

```javascript
const [data, setData] = useState(null);
```

#### 2.4. A Warning on Objects & Arrays

Remember our discussion about **"The New Object"**? This is very important for **Arrays** and **Objects**.

If you have a user object, you **cannot** just change one property like this:

```javascript
// ❌ WRONG: React won't see this change!
user.name = "New Name"; 
setUser(user); 
```

You must give React a **brand new object** for it to recognize the change:

```javascript
// ✅ RIGHT: Create a new object with the new data
setUser({ 
  name: "New Name", 
  device: "iMac M1" 
});
```

### 3. Event Handling: Bắt sự kiện đúng cách

Trong React Element Object, sự kiện (Event) chỉ là một property nằm trong `props`.

**Quy tắc:**

1. Tên sự kiện dùng **camelCase** (`onClick`, `onSubmit`, `onMouseEnter`).
    
2. Truyền vào **Hàm definition** (định nghĩa hàm), không phải gọi hàm ngay lập tức.
    

**✅ Đúng:**

```jsx
<button onClick={handleClick}>Click me</button>
```

_(Dịch: "React ơi, khi nào user click thì hãy gọi hàm này giúp tôi")_

**❌ Sai (Gọi hàm ngay lập tức):**

```jsx
<button onClick={handleClick()}>Click me</button>
```

_(Dịch: "Gọi hàm này ngay bây giờ đi", kết quả trả về của hàm sẽ được gán vào onClick -> Sai logic và có thể gây vòng lặp vô tận)_

#### Ví dụ mã nguồn đầy đủ (Full Simple Example)

Đây là code của một component hoàn chỉnh mà bạn có thể copy để chạy thử:

```jsx
function AlertButton() {
  // Logic xử lý sự kiện
  function handleClick() {
    alert("Xin chào! Bạn đã bắt sự kiện thành công.");
  }

  // JSX trả về
  return (
    <button onClick={handleClick}>
      Bấm vào đây
    </button>
  );
}
```

#### Ví dụ nâng cao: Custom Button với Props & Events

Trong thực tế, bạn sẽ thường xuyên truyền hàm xử lý sự kiện từ Component cha xuống Component con thông qua Props.

```jsx
// 1. Component con (Nhận props)
// Nhiệm vụ: Hiển thị giao diện & báo cáo lại khi được click
function CustomButton({ label, onCustomClick }) {
  // label: "Delete", "Save", ...
  // onCustomClick: Là cái hàm từ cha truyền xuống
  
  return (
    // Nối dây: Sự kiện onClick thật của browser -> gọi hàm onCustomClick của cha
    <button onClick={onCustomClick} style={{ padding: '10px', margin: '5px' }}>
      {label}
    </button>
  );
}

// 2. Component cha (Định nghĩa logic)
// Nhiệm vụ: Quyết định điều gì xảy ra khi con được click
function App() {
  
  const handleDelete = () => {
    alert("Đang xóa dữ liệu...");
  };

  const handleSave = () => {
    console.log("Đã lưu thành công!");
  };

  return (
    <div>
      <h1>Event Handling Demo</h1>
      {/* Truyền hàm handleDelete xuống cho con dùng */}
      <CustomButton label="Xóa" onCustomClick={handleDelete} />
      
      {/* Tái sử dụng: Truyền hàm handleSave xuống */}
      <CustomButton label="Lưu" onCustomClick={handleSave} />
    </div>
  );
}
```

#### Mental Model: Cơ chế "Chuông cửa" (Waiting vs Running)

Hàm `handleDelete` này **không hề chạy liên tục**. Nó đang ở trạng thái **"Chờ lệnh" (Waiting)**.

Hãy tưởng tượng `handleDelete` giống như một cái **Chuông cửa**:

1.  **Dòng code `const handleDelete = ...`**: Giống như việc bạn lắp cái chuông lên tường. Bạn chỉ lắp nó ở đó thôi, lúc này nó **im lặng**.
2.  **Dòng code `<CustomButton ... />`**: Giống như việc bạn dán tờ giấy "Hãy bấm vào đây" lên cái chuông.
3.  **Hành động Click**: Chỉ khi ngón tay người dùng **chạm vào nút**, cái chuông mới kêu (hàm `alert` mới chạy).

**Quy trình thực tế diễn ra như sau:**

1.  **Khởi tạo (Definition):** Khi `App` (Component cha) hiện lên màn hình, nó tạo ra hàm `handleDelete` và giữ nó trong bộ nhớ. Lúc này hàm **chưa chạy**.
2.  **Truyền đi (Passing Props):** Nó đưa hàm này cho `CustomButton` (Component con) thông qua prop `onCustomClick`.
3.  **Gắn sự kiện (Wiring):** `CustomButton` gắn hàm này vào sự kiện `onClick` của thẻ `<button>`.
4.  **Kích hoạt (Trigger):** Người dùng bấm chuột -> Trình duyệt báo "Có click rồi!" -> Hàm `handleDelete` mới được gọi -> **Alert hiện ra**.

#### Khi nào thì một hàm chạy liên tục? (Lỗi thường gặp)

Hàm chỉ chạy liên tục (hoặc tự động chạy ngay lập tức) nếu bạn mắc lỗi viết sai như sau:

**❌ Sai (Chạy ngay khi mở web):**

```jsx
// Nếu bạn viết thêm dấu () ở cuối
<button onClick={handleDelete()} /> 
// handleDelete() -> Dấu () có nghĩa là "Chạy ngay đi!"
// Kết quả: Alert hiện lên ngay khi trang web vừa tải xong, không cần bấm.
```

---

##### Góc chuyên gia: 3 Trạng thái của hàm (Function)

Dưới đây là bảng tổng kết toàn diện về 3 trạng thái của hàm (Function) trong React/JavaScript. Đây là kiến thức cốt lõi để bạn làm chủ việc xử lý sự kiện.

Giả sử chúng ta có một hàm gốc:

```javascript
function nauAn(monAn) {
  console.log("Đang nấu món: " + monAn);
}
```

##### 1. EXECUTION (Thực thi ngay)

* **Cú pháp:** `nauAn('Phở')` (Có dấu ngoặc `()`).
* **Ý nghĩa:** **"CHẠY NGAY ĐI!"**
* **Cơ chế:**
    * Trình duyệt thấy dòng này -> Gọi hàm chạy ngay lập tức.
    * Sau khi chạy xong, nó lấy **kết quả trả về** (return value) để gán vào biến. Nếu hàm không return gì, kết quả là `undefined`.


* **Trong `onClick`:** Đây thường là **LỖI SAI**.
    * `onClick={nauAn()}` -> Nấu ngay khi mở web -> Gán `undefined` vào nút bấm -> Bấm nút không tác dụng.



##### 2. DEFINITION (Định nghĩa / Khai báo mới)

* **Cú pháp:** `() => nauAn('Phở')` (Hàm mũi tên).
* **Ý nghĩa:** **"TẠO QUY TRÌNH MỚI"**.
* **Cơ chế:**
    * Bạn đang tạo ra một cái hộp (hàm ẩn danh) bọc lấy lệnh gọi bên trong.
    * Trình duyệt thấy dòng này -> Nó chỉ tạo cái hộp và để đó, **chưa chạy** ruột bên trong.
    * Chỉ khi nào `onClick` được kích hoạt, nó mới mở hộp ra và chạy lệnh.


* **Trong `onClick`:** Dùng khi cần **TRUYỀN THAM SỐ**.

##### 3. REFERENCE (Tham chiếu / Trỏ tới)

* **Cú pháp:** `nauAn` (Không có dấu ngoặc).
* **Ý nghĩa:** **"ĐƯA ĐỊA CHỈ"**.
* **Cơ chế:**
    * Bạn không gọi hàm, cũng không tạo hàm mới. Bạn chỉ chỉ tay vào cái hàm đã có sẵn trong bộ nhớ.
    * Bạn bảo React: "Đây là địa chỉ của thợ nấu ăn. Khi nào cần thì gọi nó".


* **Trong `onClick`:** Cách **TỐI ƯU NHẤT** (nếu không cần truyền tham số).

---

##### Bảng so sánh tóm tắt

| Đặc điểm | **EXECUTION** (Thực thi) | **DEFINITION** (Định nghĩa) | **REFERENCE** (Tham chiếu) |
| --- | --- | --- | --- |
| **Cú pháp** | `handleDelete()` | `() => handleDelete()` | `handleDelete` |
| **Hình ảnh** | Châm ngòi pháo nổ ngay. | Gói pháo vào hộp quà. | Đưa tấm bản đồ kho báu. |
| **Khi nào chạy?** | **NGAY LẬP TỨC** (khi Render). | **KHI CLICK** (Sự kiện xảy ra). | **KHI CLICK** (Sự kiện xảy ra). |
| **Hiệu năng** | (Không bàn vì logic sai). | Tốn chút bộ nhớ (Tạo hàm mới mỗi lần render). | **Tốt nhất** (Dùng lại hàm cũ). |
| **Truyền tham số** | Có (Nhưng bị lỗi chạy ngay). | **ĐƯỢC** (Cách duy nhất để truyền tham số an toàn). | Không (Chỉ nhận tham số mặc định `event`). |
| **Kết luận** | ❌ **SAI** (Trừ trường hợp đặc biệt). | ✅ **DÙNG** khi cần tham số (ID, index...). | ✅ **DÙNG** cho các nút bấm đơn giản. |

---

##### Ví dụ Code thực tế

Hãy xem sự khác biệt trong một Component:

```javascript
function Menu() {
  
  // Hàm xử lý chung
  const order = (food) => {
    alert("Bạn đã gọi món: " + food);
  }

  // Hàm đơn giản không tham số
  const goHome = () => {
    alert("Đi về!");
  }

  return (
    <div>
      {/* TRƯỜNG HỢP 1: REFERENCE (Chuẩn, gọn gàng) */}
      {/* Dùng khi hàm không cần tham số riêng từ mình */}
      <button onClick={goHome}>
        Về nhà
      </button>

      {/* TRƯỜNG HỢP 2: DEFINITION (Chuẩn, linh hoạt) */}
      {/* Dùng khi BẮT BUỘC phải truyền tham số ("Phở") */}
      <button onClick={() => order("Phở")}>
        Gọi Phở
      </button>

      {/* TRƯỜNG HỢP 3: EXECUTION (LỖI !!!) */}
      {/* Alert "Cơm Tấm" hiện lên ngay khi F5 trang web */}
      {/* Bấm nút này sẽ KHÔNG chạy gì cả */}
      <button onClick={order("Cơm Tấm")}>
        Gọi Cơm (Lỗi)
      </button>
    </div>
  );
}
```

##### Lời khuyên "bỏ túi":

1. Viết `onClick={tenHam}` trước.
2. Nếu thấy báo lỗi thiếu tham số, hoặc cần truyền ID -> Sửa thành `onClick={() => tenHam(id)}`.
3. Tuyệt đối tránh `onClick={tenHam()}`.

**✅ Đúng (Chờ click mới chạy):**

```jsx
// Không có dấu ()
<button onClick={handleDelete} />
// handleDelete -> Có nghĩa là "Đây là cái hàm, giữ hộ tôi, khi nào click thì hãy chạy nó".
```

Vì bạn viết đúng cú pháp (truyền tên hàm, không gọi hàm), nên nó **an toàn** và chỉ chạy khi bạn muốn.

### 4. Rendering Lists: Hiển thị mảng dữ liệu

#### 4.0. Bản chất cốt lõi: Array vs Object

> "Array là Object với tên ngầm định (số thứ tự), còn Object là Array với tên tùy chỉnh."

##### 1. Bản chất cốt lõi (Mental Model)

Hãy tưởng tượng bộ nhớ máy tính là một tủ đựng đồ khổng lồ.

| Đặc điểm | **Array (Mảng) `[...]`** | **Object (Đối tượng) `{...}`** |
| --- | --- | --- |
| **Hình ảnh** | Giống một **đoàn tàu** có đánh số toa. | Giống một **chùm chìa khóa** có dán nhãn. |
| **Tên (Key)** | **Ngầm định (Implicit):** Máy tự đặt là `0, 1, 2, 3...` | **Tùy chỉnh (Custom):** Bạn tự đặt là `"name", "age", "email"...` |
| **Thứ tự** | **Quan trọng:** Toa 1 luôn đứng sau toa 0. | **Không quan trọng:** Chìa khóa "nhà" hay "xe" lấy cái nào trước cũng được. |
| **Mục đích** | Dùng để chứa **danh sách** các thứ giống nhau. | Dùng để mô tả **chi tiết** về một thứ cụ thể. |

##### 2. Chi tiết và Minh họa

###### A. Array (Mảng) - `[...]`

Là một danh sách có thứ tự. Bạn truy xuất dữ liệu bằng **Vị trí** (Index).

* **Cấu trúc thực tế:**
```javascript
const users = ["An", "Bình", "Chi"];
```

* **Cách máy tính "nhìn" nó (Under the hood):**
Nó thực chất là một Object với key là số nguyên:
```javascript
{
  "0": "An",
  "1": "Bình",
  "2": "Chi",
  "length": 3  // Array được "khuyến mãi" thêm thuộc tính này
}
```

* **Khi nào dùng?** Khi bạn cần lưu trữ một tập hợp (list) để sau này lặp qua nó (ví dụ: dùng `.map()` trong React để hiển thị danh sách).

###### B. Object (Đối tượng) - `{...}`

Là một tập hợp các thuộc tính. Bạn truy xuất dữ liệu bằng **Tên nhãn** (Key).

* **Cấu trúc thực tế:**
```javascript
const user = {
  name: "An",
  age: 25,
  role: "Admin"
};
```

* **Cách truy xuất:**
Bạn không hỏi "cho tôi cái thứ nhất", mà bạn hỏi "cho tôi cái `name`".
```javascript
console.log(user.name); // "An"
```

* **Khi nào dùng?** Khi bạn cần lưu trữ thông tin chi tiết của một thực thể duy nhất (ví dụ: thông tin của 1 user, thông tin của 1 setting).

##### 3. Sự kết hợp hoàn hảo (Array of Objects)

Trong thực tế lập trình (đặc biệt là React), chúng ta hiếm khi dùng rời rạc. Chúng ta thường dùng **Mảng chứa các Đối tượng**.

Đây là cấu trúc dữ liệu phổ biến nhất (ví dụ dữ liệu JSON từ API trả về):

```javascript
const userList = [
  // Phần tử 0 (Index 0)
  {
    id: "user_01",   // Custom Key
    name: "An"       // Custom Key
  },
  
  // Phần tử 1 (Index 1)
  {
    id: "user_02",
    name: "Bình"
  }
];
```

**Tại sao cấu trúc này lại mạnh mẽ?**

1. **Vỏ ngoài là Array:** Giúp bạn dùng `.map()` để lặp qua danh sách và tạo ra các thẻ `<li>` hoặc `<div>` (như trong ảnh bạn gửi).
2. **Ruột bên trong là Object:** Giúp bạn truy cập chi tiết (`user.name`, `user.id`) để hiển thị nội dung phong phú.
3. **Vấn đề Reconciliation (React):**
    * React dùng **Vỏ ngoài (Array Index)** để đếm số lượng.
    * Nhưng React cần **Ruột bên trong (Unique ID)** làm `key` để định danh chính xác từng phần tử khi danh sách thay đổi (như tôi đã giải thích ở phần trước).


##### Tóm lại

* Nếu dữ liệu là câu trả lời cho câu hỏi **"Cái nào?"** (Thứ nhất, thứ hai...) -> Dùng **Array**.
* Nếu dữ liệu là câu trả lời cho câu hỏi **"Cái gì?"** (Tên là gì, Tuổi là bao nhiêu...) -> Dùng **Object**.

---

Khi `props.children` là một mảng các Element, React cần một cách để phân biệt chúng.

#### 4.1. Sử dụng `.map()`

Chúng ta dùng hàm `.map()` của Javascript để biến đổi mảng dữ liệu thành mảng Element.

```javascript
const users = ['An', 'Bình', 'Chi'];

// Biến đổi: ['An', 'Bình'] -> [<li>An</li>, <li>Bình</li>]
const listItems = users.map(user => <li>{user}</li>);
```

#### 4.2. Tại sao cần `key`?

React yêu cầu mỗi phần tử trong danh sách phải có props `key` duy nhất.

```jsx
// ✅ Đúng
users.map(user => <li key={user.id}>{user.name}</li>)
```

**Tại sao? (Liên quan đến Reconciliation)** Hãy tưởng tượng danh sách: `[A, B, C]`. Bạn chèn `X` vào đầu: `[X, A, B, C]`.

- **Nếu không có key:** React so sánh theo thứ tự index.
    
    - Vị trí 0: Cũ là A, Mới là X -> React xóa A, vẽ lại X (Tốn kém).
        
    - Vị trí 1: Cũ là B, Mới là A -> React xóa B, vẽ lại A (Tốn kém).
        
    - ... React phải sửa lại toàn bộ danh sách.
        
- **Nếu có key (Ví dụ key="A", key="B"):**
    
    - React nhìn thấy key="A" vẫn còn đó, chỉ bị đẩy xuống dưới.
        
    - React giữ nguyên A, B, C và chỉ chèn thêm X vào đầu.
        
    - **Hiệu năng tăng gấp bội.**
        

### 5. Ví dụ tổng hợp (Complex Example)

#### 5.0. Bài toán và Code mẫu

Kết hợp tất cả kiến thức: Array of Objects + Props + Event Handling + State.

**Bài toán:** Quản lý danh sách sản phẩm.
1. Hiển thị danh sách từ mảng object.
2. Mỗi sản phẩm là một Component riêng (`ProductItem`).
3. Có nút "Xóa" ở mỗi sản phẩm (Child gọi Parent).

```jsx
// --------------------------------------------------------
// 1. Component Con (ProductItem)
// Nhiệm vụ: Chỉ lo việc hiển thị UI cho 1 sản phẩm duy nhất.
// Không cần biết danh sách đến từ đâu, hay xóa như thế nào.
// --------------------------------------------------------
const ProductItem = ({ product, onDelete }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
      {/* Hiển thị thông tin chi tiết từ Object */}
      <h3>{product.name}</h3>
      <p>Giá: ${product.price}</p>
      
      {/* 
        QUAN TRỌNG: Kỹ thuật "Truyền tham số an toàn"
        - Nếu viết: onClick={onDelete(product.id)} -> SAI (Chạy ngay lập tức khi render).
        - Phải viết: onClick={() => onDelete(product.id)} -> ĐÚNG (Tạo hàm bao, chờ click mới chạy).
      */}
      <button onClick={() => onDelete(product.id)} style={{ color: "red" }}>
        Xóa sản phẩm
      </button>
    </div>
  );
};

// --------------------------------------------------------
// 2. Component Cha (ProductList)
// Nhiệm vụ: Nắm giữ dữ liệu (State) và Logic nghiệp vụ (Xóa).
// Là "đầu não" điều khiển mọi thứ.
// --------------------------------------------------------
function ProductList() {
  // KHỞI TẠO STATE:
  // Dùng Mảng chứa các Object để mô tả danh sách.
  // Mỗi Object cần một ID duy nhất để làm Key.
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop Dell", price: 1000 },
    { id: 2, name: "Iphone 15", price: 900 },
    { id: 3, name: "Mouse Logitech", price: 50 },
  ]);

  // LOGIC XÓA (Delete Handler):
  // Tại sao không dùng products.splice()? -> Vì React cần tính BẤT BIẾN (Immutability).
  // Ta phải tạo ra một mảng MỚI hoàn toàn, bỏ đi phần tử cần xóa.
  const handleDelete = (idToDelete) => {
    // .filter() tạo ra mảng mới, chỉ giữ lại những ai có ID KHÁC với idToDelete
    const newProducts = products.filter(item1 => item1.id !== idToDelete);
    // Cấu trúc hàm filter xử lý array-> const newArray = oldArray.filter(item => dieu_kien);
    // 💡 Lưu ý: item1 (ở đây) và item (ở .map() bên dưới) là 2 biến độc lập.
    //    Tên khác nhau để nhấn mạnh: chúng chỉ tồn tại trong phạm vi arrow function của mình.

    // Cập nhật State với mảng mới -> Kích hoạt Re-render
    setProducts(newProducts);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách hàng hóa ({products.length})</h2>
      
      {/* RENDERING LISTS: */}
      {/* Dùng .map() để biến đổi mảng Data thành mảng Component */}
      {products.map((item) => (
        <ProductItem 
          key={item.id}           // BẮT BUỘC: Giúp React định danh (Dùng ID, đừng dùng index)
          product={item}          // TRUYỀN DATA: Gửi object xuống cho con hiển thị
          onDelete={handleDelete} // TRUYỀN LOGIC: Gửi cái "điều khiển" xuống cho con dùng
        />
      ))}
      
      {/* CONDITIONAL RENDERING: Chỉ hiện khi danh sách rỗng */}
      {products.length === 0 && <p style={{color: 'gray'}}>Hết hàng rồi!</p>}
    </div>
  );
}
```
#### 5.1. Phân tích chi tiết ví dụ (Deep Dive)

Dưới đây là sơ đồ luồng dữ liệu minh họa cho quá trình tương tác giữa cha và con:

```mermaid
sequenceDiagram
    participant User
    participant Child as ProductItem (Con)
    participant Parent as ProductList (Cha)
    
    Note over Parent: 1. Data Flow (Xuống)
    Parent->>Child: Render Props (product, onDelete)
    
    Note over User: 2. Event Flow (Lên)
    User->>Child: Click "Delete" Button
    Child->>Parent: Call onDelete(id)
    
    Note over Parent: 3. State Update
    Parent->>Parent: handleDelete() runs
    Parent->>Parent: Create NEW Array (Immutability)
    Parent->>Parent: setProducts(newArray)
    
    Note over Parent, Child: 4. Re-render
    Parent->>Child: Re-render UI with updated list
```

#### 5.2. Luồng dữ liệu một chiều (One-way Data Flow)

**CHÍNH XÁC TUYỆT ĐỐI! 💯**

Hãy phân tích cụ thể **cách Cha truyền Con** và **Con truyền Cha** trong ví dụ `ProductList` ở trên. Đây chính là quy tắc **Luồng dữ liệu một chiều (One-way Data Flow)** - triết lý cốt lõi của React:

##### Vế 1: "Cha truyền con Tên Hàm, Con truyền Cha lại Giá trị"

✅ **Phân tích trong code:**

**Bước 1: Cha (ProductList) định nghĩa hàm xử lý**
```jsx
const handleDelete = (idToDelete) => {
  const newProducts = products.filter(item1 => item1.id !== idToDelete);
  setProducts(newProducts);
};
```
👆 Cha tạo ra cái "Loa" (hàm `handleDelete`). Cha nắm giữ toàn quyền quyết định logic xóa.

> **💡 Lưu ý:** Biến `item1` ở đây là hoàn toàn độc lập với biến `item` trong `.map()` bên dưới. Tên khác nhau để nhấn mạnh rằng mỗi biến chỉ tồn tại trong phạm vi arrow function của nó.

**Bước 2: Cha đưa "Loa" cho Con**
```jsx
<ProductItem 
  product={item}
  onDelete={handleDelete}  // ← Đưa TÊN HÀM (không gọi, không có dấu ())
/>
```
👆 Cha chỉ đưa địa chỉ/tên hàm cho Con. Lúc này hàm **chưa chạy**.

**Bước 3: Con (ProductItem) nhận "Loa" và hét vào đó khi cần**
```jsx
const ProductItem = ({ product, onDelete }) => {
  return (
    <button onClick={() => onDelete(product.id)}>  {/* ← Con GỌI hàm + GỬI GIÁ TRỊ */}
      Xóa sản phẩm
    </button>
  );
};
```
👆 Khi user click nút, Con gọi `onDelete(1)` (ví dụ ID = 1). **Con truyền giá trị ngược lên Cha**.

**Bước 4: Cha nhận giá trị và tự xử lý**
```jsx
handleDelete(1) // ← Hàm của Cha chạy, nhận được ID = 1
// Cha tự xóa sản phẩm có ID = 1 khỏi State
```

> **Cơ chế:** Cha đưa cái "Loa" (Hàm). Con hét vào cái "Loa" đó (Gọi hàm + kèm giá trị). Cha nghe thấy và tự sửa đổi State của Cha.

---

##### Vế 2: "Cha truyền Con Giá trị, Con chỉ Hiển thị, không Truyền lại"

✅ **Phân tích trong code:**

**Bước 1: Cha truyền dữ liệu xuống**
```jsx
<ProductItem 
  product={item}  // ← item = { id: 1, name: "Laptop Dell", price: 1000 }
/>
```
👆 Cha gửi object xuống cho Con qua props `product`.

**Bước 2: Con chỉ được đọc và hiển thị**
```jsx
const ProductItem = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>      {/* ← CHỈ ĐỌC và hiển thị */}
      <p>Giá: ${product.price}</p> {/* ← CHỈ ĐỌC và hiển thị */}
    </div>
  );
};
```
👆 Con **không thể** làm thế này:
```jsx
// ❌ SAI - Cố gắng sửa props (React sẽ báo lỗi)
product.price = 900;
```

**Tại sao Con không sửa được?**
* Props là **Read-Only (Chỉ đọc)**.
* Nếu Con muốn "đề nghị" Cha thay đổi giá, Con phải gọi một **callback function** mà Cha đã đưa (giống như `onDelete` ở trên).
* Ví dụ: `onClick={() => onIncreasePrice(product.id, 10)}` → Cha mới là người quyết định có tăng giá hay không.

> **Cơ chế:** Dữ liệu chảy như dòng thác từ trên xuống dưới. Con nhận được props, Con **không thể** sửa props để nó tự chạy ngược lên Cha.

---

##### Hình ảnh tổng kết: Chiếc Tivi và Đài truyền hình

Hãy ánh xạ lại ví dụ `ProductList` vào mô hình Tivi:

* **Cha (ProductList):** Là **Đài truyền hình VTV**.
* **Con (ProductItem):** Là chiếc **Tivi** nhà bạn.

**1. Cha truyền giá trị `product` (Props) → Con:**
* Đài phát sóng dữ liệu `{ name: "Laptop Dell", price: 1000 }`.
* Tivi nhà bạn **chỉ có thể hiển thị** dữ liệu đó: "Laptop Dell - $1000".
* Bạn **không thể** thò tay vào màn hình Tivi sửa giá từ `$1000` thành `$900` để số liệu trên đài thay đổi theo. (Không truyền lại được).

**2. Cha truyền hàm `onDelete` (Callback) → Con:**
* Đài truyền hình cung cấp một số hotline: **"Gọi 1900-XXX để bình chọn xóa sản phẩm"**.
* Bạn (Con) bấm nút "Xóa", giống như gọi hotline và nói: **"Tôi muốn xóa sản phẩm ID = 1!"** (Truyền giá trị ngược lên).
* Lúc này, Đài truyền hình (Cha) nhận thông tin và tự xóa sản phẩm đó khỏi danh sách gốc, sau đó phát sóng lại danh sách mới xuống Tivi.

---

Bạn đã nắm rất chắc kiến thức nền tảng này rồi. Đây là "cửa ải" khó nhất khi mới học React mà bạn đã vượt qua.

---

#### 5.3. Props Destructuring: Hiểu sâu về Input

Trong ví dụ này, bạn thấy `ProductItem` nhận 2 món đồ: **1 object** (`product`) và **1 hàm** (`onDelete`).

Trong React, `ProductItem` là một hàm (Component), và "nguyên liệu đầu vào" (Input) của nó chính là 2 thứ đó.

Tuy nhiên, để hiểu sâu hơn về mặt kỹ thuật (cách máy tính hiểu), mình xin bổ sung về cơ chế "gói hàng" dưới đây:

##### 1. Góc nhìn thực tế (Bạn nhìn thấy)

Đúng như bạn nói, bạn thấy hàm này nhận 2 món riêng biệt:

1. **`product`**: Là một **Object** (chứa thông tin như tên, giá, id...).
2. **`onDelete`**: Là một **Hàm/Function** (công cụ để bấm nút xóa).

##### 2. Góc nhìn kỹ thuật (React hoạt động)

Thực tế, React **không** gửi 2 món rời rạc. React đóng gói tất cả mọi thứ vào **MỘT Object duy nhất** gọi là **`props`**.

Đoạn code:

```jsx
const ProductItem = ({ product, onDelete }) => { ... }
```

Thực chất là cách viết tắt của:

```jsx
// Cách viết tường minh (không viết tắt)
const ProductItem = (props) => { 
    const product = props.product;   // Lấy object product ra
    const onDelete = props.onDelete; // Lấy hàm onDelete ra
    ...
}
```

Kỹ thuật bạn đang dùng gọi là **Destructuring (Bóc tách)**. Tức là:

> *"Tôi biết React gửi đến một cái thùng hàng tên là `props`. Nhưng tôi không muốn cầm cả thùng. Tôi muốn mở thùng ra ngay tại cửa và chỉ lấy đúng 2 món tên là `product` và `onDelete` để dùng thôi."*

##### Tóm tắt Input của ProductItem

| Tên Input | Kiểu dữ liệu (Type) | Nhiệm vụ |
| --- | --- | --- |
| **`product`** | **Object** `{ id, name, price }` | **Dữ liệu để hiển thị**. (Nguyên liệu để nấu ăn). |
| **`onDelete`** | **Function** `(id) => void` | **Công cụ để tương tác**. (Cái nút bấm gọi về Component Cha). |

> [!NOTE]
> Cả 2 món này đều nằm bên trong một object `props` duy nhất. Việc viết `({ product, onDelete })` chỉ là cú pháp destructuring để code gọn gàng hơn.

---

#### 5.4. Quy tắc đặt tên tham số (Parameter Naming)

**Tên của Input của hàm đều là tên tạm?**

Câu trả lời là: **ĐÚNG 95%**.

Hầu hết các trường hợp (như trong `map`, `filter`, hay hàm thông thường), tên Input hoàn toàn là **Tên Tạm** (Placeholder). Bạn thích đặt tên gì cũng được, miễn là dùng nhất quán bên trong hàm.

Tuy nhiên, có **1 trường hợp đặc biệt** trong React mà bạn cần lưu ý (liên quan đến cái ngoặc nhọn `{}`).

Hãy cùng phân tích 2 trường hợp này:

---

##### 1. Trường hợp "Tên Tạm" (Tự do 100%)

Đây là trường hợp của các hàm như: `map`, `filter`, `handleDelete`, hay các hàm xử lý sự kiện `onClick`.

Bạn có thể ví nó như **Cái Phễu**. Cái phễu không quan tâm bạn đổ nước, cát, hay gạo vào. Nó chỉ hứng thứ được đổ vào thôi.

**Ví dụ với `handleDelete`:**

```javascript
// Cách 1: Tên chuẩn
const handleDelete = (idToDelete) => { ... }

// Cách 2: Tên tiếng Việt
const handleDelete = (maSoCanXoa) => { ... }

// Cách 3: Tên ngẫu nhiên
const handleDelete = (cucGom) => { ... }
```

✅ **Tất cả đều chạy đúng.** Vì khi gọi hàm `handleDelete(1)`, số `1` sẽ tự động nhảy vào cái tên mà bạn đã đặt ở vị trí đó.

**Ví dụ với `filter`:**

```javascript
// Bạn viết item1, item2, hay x, y, z đều được
products.filter(x => x.id !== ...) 
```

---

##### 2. Trường hợp "Bắt buộc đúng tên" (Lưu ý đặc biệt)

Đây là trường hợp của **Component React** khi bạn dùng dấu ngoặc nhọn `{ }` để nhận Props (kỹ thuật Destructuring).

Ví dụ: Component `ProductItem`.

**Ở Component Cha (Gửi đi):**
Cha đóng gói 1 thùng hàng, dán nhãn bên ngoài thùng là `product` và `onDelete`.

```jsx
<ProductItem product={...} onDelete={...} />
```

**Ở Component Con (Nhận về):**

**Cách 1: Nhận cả thùng (Tên tạm OK)**
Nếu bạn nhận cả thùng `props`, thì chữ `props` là tên tạm. Bạn đổi thành `thungHang` cũng được.

```jsx
const ProductItem = (thungHang) => { 
    // Phải tự bóc thùng ra: thungHang.product
}
```

**Cách 2: Bóc thùng ngay tại cửa (Destructuring - Phải đúng tên nhãn)**
Đây là cách bạn đang dùng. Khi bạn viết `{ product }`, bạn đang bảo React: *"Hãy tìm trong thùng hàng cái gói tin có nhãn là `product` cho tôi"*.

```jsx
// ✅ ĐÚNG: Tên trùng với nhãn cha gửi
const ProductItem = ({ product }) => { ... }

// ❌ SAI: Tên khác nhãn (React tìm không thấy gói "caiBanh" nào cả -> undefined)
const ProductItem = ({ caiBanh }) => { ... } 
```

##### Tóm tắt quy tắc đặt tên

| Loại hàm | Ví dụ | Quy tắc đặt tên Input |
| --- | --- | --- |
| **Hàm thường** | `handleDelete(id)` | **TỰ DO**. Đặt `id`, `x`, `a` đều được (dựa vào **Thứ tự**). |
| **Callback** | `.map(item => ...)` | **TỰ DO**. Đặt `item`, `sp`, `e` đều được. |
| **Component (Props)** | `({ product })` | **BẮT BUỘC**. Phải trùng tên với key mà Cha gửi xuống (dựa vào **Tên nhãn**). |

> [!IMPORTANT]
> Khi dùng destructuring `{ }` trong React component, tên biến **phải khớp chính xác** với tên prop mà component cha truyền xuống. Đây là điểm khác biệt quan trọng so với hàm thông thường.

---

#### 5.5. Quy ước đặt tên trong React (Naming Conventions)

Dưới đây là bảng tổng hợp "kim chỉ nam" về quy tắc đặt tên trong React. Bạn có thể in ra hoặc lưu lại để dùng cho mọi dự án sau này.

Chúng ta sử dụng 3 kiểu viết chính:

1. **PascalCase:** Viết Hoa Chữ Cái Đầu (Ví dụ: `ProductItem`)
2. **camelCase:** viết thường chữ cái đầu (Ví dụ: `handleDelete`)
3. **SCREAMING_CASE:** VIẾT_HOA_TOÀN_BỘ (Ví dụ: `API_URL`)

---

##### 1. Bảng Tra Cứu Nhanh

| Loại thành phần | Quy tắc viết | Công thức đặt tên | Ví dụ chuẩn |
| --- | --- | --- | --- |
| **Component** | **PascalCase** | Tên danh từ | `ProductList`, `Header`, `UserProfile` |
| **Hàm ở Cha (Logic)** | **camelCase** | `handle` + Động từ | `handleDelete`, `handleSubmit`, `handleChange` |
| **Props ở Con (Event)** | **camelCase** | `on` + Động từ | `onDelete`, `onClick`, `onChange` |
| **Hàm Helper (Nội bộ)** | **camelCase** | Động từ + Danh từ | `calculateTotal`, `formatDate`, `fetchData` |
| **Biến (Data)** | **camelCase** | Danh từ | `user`, `products`, `itemList` |
| **Biến Boolean** | **camelCase** | `is`/`has`/`should` + Tính từ | `isLoading`, `hasError`, `isVisible` |
| **Hằng số (Cố định)** | **SCREAMING** | Tên_Cách_Nhau_Gạch_Dưới | `MAX_ITEMS`, `API_URL`, `VAT_TAX` |

---

##### 2. Giải Thích Chi Tiết & Lý Do

###### A. Component (Cha & Con) → PascalCase

* **Quy tắc:** Luôn viết hoa chữ cái đầu.
* **Lý do:** Để React phân biệt với thẻ HTML (`<div>`, `<span>`).
* **Ví dụ:**
  * ✅ `ProductItem`
  * ❌ `productItem` (Sai, React sẽ tưởng là thẻ HTML lỗi).

###### B. Cặp đôi "Handle - On" (Quan trọng nhất)

Đây là quy tắc giao tiếp giữa Cha và Con.

* **Tại Component Cha (Nơi định nghĩa logic):** Dùng tiền tố **`handle`**.
  * Nó trả lời câu hỏi: *"Tôi xử lý việc gì?"*
  * Ví dụ: `handleDelete` (Tôi xử lý việc xóa).

* **Tại Component Con (Props nhận về):** Dùng tiền tố **`on`**.
  * Nó trả lời câu hỏi: *"Sự kiện nào kích hoạt tôi?"*
  * Ví dụ: `onDelete` (Khi nút xóa được bấm).

###### C. Hàm Helper (Hàm phụ trợ)

Là những hàm tính toán, format dữ liệu, gọi API... nằm bên trong hoặc bên ngoài component.

* **Quy tắc:** Động từ + Danh từ (Làm cái gì + Cho cái gì).
* **Ví dụ:**
  * `calculateTotal()` (Tính tổng)
  * `formatCurrency()` (Định dạng tiền tệ)
  * `checkPermission()` (Kiểm tra quyền)

###### D. Biến & State

* **Biến dữ liệu:** Dùng danh từ. (`products`, `currentUser`).
* **Biến Boolean (Đúng/Sai):** Luôn bắt đầu bằng câu hỏi `is`, `has`, `should`.
  * `isLoading` (Đang tải phải không?) → Đọc code như đọc văn.
  * Tránh đặt tên cụt lủn như: `loading` (Không rõ là trạng thái hay là hành động tải), `flag` (Cờ gì?).

---

##### 3. Ví dụ Code Tổng Hợp (Chuẩn Sách Giáo Khoa)

```javascript
// 1. HẰNG SỐ (Cố định toàn cục) -> SCREAMING_SNAKE_CASE
const MAX_PRODUCT_COUNT = 10;

// 2. COMPONENT (Bắt buộc) -> PascalCase
function ProductManager() {

  // 3. STATE (Biến: Danh từ, Setter: set + Danh từ) -> camelCase
  const [products, setProducts] = useState([]);
  
  // 4. BOOLEAN (Trạng thái) -> is/has...
  const [isLoading, setIsLoading] = useState(false);

  // 5. HELPER FUNCTION (Hàm bổ trợ) -> Verb + Noun
  const calculateTax = (price) => {
    return price * 0.1;
  };

  // 6. HANDLER FUNCTION (Logic xử lý sự kiện) -> handle + Verb
  const handleDelete = (idToDelete) => {
    const newProducts = products.filter(p => p.id !== idToDelete);
    setProducts(newProducts);
  };

  return (
    <div>
      {/* 7. PROPS EVENT (Truyền xuống con) -> on + Verb */}
      <ProductList 
         data={products} 
         onDelete={handleDelete} 
      />
    </div>
  );
}
```

> [!TIP]
> Bạn cứ áp dụng đúng bảng này, code của bạn sẽ cực kỳ chuyên nghiệp, dễ đọc và dễ bảo trì cho cả team!

---

#### 5.6. Mô hình "Data Down, Actions Up" - Tổng hợp Quy chuẩn (The Complete Pattern)

Phần này là bản tổng hợp (Reference Guide) về mô hình giao tiếp giữa Component Cha và Con thông qua **Callback/Props**. Hãy lưu lại để tham khảo khi cần.

##### 1. Nguyên lý cốt lõi

* **Dữ liệu (Data):** Chảy từ trên xuống (Cha → Con) thông qua `props`.
* **Hành động (Actions/Events):** Gửi từ dưới lên (Con → Cha) thông qua việc gọi hàm (Callback).

##### 2. Quy chuẩn đặt tên (Naming Convention)

Để code dễ đọc và dễ bảo trì, cộng đồng React thống nhất quy tắc:

| Vị trí | Tên hàm/Prop | Ý nghĩa | Ví dụ |
| --- | --- | --- | --- |
| **Tại Component Cha** | **`handle`** + `Tên Hành Động` | Hàm này chứa **LOGIC** xử lý. | `handleSave`, `handleChange` |
| **Tại Props (Cầu nối)** | **`on`** + `Tên Sự Kiện` | Tên của cái "dây nối" mà cha đưa xuống. | `onSave`, `onChange` |
| **Tại Component Con** | Gọi `props.`**`on...`** | Con kích hoạt sự kiện để báo cáo/gửi dữ liệu. | `props.onSave(data)` |

##### 3. Cơ chế hoạt động (Luồng chạy)

Quy trình kết nối gồm 3 bước cụ thể:

* **Bước 1 (Tại Cha - Logic):**
  * Cha khai báo một hàm `handle...` (ví dụ: `handleUpdate`).
  * Đây là nơi xử lý dữ liệu cuối cùng (lưu vào state, gọi API...).

* **Bước 2 (Tại Cha - Kết nối):**
  * Trong phần `return` của Cha: Cha gán hàm `handle...` của mình vào một **Prop** (ví dụ: `onUpdate`) của thẻ Con.
  * *Lưu ý:* Cha kết nối vào **Prop**, không kết nối trực tiếp vào hàm nội bộ của con.

* **Bước 3 (Tại Con - Thực thi):**
  * Trong phần `return` (hoặc logic) của Con: Khi sự kiện xảy ra (click, type...), Con gọi `props.onUpdate(value)`.
  * Hành động này "bắn" giá trị `value` ngược lên hàm `handleUpdate` của Cha.

##### 4. Code tổng hợp mẫu

```jsx
// --- COMPONENT CON (Người gửi) ---
function HamCon(props) {
    // Helper function của con (Tùy chọn: dùng để chuẩn bị dữ liệu)
    const chuanBiDuLieu = () => {
        const data = "Dữ liệu từ Con";
        
        // [QUAN TRỌNG] Gọi prop on... để trả value về cho cha
        props.onGuiTin(data); 
    };

    return (
        // Sự kiện click kích hoạt việc gửi tin
        <button onClick={chuanBiDuLieu}>
            Gửi cho Cha
        </button>
    );
}

// --- COMPONENT CHA (Người nhận & Xử lý) ---
function HamCha() {
    // [QUAN TRỌNG] Helper function của Cha: Dùng handle...
    const handleNhanTin = (valueTuCon) => {
        console.log("Xử lý logic với: ", valueTuCon);
    };

    return (
        <div>
            {/* [QUAN TRỌNG] Kết nối: Gán handle (Cha) vào on (Prop) */}
            <HamCon onGuiTin={handleNhanTin} />
        </div>
    );
}
```

##### 5. Đính chính quan trọng

> **ĐÚNG:** Con dùng `on+Name` để trả `value` về cho cha.
> 
> **CHỈNH LẠI:** Trong `return` của Cha, Cha **không nhìn thấy** hàm helper bên trong Con. Cha chỉ nhìn thấy **Props** của Con.
> 
> Do đó, Cha kết nối `helperFunction Cha` → `Props của Con`.

**Giải thích theo 3 bước:**

* **Bước 1 - Logic tại Cha:**
  * Trong code trên, dòng `const handleNhanTin = (valueTuCon) => { ... }` là nơi Cha định nghĩa logic xử lý.
  * Hàm này sẽ nhận dữ liệu từ Con và xử lý (ở đây là in ra console).

* **Bước 2 - Kết nối tại Cha:**
  * Dòng `<HamCon onGuiTin={handleNhanTin} />` chính là Cha "cắm dây" - gán hàm `handleNhanTin` vào **Prop** `onGuiTin`.
  * Lúc này Cha đã tạo "cầu nối" cho Con, nhưng hàm vẫn chưa chạy.

* **Bước 3 - Thực thi tại Con:**
  * Bên trong Con, khi user click button, dòng `props.onGuiTin(data)` được gọi.
  * Thực chất Con đang gọi hàm `handleNhanTin` của Cha (vì Cha đã gán nó vào prop `onGuiTin`).
  * Giá trị `data` từ Con được "bắn" ngược lên Cha qua tham số `valueTuCon`.

> Đây chính là **Callback Pattern**: Cha đưa công cụ (hàm) cho Con, Con dùng công cụ đó để "gọi ngược" lại Cha.

---

#### 5.7. Tóm tắt: 4 Trụ cột React trong ví dụ

Ví dụ `ProductList` và `ProductItem` ở trên tuy ngắn nhưng đã minh họa đầy đủ **4 kiến thức trụ cột** của React:

**1. Data Flow (Dòng chảy dữ liệu - Downwards)**
*   Dữ liệu `products` chỉ được **sống** ở Component Cha (`ProductList`).
*   Component Con (`ProductItem`) muốn có dữ liệu? Cha phải truyền xuống qua `props` (`product={item}`).
*   Con **không được quyền** sửa dữ liệu này. Nó chỉ được đọc và hiển thị.

**2. Event Flow (Dòng chảy sự kiện - Upwards)**
*   Con muốn xóa chính nó, nhưng Con không giữ State, nên Con **không thể tự xóa**.
*   Con phải **"báo cáo"** lên Cha: *"Cha ơi, người dùng muốn xóa thằng có ID là 1"*.
*   Cách báo cáo: Gọi cái hàm mà Cha đã đưa cho lúc trước (`onDelete`).
*   Đây là mô hình **Inverse Data Flow** (Dòng dữ liệu ngược) thông qua Callback Functions.

**3. State Immutability (Tính bất biến)**
*   Trong hàm `handleDelete`, ta **TUYỆT ĐỐI KHÔNG** làm thế này:
    ```javascript
    products.pop(); // SAI! Sửa trực tiếp vào mảng cũ
    setProducts(products); // React sẽ không thấy sự thay đổi vì tham chiếu mảng vẫn như cũ.
    ```
*   Ta phải dùng `.filter()`: Hàm này không sửa mảng cũ, mà nó lẳng lặng tạo ra một **mảng mới** chứa kết quả. Khi React thấy mảng mới này, nó mới chịu cập nhật giao diện.

**4. Key Prop (Định danh)**
*   Dòng `key={item.id}` không phải để cho đẹp. Nó giúp React biết chính xác: *"À, cái thằng Laptop Dell (ID 1) vẫn còn, thằng Iphone (ID 2) bị xóa"*.
*   Nếu dùng `index` làm key, khi xóa thằng đầu tiên, React sẽ bị loạn và phải vẽ lại toàn bộ danh sách, gây lãng phí tài nguyên khủng khiếp.

---

### 6. Bài tập thực hành (Module 2)

**Bài toán:** Tạo một danh sách công việc (Todo List) đơn giản.

1. Có một nút "Thêm công việc".
    
2. Mỗi lần bấm, thêm một dòng "Công việc mới" vào danh sách.
    

**Gợi ý giải (Mental Model):**

- Cần `state` để lưu danh sách: `const [todos, setTodos] = useState([])`.
    
- Sự kiện click sẽ gọi `setTodos` để tạo mảng mới, có thêm phần tử mới.
    
- Dùng `.map()` để render ra `<li>`.
    

```jsx
function TodoApp() {
  const [todos, setTodos] = useState(['Học React', 'Viết Code']);

  const addJob = () => {
    // Lưu ý: Phải tạo mảng mới (Immutability), không dùng .push()
    setTodos([...todos, 'Công việc mới']); 
  };

  return (
    <div>
      <button onClick={addJob}>Thêm việc</button>
      <ul>
        {todos.map((job, index) => (
           // Tạm dùng index làm key vì danh sách đơn giản
           <li key={index}>{job}</li>
        ))}
      </ul>
    </div>
  );
}
```

## PHẦN 4: TÀI LIỆU CHI TIẾT - MODULE 3: SIDE EFFECTS & KẾT NỐI THẾ GIỚI BÊN NGOÀI

### 1. Pure Function vs Side Effects

Trước khi học `useEffect`, bạn cần hiểu React ghét cái gì nhất. React ghét **sự thiếu tinh khiết** trong quá trình render.

#### 1.1. Pure Function (Hàm thuần khiết) - Tiêu chuẩn vàng

Hàm Component `UserCard(props)` được coi là thuần khiết khi:

1. **Cùng đầu vào luôn ra cùng đầu ra:** Đưa `props` A luôn nhận được UI A.
    
2. **Không làm thay đổi bên ngoài:** Không sửa biến toàn cục, không sửa DOM trực tiếp, không gọi API ngầm.
    

#### 1.2. Side Effects (Tác dụng phụ) - Những kẻ phá bĩnh

Side Effect là bất cứ thứ gì làm ảnh hưởng đến thế giới bên ngoài phạm vi của hàm.

- Gọi API lấy dữ liệu.
    
- `document.title = "Hello"`.
    
- `setTimeout`, `setInterval`.
    
- Đăng ký sự kiện `window.addEventListener`.
    

> **Quy tắc sinh tử:** **TUYỆT ĐỐI KHÔNG** viết Side Effect trực tiếp trong thân hàm Component. Vì Component có thể render lại hàng chục lần mỗi giây, Side Effect cũng sẽ chạy lại bấy nhiêu lần (gây crash app, spam API).

---

### 1.3. So sánh triết lý: React (Explicit) vs PHP (Implicit)

Để hiểu sâu hơn tại sao React có những quy tắc nghiêm ngặt như vậy, hãy nhìn vào cuộc chiến triết lý giữa **React (Tư duy hiện đại, Tường minh)** và **PHP (Tư duy Legacy, Ngầm định)**.

#### 1.3.1. Cuộc chiến triết lý: Explicit (Rõ ràng) vs. Implicit (Ngầm định)

Đây là nguyên nhân cốt lõi khiến nhiều lập trình viên hiện đại "ghét" sự ma thuật (magic) của PHP kiểu cũ.

| Đặc điểm | React (Tư duy hiện đại) | PHP (Kiểu cũ / Framework cũ) |
| --- | --- | --- |
| **Dòng dữ liệu** | **Một chiều & Rõ ràng.** Cha truyền cho con qua `props`. Nhìn vào component là biết data từ đâu tới. | **Đa chiều & Ẩn danh.** Data có thể đến từ `global`, `session`, `$_REQUEST`... lơ lửng trong môi trường. |
| **Độ tin cậy** | **Pure (Thuần khiết).** Cùng một đầu vào (Props), luôn ra cùng kết quả (UI). | **Unpredictable (Khó đoán).** Cùng một hàm, chạy lúc này thì đúng, chạy lúc khác thì sai do biến môi trường thay đổi. |
| **Debug** | Dễ. Lỗi ở đâu, nhìn luồng props là ra. | Khó. Phải truy tìm xem biến đó bị thay đổi ở file nào trong hàng chục file `include`. |

#### 1.3.2. Định nghĩa lại "Ma thuật" (Magic)

* **Trong PHP (Kiểu cũ):** "Ma thuật" là những thứ tự động xảy ra mà không cần viết code rõ ràng. Ví dụ: `$_REQUEST` tự động gom `GET`, `POST`, `COOKIE` lại. Nó tiện cho người viết nhanh, nhưng là ác mộng cho người đọc và bảo trì (maintain).
    
* **Trong React:** Không có ma thuật. Mọi thứ đều phải được khai báo. Nếu component cần dữ liệu, nó phải "xin" qua `props` hoặc `hooks`. Mọi thứ đều **Explicit (Tường minh)**.
    

#### 1.3.3. Cơ chế kiểm soát thế giới bên ngoài (Side Effects)

Đây chính là lý do tại sao `useEffect` tồn tại và tại sao nó quan trọng.

**Quy tắc bất di bất dịch:** Component React giống như một **"pháo đài"**.

* **Bên ngoài (Outsider):** Không thể tự ý can thiệp vào nội bộ component, trừ khi đi qua "cổng chính" là **Props**.
    
* **Bên trong (Insider):** Không được tự ý chạy ra ngoài làm loạn (sửa DOM, gọi API lung tung) trong lúc đang tính toán giao diện (Render).
    
* **Vùng đặc biệt (Special Zone):** React dành riêng **MỘT VÀ CHỈ MỘT** vùng cho phép can thiệp bên ngoài: đó là `useEffect`. Vùng này nằm **bên trong** component, nhưng chỉ được phép chạy **SAU KHI** tất cả logic bên trong (tính toán UI) đã hoàn tất.
    

**Vai trò của `useEffect`:**

* Nó là "khu vực cách ly" dành riêng cho các **Side Effects** - nơi duy nhất được phép tác động ra thế giới bên ngoài.
    
* Muốn gọi API? Muốn đổi title trình duyệt? Muốn lắng nghe sự kiện? → **Phải nhốt vào `useEffect`**.
    
* **Thứ tự thực thi quan trọng:** 
  1. Component render (tính toán UI thuần khiết)
  2. React vẽ UI lên màn hình
  3. **SAU ĐÓ MỚI** chạy `useEffect` (can thiệp bên ngoài)
    
* Điều này đảm bảo phần còn lại của component vẫn "Thuần khiết" (Pure) và dễ kiểm soát, đồng thời không làm chặn (block) quá trình render.
    

#### 1.3.4. Kết luận: Tại sao React cảm thấy "tự nhiên" hơn

Lý do nhiều lập trình viên cảm thấy "vibe" được code React/Next.js ngay cả khi chưa rành JavaScript là vì tính **Declarative (Mô tả)** của nó:

> **Code React giống như bản vẽ kỹ thuật:** Nhìn vào là thấy cấu trúc nhà, cửa, phòng ốc (UI structure). Mọi thứ đều rõ ràng, minh bạch.
> 
> **Code PHP kiểu cũ giống như mê cung:** Bạn thấy cái cửa, nhưng không biết mở ra là phòng khách hay... rơi xuống hầm, vì điều đó phụ thuộc vào "phép thuật" ẩn giấu bên dưới.

Đây chính là sức mạnh của **Explicit Programming (Lập trình tường minh)** - nền tảng của React và các framework hiện đại.

---

### 2. Hook `useEffect`: Nơi trú ẩn của Side Effects

`useEffect` là nơi React cho phép bạn thực hiện các Side Effects một cách an toàn **SAU KHI** giao diện đã được vẽ xong.

```javascript
useEffect(() => {
  // Code Side Effect ở đây (Call API, DOM...)
}, [dependencies]); // Mảng phụ thuộc
```

#### 2.1. Logic hoạt động

1. React Render Component (Tính toán UI).
    
2. React Vẽ UI lên màn hình (Browser Paint).
    
3. **SAU ĐÓ**, React mới chạy `useEffect`. -> _Điều này giúp giao diện không bị chặn (block) bởi các tác vụ nặng._
    

### 3. Dependency Array: Cái phanh của useEffect

Tham số thứ 2 của `useEffect` (`[]`) quyết định **khi nào** effect được chạy lại. Đây là phần dễ gây lỗi nhất (Infinite Loop).

| **Dependency Array** | **Ý nghĩa** | **Khi nào chạy?** |
|---|---|---|
| **Không truyền** | `useEffect(() => {})` | Chạy **MỖI LẦN** render (Nguy hiểm, giống code thẳng trong hàm). |
| **Mảng rỗng** | `useEffect(() => {}, [])` | Chạy **DUY NHẤT 1 LẦN** sau khi mount (Giống `componentDidMount`). Dùng để gọi API lần đầu. |
| **Có biến** | `useEffect(() => {}, [userId])` | Chạy lần đầu **VÀ** chạy mỗi khi `userId` thay đổi. |

### 4. Cleanup Function: Dọn dẹp chiến trường

Đôi khi Effect để lại "rác" (như timer đang chạy, kết nối socket đang mở). Nếu Component bị xóa khỏi màn hình (Unmount) mà không dọn rác => **Memory Leak** (Rò rỉ bộ nhớ).

Để dọn dẹp, bạn return một hàm từ trong `useEffect`.

```javascript
useEffect(() => {
  console.log("1. Đăng ký sự kiện Chat");
  const connection = createConnection();

  // Cleanup Function
  return () => {
    console.log("2. Ngắt kết nối Chat (Dọn dẹp)");
    connection.disconnect();
  };
}, [roomId]);
```

**Quy trình:**

1. Người dùng đổi phòng chat (roomId đổi).
    
2. React chạy hàm Cleanup của lần trước (Ngắt kết nối cũ).
    
3. React chạy Effect mới (Kết nối phòng mới).
    

### 5. Bài tập thực hành (Module 3)

**Bài toán:** Đồng hồ đếm ngược và Tiêu đề trang.

1. Hiển thị một đồng hồ đếm ngược từ 10 về 0.
    
2. Đổi tiêu đề tab trình duyệt (`document.title`) thành số giây còn lại.
    
3. Khi về 0 thì dừng lại.
    

**Gợi ý giải (Mental Model):**

- Cần `useEffect` để thiết lập `setInterval`.
    
- Mảng dependency rỗng `[]` để timer chỉ chạy 1 lần lúc đầu? Hay cần cách khác?
    
- Quan trọng: Phải dọn dẹp `clearInterval` khi component unmount để tránh timer chạy ngầm.
    

```jsx
function Countdown() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    // Side Effect 1: Đổi title
    document.title = `Còn lại: ${count}`;
  }, [count]); // Chạy lại mỗi khi count đổi để cập nhật title

  useEffect(() => {
    // Side Effect 2: Timer
    const timerId = setInterval(() => {
      setCount((prevCount) => {
         if (prevCount <= 0) {
             clearInterval(timerId); // Dừng khi về 0
             return 0;
         }
         return prevCount - 1;
      });
    }, 1000);

    // Cleanup: Cực kỳ quan trọng!
    // Nếu user chuyển trang khác, timer phải bị hủy
    return () => clearInterval(timerId);
  }, []); // Chỉ set timer 1 lần lúc mount

  return <h1>{count}</h1>;
}
```

## PHẦN 5: TÀI LIỆU CHI TIẾT - MODULE 4: KIẾN TRÚC VÀ LUỒNG DỮ LIỆU (DATA FLOW)

Trong React, dữ liệu (State) được ví như dòng nước. Nó chỉ chảy một chiều từ trên xuống dưới. Việc hiểu cách điều hướng dòng nước này chính là nghệ thuật tổ chức Code.

### 1. Lifting State Up: Đưa trạng thái lên cao

Đây là mẫu thiết kế (pattern) phổ biến nhất để chia sẻ dữ liệu.

Vấn đề:

Tưởng tượng bạn có 2 component con:

1. `Input`: Để nhập nhiệt độ.
    
2. `Display`: Để hiển thị nước có sôi hay không.
    

Nếu `Input` giữ state `temperature`, thì `Display` làm sao biết nhiệt độ là bao nhiêu để hiển thị? Hai anh em ngang hàng không thể "nói chuyện" trực tiếp.

**Giải pháp:**

- **B1:** Xóa state ở `Input`.
    
- **B2:** Chuyển state đó lên component cha chung (`Calculator`).
    
- **B3:** Cha truyền `state` xuống cho `Display` (qua props) và truyền hàm `setState` xuống cho `Input` (qua props).
    

> **Nguyên lý:** "Single Source of Truth" (Một nguồn sự thật duy nhất). Dữ liệu chỉ nằm ở một chỗ và chảy xuống các nơi cần dùng.

**Ví dụ Code:**

```jsx
// 1. Child Component A: The Input
// It receives the current value and the function to update it via props.
const TemperatureInput = ({ temperature, onTemperatureChange }) => {
    return (
        <fieldset className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">Enter temperature in Celsius:</legend>
            <input
                value={temperature}
                onChange={(e) => onTemperatureChange(e.target.value)}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
        </fieldset>
    );
};

// 2. Child Component B: The Display
// It receives the temperature via props to decide what to show.
const BoilingVerdict = ({ celsius }) => {
    if (celsius >= 100) {
        return <p className="text-green-600 font-bold text-xl mt-4">The water would boil. 💧🔥</p>;
    }
    return <p className="text-red-600 text-xl mt-4">The water would not boil. ❄️</p>;
};

// 3. The Parent Component: Calculator
// This is where the state "lives" (The Single Source of Truth)
const LiftingStateUpExample = () => {
    // B2: State is initialized here, not in the Input
    const [temperature, setTemperature] = useState('');

    // The handler function that updates the state
    const handleChange = (newTemperature) => {
        setTemperature(newTemperature);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-12">
            <div className="max-w-3xl mx-auto w-full">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 font-semibold"
                >
                    ← Back to Home
                </Link>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 p-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                        Lifting State Up Example
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        This example demonstrates how to share state between components by lifting it to their closest common ancestor.
                    </p>

                    {/* B3: Pass the function down to Input */}
                    <TemperatureInput
                        temperature={temperature}
                        onTemperatureChange={handleChange}
                    />

                    {/* B3: Pass the state down to Display */}
                    <BoilingVerdict
                        celsius={parseFloat(temperature)}
                    />

                    {/* Explanation Section */}
                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">💡 Key Concept</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>The <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">temperature</code> state lives in the parent component (Single Source of Truth)</li>
                            <li>The input component receives both the value and the updater function via props</li>
                            <li>The verdict component receives the state to display the result</li>
                            <li>Both child components stay in sync because they share the same state</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiftingStateUpExample;
```

#### Giải thích chi tiết: `value={temperature}` - Controlled Component

Trong ví dụ trên, có một dòng code cực kỳ quan trọng mà nhiều người mới học thường bỏ qua:

```jsx
<input
    value={temperature}  // ← Dòng này!
    onChange={(e) => onTemperatureChange(e.target.value)}
/>
```

**Điều gì đang xảy ra?**

Đoạn code này nhằm làm cho **giá trị nhập vào không hiển thị trực tiếp**, mà phải trải qua một "hành trình vòng quanh":

1. **Người dùng gõ số** vào ô input → Sự kiện `onChange` được kích hoạt.
2. **Giá trị mới đi lên cha** (qua hàm `onTemperatureChange`).
3. **Cha cập nhật state** (`setTemperature`).
4. **React render lại component con**.
5. **Giá trị mới đi xuống lại** (qua prop `temperature`).
6. **Cuối cùng mới hiển thị** lên màn hình.

> **Mental Model:** Thay vì ô input tự quản lý giá trị của chính nó (như HTML thông thường), React **chiếm quyền kiểm soát hoàn toàn** (Controlled Component).

---

#### So sánh: Server-side vs Client-side

Đây là sự khác biệt căn bản giữa ngôn ngữ Server-side (như PHP) và Client-side (như React):

| **Đặc điểm** | **HTML Thông thường (PHP, Server-side)** | **React (Client-side)** |
| --- | --- | --- |
| **Cách hoạt động** | Tag `<input>` tự quản lý giá trị của nó. Giá trị nhập vào là giá trị hiển thị. | React kiểm soát giá trị qua `value={state}`. Input chỉ là "màn hình hiển thị". |
| **Khi nào dữ liệu được gửi?** | Cần bấm nút **Submit** hoặc nhấn **Enter** mới push giá trị lên server. | **Real-time**: Mỗi lần gõ phím, giá trị đã được cập nhật ngay lập tức. |
| **Ví dụ (PHP)** | `<form method="POST"><input name="temp"/></form>`<br/>→ Khi submit, `$_POST['temp']` mới nhận được giá trị. | `<input value={temperature} onChange={...} />`<br/>→ Mỗi phím gõ, state `temperature` đã thay đổi ngay. |
| **Tính năng** | Dữ liệu chỉ có trên server sau khi gửi form. | Dữ liệu luôn sẵn sàng trong JavaScript, có thể validate ngay, hiển thị kết quả tức thì. |

**Ví dụ cụ thể:**

- **PHP (Server-side):**
  ```html
  <form method="POST">
    <input name="temperature" />
    <button type="submit">Kiểm tra</button>
  </form>
  ```
  Bạn nhập số 100, nhưng chỉ khi bấm "Kiểm tra", trang web mới reload và PHP mới in ra "Nước sẽ sôi".

- **React (Client-side):**
  Bạn nhập số 100, **ngay lập tức** (không cần bấm gì), dòng chữ "The water would boil 💧🔥" đã hiện ra bên dưới.

---

#### Tại sao phải dùng Controlled Component?

1. **Đồng bộ hóa (Sync):** Đảm bảo giá trị hiển thị trên UI luôn khớp với giá trị trong state. Không có trường hợp "state nói 50 nhưng màn hình hiện 60".

2. **Dễ kiểm soát:** Bạn có thể validate, format, hoặc chặn input không hợp lệ ngay khi người dùng gõ.
   ```jsx
   const handleChange = (newValue) => {
     // Chỉ cho phép số từ 0 đến 200
     if (newValue >= 0 && newValue <= 200) {
       setTemperature(newValue);
     }
   };
   ```

3. **Single Source of Truth:** Dữ liệu chỉ sống ở một chỗ (state), tất cả component khác đều nhìn vào đó. Không có "nhiều nguồn sự thật" gây mâu thuẫn.

---

### 2. Context API: Đường hầm xuyên không

Khi ứng dụng quá lớn, việc truyền props qua 10 tầng (Ông cố -> Ông -> Cha -> Con -> Cháu) được gọi là **Prop Drilling** (Khoan thủng props). Nó làm code cực kỳ rối rắm.

**Giải pháp:** Sử dụng Context để tạo một "đường hầm".

- **Provider (Nguồn phát):** Đặt ở tầng cao nhất, chứa dữ liệu (ví dụ: Theme màu, User đang đăng nhập).
    
- **Consumer/useContext (Nơi nhận):** Component con ở bất kỳ tầng nào cũng có thể "hút" dữ liệu trực tiếp từ đường hầm mà không cần thông qua cha.
    

```jsx
// 1. Tạo Context
const ThemeContext = createContext('light');

// 2. Cung cấp dữ liệu (Ở tầng trên cùng)
<ThemeContext.Provider value="dark">
   <App />
</ThemeContext.Provider>

// 3. Sử dụng dữ liệu (Ở tầng sâu nhất)
const theme = useContext(ThemeContext); // Nhận được "dark" ngay lập tức
```

**Ví dụ đầy đủ:**

```javascript
import React, { createContext, useContext, useState } from 'react';

// ==========================================
// STEP 1: Create the Context
// ==========================================
// This creates the "tunnel." 'light' is the default value 
// if no Provider is found (rarely used but good for testing).
const ThemeContext = createContext('light');

// ==========================================
// STEP 2: The Consumer Component (The Child)
// ==========================================
// This component is deep in the tree. It uses the hook to 
// "suck" data directly from the context.
function ThemedButton() {
  // 1. Access the context value
  const theme = useContext(ThemeContext);

  // Simple styling based on the theme value
  const styles = {
    backgroundColor: theme === 'dark' ? '#333' : '#FFF',
    color: theme === 'dark' ? '#FFF' : '#000',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <button style={styles}>
      I am a {theme} button!
    </button>
  );
}

// ==========================================
// Intermediate Component
// ==========================================
// Notice this component DOES NOT take any theme props.
// It just passes the UI down. This solves "Prop Drilling".
function Toolbar() {
  return (
    <div style={{ padding: '20px', border: '1px dashed grey' }}>
      <p>Toolbar Component (I don't know the theme!)</p>
      <ThemedButton /> 
    </div>
  );
}

// ==========================================
// STEP 3: The Provider Component (The Parent)
// ==========================================
// This is the top-level component that manages the state
// and pushes it into the "tunnel" (Provider).
export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    // We wrap everything in the Provider.
    // The 'value' prop is what sends data into the tunnel.
    <ThemeContext.Provider value={theme}>
      
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>useContext Example</h1>
        
        {/* Button to control the state */}
        <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
          Toggle Theme
        </button>

        {/* The Toolbar sits inside the Provider */}
        <Toolbar />
        
      </div>

    </ThemeContext.Provider>
  );
}
```

---

#### Giải thích chi tiết code (Phân tích từng dòng)

Bây giờ chúng ta sẽ "dịch" code trên sang ngôn ngữ thường, phân tích từng thành phần theo: **Action (Hành động)**, **Function (Hàm)**, **Variables (Biến)**, **Input (Đầu vào)**, **Output (Đầu ra)**, **Data Type (Kiểu dữ liệu)**, và **Naming (Quy tắc đặt tên)**.

---

##### BƯỚC 1: Import các công cụ cần thiết

```javascript
import React, { createContext, useContext, useState } from 'react';
```

| Thành phần | Phân loại | Giải thích | Naming |
|---|---|---|---|
| `import` | **Action** | Hành động nhập (import) các công cụ từ thư viện React | Từ khóa hệ thống (System Standard) |
| `React` | **Object** | Object chính của thư viện React (ít dùng trực tiếp trong code hiện đại) | Tên chuẩn (System Standard) |
| `createContext` | **Function** | Hàm tạo ra một Context (đường hầm) | Tên chuẩn (System Standard) |
| `useContext` | **Hook Function** | Hook để "hút" dữ liệu từ Context | Tên chuẩn (System Standard) |
| `useState` | **Hook Function** | Hook để tạo State (bộ nhớ) | Tên chuẩn (System Standard) |

---

##### BƯỚC 2: Tạo Context (Đường hầm)

```javascript
const ThemeContext = createContext('light');
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `createContext` | **Function** | `'light'` (giá trị mặc định) | Context Object | Function: Built-in<br>Input: String<br>Output: Context Object | System Standard |
| `'light'` | **Default Value** | N/A | N/A | **String** | Changeable (có thể đổi thành `'dark'` hoặc giá trị khác) |
| `ThemeContext` | **Variable (Constant)** | N/A | Context Object | **Context Object** | Changeable (PascalCase, nên đặt tên theo mục đích: `UserContext`, `LanguageContext`) |

**Action (Hành động):**
- Tạo một "đường hầm" tên là `ThemeContext`.
- Giá trị mặc định của đường hầm này là `'light'` (chỉ dùng khi không có Provider bao bọc).

**Mental Model:**
> Tưởng tượng bạn đào một cái hầm xuyên núi. Cái hầm này tên là `ThemeContext`. Nếu không có ai bơm nước (Provider) vào hầm, thì mặc định trong hầm có nước "light" (ánh sáng).

---

##### BƯỚC 3: Component Con - ThemedButton (Người tiêu thụ)

###### 3.1. Khai báo Component

```javascript
function ThemedButton() {
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `ThemedButton` | **Function Component** | `props` (ẩn, không dùng) | React Element (JSX) | Function: Component<br>Output: React Element Object | Changeable (PascalCase) |

**Action:** Định nghĩa một Component tên `ThemedButton` (Nút có chủ đề).

---

###### 3.2. Hút dữ liệu từ Context

```javascript
const theme = useContext(ThemeContext);
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `useContext` | **Hook Function** | `ThemeContext` (Context Object) | Giá trị hiện tại trong Context | Function: Built-in Hook<br>Input: Context Object<br>Output: **String** (`'light'` hoặc `'dark'`) | System Standard |
| `ThemeContext` | **Input (Context Object)** | N/A | N/A | **Context Object** | Đã định nghĩa ở Bước 2 |
| `theme` | **Variable (Constant)** | N/A | Giá trị từ Context | **String** | Changeable (camelCase, nên đặt theo ý nghĩa: `currentTheme`, `mode`) |

**Action:** "Hút" giá trị hiện tại từ đường hầm `ThemeContext` và lưu vào biến `theme`.

**Mental Model:**
> Component này cắm một cái ống hút vào đường hầm `ThemeContext` và hút nước ra. Nước hút được (giá trị) được đổ vào cái ly tên `theme`.

---

###### 3.3. Tạo Object Styles (Kiểu dáng)

```javascript
const styles = {
  backgroundColor: theme === 'dark' ? '#333' : '#FFF',
  color: theme === 'dark' ? '#FFF' : '#000',
  border: '1px solid #ccc',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px'
};
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `styles` | **Variable (Constant)** | N/A | Object chứa CSS properties | **Object** | Changeable (camelCase) |
| `backgroundColor` | **Object Property** | `theme` (String) | String (mã màu) | **String** | System Standard (CSS property) |
| `theme === 'dark' ? '#333' : '#FFF'` | **Ternary Operator** | `theme` (String) | `'#333'` hoặc `'#FFF'` | **String** | Logic (Changeable) |

**Action:** Tạo một Object `styles` chứa các thuộc tính CSS. Màu sắc thay đổi dựa trên giá trị của `theme`.

**Logic:**
- Nếu `theme === 'dark'` → Nền đen (`#333`), chữ trắng (`#FFF`)
- Nếu `theme === 'light'` → Nền trắng (`#FFF`), chữ đen (`#000`)

---

###### 3.4. Return JSX (Giao diện)

```javascript
return (
  <button style={styles}>
    I am a {theme} button!
  </button>
);
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `return` | **Keyword** | JSX Expression | React Element | Keyword: System<br>Output: React Element Object | System Standard |
| `<button>` | **JSX Element** | N/A | React Element | **React Element** | HTML Standard |
| `style={styles}` | **JSX Prop** | `styles` (Object) | N/A | **Object** | System Standard |
| `{theme}` | **JSX Expression** | `theme` (String) | String hiển thị | **String** | Variable từ Bước 3.2 |

**Action:** Trả về một nút bấm (`<button>`) với style động và text hiển thị giá trị `theme`.

---

##### BƯỚC 4: Component Trung gian - Toolbar (Không biết gì về theme)

```javascript
function Toolbar() {
  return (
    <div style={{ padding: '20px', border: '1px dashed grey' }}>
      <p>Toolbar Component (I don't know the theme!)</p>
      <ThemedButton /> 
    </div>
  );
}
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `Toolbar` | **Function Component** | `props` (ẩn, không dùng) | React Element (JSX) | Function: Component<br>Output: React Element | Changeable (PascalCase) |
| `<ThemedButton />` | **JSX Component** | Không truyền props nào | React Element | **React Element** | Component từ Bước 3 |

**Action:** Tạo một Component trung gian. Component này **KHÔNG** nhận props `theme` từ cha, nhưng vẫn render được `ThemedButton` (vì `ThemedButton` tự hút dữ liệu từ Context).

**Mental Model:**
> `Toolbar` giống như một người đứng giữa. Nó không cần biết "nước" (theme) là gì, nó chỉ cần đặt cái ống (`<ThemedButton />`) vào đúng vị trí. Cái ống tự hút nước từ đường hầm.

**Giải quyết vấn đề Prop Drilling:**
- Nếu không có Context, bạn phải làm thế này:
  ```javascript
  // Cha truyền cho Toolbar
  <Toolbar theme={theme} />
  
  // Toolbar nhận và truyền tiếp cho ThemedButton
  function Toolbar({ theme }) {
    return <ThemedButton theme={theme} />
  }
  ```
- Với Context, `Toolbar` **không cần** nhận và truyền tiếp `theme` nữa!

---

##### BƯỚC 5: Component Cha - App (Người quản lý State)

###### 5.1. Khai báo Component

```javascript
export default function App() {
```

| Thành phần | Phân loại | Data Type | Naming |
|---|---|---|---|
| `export default` | **Keyword** | N/A | System Standard |
| `App` | **Function Component** | Function | Changeable (PascalCase) |

**Action:** Định nghĩa Component chính tên `App` và export nó làm mặc định.

---

###### 5.2. Tạo State (Bộ nhớ)

```javascript
const [theme, setTheme] = useState('light');
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `useState` | **Hook Function** | `'light'` (giá trị khởi tạo) | Array `[state, setState]` | Function: Built-in Hook<br>Input: **String**<br>Output: **Array** | System Standard |
| `'light'` | **Initial State** | N/A | N/A | **String** | Changeable |
| `theme` | **State Variable** | N/A | Giá trị hiện tại của State | **String** (`'light'` hoặc `'dark'`) | Changeable (camelCase) |
| `setTheme` | **State Setter Function** | Giá trị mới (String) hoặc Updater Function | `undefined` (void) | Function: Setter<br>Input: **String** hoặc **Function**<br>Output: **void** | System Pattern: `set` + Tên State (PascalCase) |

**Action:** Tạo một State tên `theme` với giá trị ban đầu là `'light'`. Hàm `setTheme` dùng để thay đổi giá trị của `theme`.

---

###### 5.3. Tạo Handler Function (Hàm xử lý sự kiện)

```javascript
const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
};
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `toggleTheme` | **Handler Function** | N/A (không nhận tham số) | `undefined` (void) | Function: Event Handler<br>Output: **void** | Changeable (camelCase, pattern: `handle` + Action hoặc `toggle` + Noun) |
| `setTheme` | **Function Call** | Updater Function | `undefined` | Function: Setter | Từ Bước 5.2 |
| `(prevTheme) => (...)` | **Updater Function** | `prevTheme` (giá trị State hiện tại) | Giá trị State mới | Function: Arrow Function<br>Input: **String**<br>Output: **String** | Pattern: `prev` + Tên State |
| `prevTheme` | **Parameter** | N/A | N/A | **String** | Pattern chuẩn (Changeable: `prev`, `old`, `current`) |
| `prevTheme === 'light' ? 'dark' : 'light'` | **Ternary Operator** | `prevTheme` (String) | `'dark'` hoặc `'light'` | **String** | Logic |

**Action:** Tạo một hàm `toggleTheme` để đảo ngược giá trị của `theme`:
- Nếu đang là `'light'` → Đổi thành `'dark'`
- Nếu đang là `'dark'` → Đổi thành `'light'`

**Tại sao dùng Updater Function `(prevTheme) => ...`?**
> Vì giá trị mới (`'dark'` hoặc `'light'`) phụ thuộc vào giá trị cũ. Dùng Updater Function đảm bảo React luôn lấy giá trị State mới nhất (tránh bug khi State cập nhật bất đồng bộ).

---

###### 5.4. Return JSX với Provider

```javascript
return (
  <ThemeContext.Provider value={theme}>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>useContext Example</h1>
      
      <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
        Toggle Theme
      </button>

      <Toolbar />
    </div>
  </ThemeContext.Provider>
);
```

| Thành phần | Phân loại | Input | Output | Data Type | Naming |
|---|---|---|---|---|---|
| `<ThemeContext.Provider>` | **JSX Component** | `value` prop | React Element | **React Element** | System Pattern: `ContextName.Provider` |
| `value={theme}` | **JSX Prop** | `theme` (String) | N/A | **String** | System Standard (prop name: `value`) |
| `onClick={toggleTheme}` | **JSX Event Prop** | `toggleTheme` (Function) | N/A | **Function** | System Standard (event: `onClick`) |
| `<Toolbar />` | **JSX Component** | Không có props | React Element | **React Element** | Component từ Bước 4 |

**Action:**
1. **Bọc toàn bộ UI** trong `<ThemeContext.Provider>` → Tạo "đường hầm" và bơm giá trị `theme` vào.
2. **Tạo nút "Toggle Theme"** → Khi click, gọi hàm `toggleTheme` để đổi theme.
3. **Render `<Toolbar />`** → Component này sẽ render `<ThemedButton />`, và `ThemedButton` sẽ tự động nhận giá trị `theme` từ Context.

**Mental Model:**
> Component `App` giống như một trạm bơm nước. Nó bơm nước (giá trị `theme`) vào đường hầm (`ThemeContext.Provider`). Bất kỳ ai ở bên trong đường hầm (bên trong `<ThemeContext.Provider>`) đều có thể cắm ống hút (`useContext`) để lấy nước.

---

#### Tổng kết luồng dữ liệu (Data Flow)

```
1. User click nút "Toggle Theme"
   ↓
2. Gọi hàm toggleTheme()
   ↓
3. Gọi setTheme() → State 'theme' thay đổi từ 'light' → 'dark'
   ↓
4. React render lại Component App
   ↓
5. Provider nhận giá trị mới: <ThemeContext.Provider value="dark">
   ↓
6. Component ThemedButton (ở sâu bên trong) gọi useContext(ThemeContext)
   ↓
7. useContext trả về giá trị mới: "dark"
   ↓
8. ThemedButton render lại với style mới (nền đen, chữ trắng)
```

**Điểm quan trọng:**
- `Toolbar` **KHÔNG** bị render lại (vì không dùng `theme`).
- Chỉ `ThemedButton` render lại (vì nó subscribe vào Context qua `useContext`).

---

#### Bảng tổng hợp Data Types

| Biến/Hàm | Kiểu dữ liệu (Data Type) | Có thể đổi tên? |
|---|---|---|
| `ThemeContext` | **Context Object** | ✅ Có (PascalCase) |
| `theme` (trong `App`) | **String** (`'light'` \| `'dark'`) | ✅ Có (camelCase) |
| `setTheme` | **Function** (Setter) | ✅ Có (pattern: `set` + Tên) |
| `toggleTheme` | **Function** (Handler) | ✅ Có (camelCase) |
| `theme` (trong `ThemedButton`) | **String** (`'light'` \| `'dark'`) | ✅ Có (camelCase) |
| `styles` | **Object** (CSS properties) | ✅ Có (camelCase) |
| `prevTheme` | **String** (tham số của Updater Function) | ✅ Có (pattern: `prev` + Tên) |
| `createContext` | **Function** (Built-in) | ❌ Không (System Standard) |
| `useContext` | **Hook Function** (Built-in) | ❌ Không (System Standard) |
| `useState` | **Hook Function** (Built-in) | ❌ Không (System Standard) |

---

### 3. Custom Hooks: Vũ khí của chuyên gia

Đến lúc này, bạn thấy Component bắt đầu phình to vì chứa quá nhiều logic (State, Effect, Handler...). Làm sao để tái sử dụng logic này cho component khác?

Giải pháp: Custom Hooks.

Custom Hook thực chất là một hàm Javascript bình thường nhưng có thể gọi các Hook khác (useState, useEffect).

**Quy ước:** Tên hàm bắt buộc bắt đầu bằng `use...` (ví dụ: `useWindowSize`, `useFetch`, `useAuth`).

**Ví dụ:** Tách logic đồng hồ đếm ngược ở Module 3 ra để tái sử dụng.

```javascript
// File: useCountdown.js
function useCountdown(startValue) {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    const id = setInterval(() => {
       setCount(c => c > 0 ? c - 1 : 0);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return count; // Trả về dữ liệu cần thiết
}

// File: App.js (Component giờ đây cực gọn)
function App() {
  const count = useCountdown(10); // Gọi 1 dòng là xong
  return <h1>{count}</h1>;
}
```

### 4. Bài tập thực hành (Module 4)

**Bài toán:** Chuyển đổi tiền tệ (Currency Converter).

1. Có 2 ô input: USD và VND.
    
2. Nhập vào ô USD -> Ô VND tự nhảy số (nhân 24000).
    
3. Nhập vào ô VND -> Ô USD tự nhảy số (chia 24000).
    

**Gợi ý giải (Lifting State Up):**

- Đừng để mỗi ô input tự giữ state của mình.
    
- Hãy để component cha giữ 2 state: `amount` (số tiền) và `currency` (đơn vị vừa nhập).
    
- Tính toán giá trị quy đổi ngay trong lúc render (Derived State), không cần lưu 2 state tiền riêng biệt.
    

## PHẦN 6: TÀI LIỆU CHI TIẾT - MODULE 5: HIỆU NĂNG VÀ HỆ SINH THÁI (ADVANCED)

Khi ứng dụng đã chạy đúng, bước tiếp theo là chạy **nhanh** và **mượt**.

### 1. Performance: Nghệ thuật của việc "Lười biếng"

React mặc định rất "chăm chỉ": Khi cha render, tất cả con cái đều render lại theo, dù dữ liệu của con không đổi. Điều này an toàn nhưng tốn kém.

#### 1.1. React.memo: Chiếc khiên bảo vệ

Dùng để bao bọc Component con. Nó sẽ chặn lại việc render nếu `props` đầu vào không thay đổi.

```jsx
const Child = React.memo(({ name }) => {
  console.log("Child render"); // Chỉ log khi 'name' thay đổi
  return <div>{name}</div>;
});
```

#### 1.2. useMemo & useCallback: Bộ nhớ đệm (Cache)

- **`useMemo`:** Cache **giá trị** tính toán (tránh tính lại 1 + 1 = 2 mỗi lần render).
    
- **`useCallback`:** Cache **hàm** (tránh tạo ra hàm mới mỗi lần render, giúp `React.memo` ở con hoạt động đúng).
    

> **Lời khuyên:** Đừng tối ưu sớm (Premature Optimization). Chỉ dùng khi thấy chậm hoặc component quá nặng.

### 2. Forms: Giao tiếp với người dùng

Forms (Biểu mẫu) là cách chính để thu thập dữ liệu từ người dùng. Trong React, có 2 triết lý xử lý form hoàn toàn khác nhau.

---

#### Mental Model: Puppet vs Independent Actor

Hãy tưởng tượng một ô input như một **diễn viên** trên sân khấu:

| Loại | Ẩn dụ | Ai quyết định giá trị? | Khi nào lấy dữ liệu? |
|---|---|---|---|
| **Controlled** | **Con rối** (Puppet) | React (State) | Mọi lúc (real-time) |
| **Uncontrolled** | **Diễn viên độc lập** | DOM (Browser) | Khi cần (on-demand) |

**Controlled Component:** React cầm dây điều khiển con rối. Mỗi ký tự người dùng gõ → React cập nhật State → State đẩy giá trị mới xuống input. React luôn biết input đang chứa gì.

**Uncontrolled Component:** Diễn viên tự do diễn. React không quan tâm input đang chứa gì cho đến khi cần (ví dụ: khi submit form), lúc đó mới "hỏi" DOM.

---

#### 2.1. Controlled Component (Khuyên dùng)

**Định nghĩa:** React nắm quyền kiểm soát hoàn toàn. Dữ liệu trong input luôn đồng bộ với State.

**Đặc điểm:**
- ✅ **Single Source of Truth:** State là nguồn sự thật duy nhất.
- ✅ **Validation real-time:** Kiểm tra lỗi ngay khi gõ.
- ✅ **Dễ debug:** Bạn luôn biết giá trị hiện tại trong State.
- ❌ **Verbose:** Cần viết nhiều code hơn (mỗi input cần 1 state + 1 handler).

**Cơ chế hoạt động:**

```
User gõ "A" → onChange kích hoạt → setState("A") → Re-render → Input hiển thị "A"
```

**Quy tắc vàng:** Input **PHẢI** có cả 2 props:
1. `value={state}` - Khóa giá trị vào State
2. `onChange={handler}` - Cập nhật State khi user gõ

##### Ví dụ 1: Input đơn giản

```jsx
import { useState } from 'react';

function NameForm() {
  const [name, setName] = useState("");

  return (
    <div>
      <input 
        type="text"
        value={name}  // Giá trị luôn đồng bộ với state
        onChange={(e) => setName(e.target.value)}  // Cập nhật state mỗi lần gõ
        placeholder="Nhập tên của bạn"
      />
      <p>Bạn đang gõ: {name}</p>  {/* Real-time display */}
    </div>
  );
}
```

**Giải thích:**
- `e.target.value`: Lấy giá trị hiện tại của input từ sự kiện `onChange`.
- Mỗi lần gõ → `setName` cập nhật state → Component re-render → Input hiển thị giá trị mới.

##### Ví dụ 2: Form đầy đủ với validation

```jsx
import { useState } from 'react';

function RegistrationForm() {
  // State cho từng field
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    agreeTerms: false
  });

  // State cho errors
  const [errors, setErrors] = useState({});

  // Handler chung cho tất cả text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    
    if (formData.username.length < 3) {
      newErrors.username = "Tên phải có ít nhất 3 ký tự";
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      newErrors.age = "Tuổi phải từ 18-100";
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Bạn phải đồng ý điều khoản";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Ngăn trình duyệt reload trang
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit thành công
    console.log("Form data:", formData);
    alert("Đăng ký thành công!");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Đăng ký tài khoản</h2>
      
      {/* Text Input */}
      <div style={{ marginBottom: '15px' }}>
        <label>Tên đăng nhập:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.username && <p style={{ color: 'red', fontSize: '12px' }}>{errors.username}</p>}
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: '15px' }}>
        <label>Mật khẩu:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
      </div>

      {/* Number Input */}
      <div style={{ marginBottom: '15px' }}>
        <label>Tuổi:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.age && <p style={{ color: 'red', fontSize: '12px' }}>{errors.age}</p>}
      </div>

      {/* Select/Dropdown */}
      <div style={{ marginBottom: '15px' }}>
        <label>Giới tính:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>

      {/* Checkbox */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          {' '}Tôi đồng ý với điều khoản
        </label>
        {errors.agreeTerms && <p style={{ color: 'red', fontSize: '12px' }}>{errors.agreeTerms}</p>}
      </div>

      <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Đăng ký
      </button>

      {/* Debug: Hiển thị state hiện tại */}
      <pre style={{ marginTop: '20px', background: '#f4f4f4', padding: '10px' }}>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </form>
  );
}

export default RegistrationForm;
```

**Kỹ thuật nâng cao trong ví dụ:**

1. **Computed Property Name:** `[name]: value` - Dùng giá trị của biến `name` làm key của object.
2. **Single Handler:** Một hàm `handleChange` xử lý tất cả inputs thay vì viết riêng từng hàm.
3. **Conditional Logic:** Xử lý checkbox khác với text input (`checked` vs `value`).
4. **Real-time Validation:** Có thể thêm validation ngay trong `handleChange` để hiển thị lỗi khi gõ.

---

#### 2.2. Uncontrolled Component

**Định nghĩa:** DOM (trình duyệt) giữ dữ liệu. React chỉ "hỏi" DOM khi cần (thường là khi submit).

**Đặc điểm:**
- ✅ **Ít code hơn:** Không cần state cho mỗi input.
- ✅ **Tích hợp dễ với thư viện non-React:** Ví dụ: jQuery plugins.
- ✅ **Performance tốt hơn:** Không re-render mỗi lần gõ.
- ❌ **Khó validate real-time:** Phải đợi đến khi submit.
- ❌ **Khó debug:** Không biết giá trị hiện tại cho đến khi "hỏi" DOM.

**Cơ chế hoạt động:**

```
User gõ "A" → DOM tự lưu "A" → React không biết gì → Submit → useRef.current.value lấy "A"
```

##### Ví dụ 1: Form đơn giản với useRef

```jsx
import { useRef } from 'react';

function UncontrolledForm() {
  // Tạo ref để "trỏ" đến DOM element
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lấy giá trị từ DOM khi submit
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    
    console.log("Submitted:", { name, email });
    alert(`Xin chào ${name}!`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tên:</label>
        <input 
          type="text" 
          ref={nameRef}  // Gắn ref vào input
          defaultValue="Nguyễn Văn A"  // Giá trị mặc định (không phải value)
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          ref={emailRef}
        />
      </div>
      
      <button type="submit">Gửi</button>
    </form>
  );
}
```

**Lưu ý quan trọng:**
- Dùng `defaultValue` thay vì `value` (vì không có state để đồng bộ).
- Dùng `ref={nameRef}` để tạo "cầu nối" đến DOM element.
- Chỉ đọc giá trị khi cần: `nameRef.current.value`.

##### Ví dụ 2: File Upload (Use case điển hình)

```jsx
import { useRef } from 'react';

function FileUploadForm() {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lấy file từ input
    const file = fileInputRef.current.files[0];
    
    if (file) {
      console.log("File name:", file.name);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      
      // Thực tế: Upload file lên server
      // uploadToServer(file);
    } else {
      alert("Vui lòng chọn file!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"  // Chỉ chấp nhận ảnh
      />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Tại sao file input phải dùng Uncontrolled?**
- Vì lý do bảo mật, JavaScript **không thể** set giá trị cho `<input type="file">`.
- Bạn không thể làm `<input type="file" value={someFile} />` → Lỗi!
- Chỉ có thể **đọc** file sau khi user chọn.

---

#### So sánh Controlled vs Uncontrolled

| Tiêu chí | Controlled | Uncontrolled |
|---|---|---|
| **Nguồn sự thật** | React State | DOM |
| **Cú pháp** | `value={state}` + `onChange` | `ref={myRef}` + `defaultValue` |
| **Khi nào lấy dữ liệu?** | Mọi lúc (real-time) | Khi cần (on-demand) |
| **Validation** | ✅ Real-time dễ dàng | ❌ Chỉ khi submit |
| **Re-render** | Mỗi lần gõ | Không re-render |
| **Code lượng** | Nhiều hơn | Ít hơn |
| **Use case** | Form phức tạp, cần validation | Form đơn giản, file upload |

---

#### Khi nào dùng cái nào?

**Dùng Controlled Component khi:**
- ✅ Cần validation real-time (hiển thị lỗi ngay khi gõ).
- ✅ Cần disable/enable nút submit dựa trên giá trị input.
- ✅ Cần format input (ví dụ: tự động thêm dấu phẩy vào số tiền).
- ✅ Cần đồng bộ nhiều inputs (ví dụ: password và confirm password).
- ✅ Form có logic phức tạp.

**Dùng Uncontrolled Component khi:**
- ✅ Form cực kỳ đơn giản (1-2 inputs).
- ✅ File upload (bắt buộc).
- ✅ Tích hợp với thư viện non-React.
- ✅ Cần performance tối đa (form có hàng trăm inputs).

**Quy tắc vàng:** **Mặc định dùng Controlled**. Chỉ chuyển sang Uncontrolled khi có lý do rõ ràng.

---

#### Lỗi thường gặp

**❌ Lỗi 1: Thiếu onChange**

```jsx
// SAI: Input bị "đóng băng", không gõ được
<input value={name} />
```

**Lý do:** React khóa giá trị vào `name`. Khi gõ, DOM muốn thay đổi nhưng React không cho phép (vì không có `onChange` để cập nhật state).

**✅ Sửa:**

```jsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

---

**❌ Lỗi 2: Dùng value thay vì defaultValue cho Uncontrolled**

```jsx
// SAI: Trở thành Controlled nhưng thiếu onChange
<input ref={myRef} value="Initial" />
```

**✅ Sửa:**

```jsx
<input ref={myRef} defaultValue="Initial" />
```

---

**❌ Lỗi 3: Trộn lẫn Controlled và Uncontrolled**

```jsx
// SAI: Không thể vừa có value vừa có ref
<input value={name} ref={myRef} onChange={...} />
```

**Quy tắc:** Chọn một trong hai, không được trộn lẫn.

### 3. Routing: Ảo thuật chuyển trang (SPA)

Trong React, chúng ta xây dựng **Single Page Application (SPA)**.

- **Web thường:** Bấm link -> Trình duyệt tải trang mới trắng bóc -> Tải lại từ đầu.
    
- **React Router:** Bấm link -> React chỉ **thay đổi Component** ở giữa màn hình. Header/Footer giữ nguyên. Không tải lại trang.
    

```jsx
import { Routes, Route, Link } from "react-router-dom";

// Định nghĩa các tuyến đường
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

// Sử dụng Link thay cho thẻ <a>
<Link to="/about">Về chúng tôi</Link>
```

---

## PHẦN 7: NEXT.JS - FRAMEWORK REACT PRODUCTION-READY

### Giới thiệu: Tại sao cần Next.js?

React là một **thư viện** (library) chỉ tập trung vào UI. Khi xây dựng ứng dụng thực tế, bạn cần thêm nhiều thứ:

| Vấn đề | React thuần | Next.js |
|---|---|---|
| **Routing** | Phải cài `react-router-dom` | ✅ Built-in, file-based routing |
| **SEO** | ❌ Kém (vì Client-Side Rendering) | ✅ Tốt (Server-Side Rendering) |
| **Performance** | Phải tự tối ưu | ✅ Tự động tối ưu (code splitting, image optimization) |
| **API Backend** | Phải tạo server riêng | ✅ API Routes built-in |
| **Deployment** | Phải config phức tạp | ✅ Deploy 1 click với Vercel |

> **Mental Model:** Nếu React là "động cơ xe", thì Next.js là "cả chiếc ô tô hoàn chỉnh" (có vô lăng, ghế ngồi, điều hòa...).

---

### 0. Kiến thức nền tảng: npm, npx và Node.js

Trước khi cài đặt Next.js, bạn cần hiểu một số công cụ cơ bản trong hệ sinh thái JavaScript/Node.js.

#### 0.1. Node.js là gì?

**Node.js** là môi trường chạy JavaScript **ngoài trình duyệt** (trên máy tính/server của bạn).

**Mental Model:**
- **Trình duyệt**: Chạy JavaScript để tương tác với trang web (DOM, events)
- **Node.js**: Chạy JavaScript để làm bất cứ thứ gì (đọc file, tạo server, build tools)

**Cài đặt Node.js:**
1. Truy cập: [nodejs.org](https://nodejs.org)
2. Tải phiên bản LTS (Long Term Support)
3. Cài đặt và kiểm tra:

```bash
node --version   # v20.x.x
npm --version    # 10.x.x
```

---

#### 0.2. npm (Node Package Manager)

**npm** là công cụ quản lý thư viện (packages) cho JavaScript.

**Ẩn dụ:** npm giống như **App Store** cho code JavaScript.
- Bạn muốn dùng React? → `npm install react`
- Bạn muốn dùng Next.js? → `npm install next`

##### Các lệnh npm cơ bản:

```bash
# Cài đặt package
npm install react          # Cài React vào project hiện tại
npm install -g vercel      # Cài global (dùng được ở mọi nơi)

# Chạy scripts (định nghĩa trong package.json)
npm run dev                # Chạy development server
npm run build              # Build production
npm start                  # Chạy production server

# Khác
npm init                   # Tạo package.json mới
npm uninstall react        # Gỡ package
```

---

#### 0.3. npx (Node Package Execute)

**npx** cho phép **chạy** một package **mà không cần cài đặt** vĩnh viễn.

**Sự khác biệt:**

| Lệnh | npm | npx |
|---|---|---|
| **Mục đích** | Cài đặt package | Chạy package (1 lần) |
| **Ví dụ** | `npm install create-next-app` | `npx create-next-app@latest` |
| **Kết quả** | Package lưu vào `node_modules/` | Chạy xong → Xóa |

**Tại sao dùng npx?**
- ✅ Luôn dùng phiên bản mới nhất (`@latest`)
- ✅ Không làm "bẩn" máy tính (không cài đặt vĩnh viễn)
- ✅ Tiết kiệm dung lượng

**Ví dụ thực tế:**

```bash
# Tạo Next.js project (dùng npx - khuyên dùng)
npx create-next-app@latest my-app

# Tương đương với (dùng npm - cách cũ):
npm install -g create-next-app   # Bước 1: Cài global
create-next-app my-app            # Bước 2: Chạy
```

---

#### 0.4. package.json - "Hồ sơ" của Project

**package.json** là file chứa thông tin về project: tên, phiên bản, dependencies, scripts.

**Ví dụ package.json của Next.js project:**

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "15.1.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0"
  }
}
```

**Giải thích:**

| Phần | Ý nghĩa | Ví dụ |
|---|---|---|
| **`name`** | Tên project | `"my-app"` |
| **`version`** | Phiên bản hiện tại | `"0.1.0"` |
| **`scripts`** | Các lệnh shortcut | `npm run dev` → chạy `next dev` |
| **`dependencies`** | Thư viện cần để chạy app | React, Next.js |
| **`devDependencies`** | Thư viện chỉ cần khi develop | ESLint, TypeScript |

**Cách hoạt động:**

1. Bạn chạy `npm install` → npm đọc `package.json`
2. npm tải tất cả packages trong `dependencies` và `devDependencies`
3. Lưu vào folder `node_modules/`

---

#### 0.5. node_modules/ và .gitignore

**`node_modules/`**: Folder chứa tất cả code của các thư viện đã cài.
- ⚠️ Rất nặng (có thể 100MB - 1GB)
- ❌ **KHÔNG BAO GIỜ** commit lên Git

**`.gitignore`**: File liệt kê những gì Git nên bỏ qua.

```
# .gitignore
node_modules/
.env.local
.next/
```

**Giải thích chi tiết:**

##### 1. `.env.local` - File chứa biến môi trường (Environment Variables)

**`.env.local`** là file chứa các **thông tin nhạy cảm** và **cấu hình riêng** cho môi trường local của bạn.

**Mental Model:** `.env.local` giống như **két sắt cá nhân** - chứa mật khẩu, API keys mà chỉ bạn biết.

**Ví dụ nội dung file `.env.local`:**

```
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_API_KEY=abc123xyz789
STRIPE_SECRET_KEY=sk_test_51Hxxx...
EMAIL_PASSWORD=mySecretPassword123
```

**Tại sao KHÔNG được commit `.env.local`?**

- 🔒 **Bảo mật:** Chứa API keys, passwords, database URLs → Nếu push lên GitHub, hacker có thể lấy được!
- 👥 **Khác nhau giữa các dev:** Mỗi người có database riêng, API key riêng.
- 🌍 **Khác nhau giữa môi trường:** Local, staging, production có config khác nhau.

**Cách sử dụng trong Next.js:**

```jsx
// src/app/page.js
export default function Home() {
  // Biến có NEXT_PUBLIC_ → Có thể dùng ở browser
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  
  // Biến KHÔNG có NEXT_PUBLIC_ → Chỉ dùng ở server
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  return <div>API Key: {apiKey}</div>;
}
```

**Quy tắc đặt tên:**
- `NEXT_PUBLIC_*`: Biến **công khai**, có thể dùng ở browser (ví dụ: Google Maps API key).
- Không có prefix: Biến **bí mật**, chỉ dùng ở server (ví dụ: database password).

**Quy trình làm việc nhóm:**

1. **Tạo file mẫu** `.env.example` (commit lên Git):
   ```
   # .env.example
   DATABASE_URL=your_database_url_here
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

2. **Mỗi dev tự tạo** `.env.local` (KHÔNG commit):
   ```
   # .env.local (của Dev A)
   DATABASE_URL=postgresql://localhost:5432/dev_a_db
   NEXT_PUBLIC_API_KEY=dev_a_key_123
   ```

3. **Production** dùng `.env.production` hoặc config trên hosting (Vercel, Netlify).

---

##### 2. `.next/` - Folder chứa kết quả build của Next.js

**`.next/`** là folder được Next.js **tự động tạo** khi bạn chạy `npm run dev` hoặc `npm run build`.

**Mental Model:** `.next/` giống như **rác thải công nghiệp** - sản phẩm phụ của quá trình sản xuất, có thể tái tạo bất cứ lúc nào.

**Nội dung folder `.next/`:**

```
.next/
├── cache/              # Cache để build nhanh hơn
├── server/             # Code chạy trên server
├── static/             # CSS, JS đã được optimize
└── build-manifest.json # Thông tin về build
```

**Tại sao KHÔNG được commit `.next/`?**

- 🗑️ **Rất nặng:** Có thể lên đến 100MB - 500MB.
- ♻️ **Tái tạo được:** Chỉ cần chạy `npm run build` là có lại.
- 🔄 **Thay đổi liên tục:** Mỗi lần build lại, nội dung thay đổi → Conflict Git liên tục.
- 💻 **Khác nhau giữa máy:** Build trên Mac khác build trên Windows.

**Cách hoạt động:**

```
Bạn viết code → Chạy npm run dev → Next.js build code vào .next/ → Server chạy từ .next/
```

**Khi nào `.next/` được tạo?**

- ✅ `npm run dev` → Tạo `.next/` cho development.
- ✅ `npm run build` → Tạo `.next/` cho production (optimized).
- ✅ Tự động xóa và tạo lại mỗi lần build.

**Nếu xóa `.next/` thì sao?**

- ❌ App không chạy được (vì thiếu code đã build).
- ✅ Chạy lại `npm run dev` → Next.js tự động tạo lại `.next/`.

**Quy trình làm việc nhóm:**

1. **Người A** commit code nguồn (không commit `.next/`).
2. **Người B** clone project → Chạy `npm run dev` → Next.js tự động tạo `.next/` trên máy Người B.

---

**Quy trình làm việc nhóm:**

1. **Người A** tạo project → Commit `package.json` (không commit `node_modules/`)
2. **Người B** clone project → Chạy `npm install` → npm tự động tải `node_modules/`

---

#### 0.6. Các công cụ khác trong setup

##### A. ESLint

**ESLint** là công cụ kiểm tra lỗi code tự động (linter).

**Ví dụ lỗi ESLint bắt được:**
```javascript
const name = "An"  // ❌ Thiếu dấu chấm phẩy
const age = 25;    // ✅ OK
```

**Lợi ích:**
- ✅ Bắt lỗi cú pháp trước khi chạy
- ✅ Đồng nhất code style trong team
- ✅ Gợi ý best practices

##### B. Tailwind CSS

**Tailwind CSS** là CSS framework dùng **utility classes**.

**So sánh:**

```css
/* CSS truyền thống */
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
```

```jsx
{/* Tailwind CSS */}
<button className="bg-blue-500 text-white px-5 py-2 rounded">
  Click me
</button>
```

**Ưu điểm:**
- ✅ Viết CSS nhanh hơn (không cần đặt tên class)
- ✅ Không bị CSS conflict
- ✅ Responsive dễ dàng (`md:`, `lg:`)

##### C. Import Alias (@/)

**Vấn đề:** Import path dài và khó đọc.

```javascript
// ❌ Khó đọc, dễ sai
import Button from '../../../components/Button';
import { formatDate } from '../../../../lib/utils';
```

**Giải pháp:** Dùng alias `@/` trỏ đến `src/`.

```javascript
// ✅ Dễ đọc, không sai
import Button from '@/components/Button';
import { formatDate } from '@/lib/utils';
```

**Config (Next.js tự động setup):**

```json
// tsconfig.json hoặc jsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

#### 0.7. Tóm tắt

**Trước khi cài Next.js, bạn cần:**
- ✅ Cài Node.js (bao gồm npm)
- ✅ Hiểu `npm install` (cài packages)
- ✅ Hiểu `npx` (chạy packages 1 lần)
- ✅ Hiểu `package.json` (hồ sơ project)
- ✅ Biết `node_modules/` không commit lên Git

**Kiểm tra nhanh:**

```bash
node --version   # Phải có kết quả (v18+)
npm --version    # Phải có kết quả (v9+)
```

Nếu cả hai lệnh đều hoạt động → Bạn đã sẵn sàng cài Next.js! 🚀

---

### 1. Cài đặt và Khởi tạo Project

#### Tạo project mới (Next.js 15+)

```bash
npx create-next-app@latest my-app
```

**Câu hỏi trong quá trình cài đặt:**

```
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
```

**Khuyến nghị cho người mới:**
- TypeScript: **Yes** (nếu đã quen) hoặc **No** (nếu mới học)
- ESLint: **Yes**
- Tailwind CSS: **Yes** (CSS framework tiện lợi)
- **`src/` directory: Yes** (tổ chức code rõ ràng hơn) - _Xem giải thích chi tiết bên dưới_
- App Router: **Yes** (chuẩn mới, mạnh hơn)
- Import alias: **Yes** (dùng `@/components` thay vì `../../components`)

---

#### Giải thích: `src/` directory là gì?

Đây là lựa chọn về **cấu trúc thư mục** cho project Next.js của bạn.

##### **Option 1: KHÔNG dùng `src/` (Root-level)**

```
my-app/
├── app/              # Code ứng dụng
│   ├── page.js
│   └── layout.js
├── components/       # Code ứng dụng
├── public/           # Static files
├── package.json      # Config
├── next.config.js    # Config
└── README.md         # Config
```

**Đặc điểm:**
- Thư mục `app/` và `components/` nằm **cùng cấp** với các file config (`package.json`, `next.config.js`).
- Code ứng dụng và config files **trộn lẫn** với nhau.

---

##### **Option 2: Dùng `src/` (Recommended)**

```
my-app/
├── src/              # ← TẤT CẢ code ứng dụng nằm đây
│   ├── app/          # Routing
│   │   ├── page.js
│   │   └── layout.js
│   ├── components/   # Components
│   └── lib/          # Utilities
├── public/           # Static files
├── package.json      # Config
├── next.config.js    # Config
└── README.md         # Config
```

**Đặc điểm:**
- Thư mục `src/` chứa **TẤT CẢ** code ứng dụng (`app/`, `components/`, `lib/`).
- Code ứng dụng **tách biệt** với config files.
- Root directory chỉ chứa config files và `public/`.

---

##### So sánh: `src/` vs Root-level

| Tiêu chí | Không dùng `src/` | Dùng `src/` (✅ Khuyên dùng) |
|---|---|---|
| **Tổ chức** | Code và config trộn lẫn | Code tách biệt với config |
| **Dễ tìm file** | ❌ Khó (nhiều folder ở root) | ✅ Dễ (chỉ vào `src/` là thấy code) |
| **Quy ước** | Ít phổ biến | ✅ Chuẩn trong React/Node.js |
| **Khi nào dùng?** | Project nhỏ, cá nhân | ✅ Project team, production |

---

##### Tại sao nên dùng `src/`?

**1. Tách biệt rõ ràng (Separation of Concerns)**
- **Code ứng dụng** (business logic) → `src/`
- **Config files** (setup, dependencies) → Root

**Mental Model:** Tủ quần áo
- `src/` = Ngăn chứa quần áo (code)
- Root = Nhãn dán bên ngoài tủ (config)

**2. Dễ navigate**
Khi mở project, bạn biết ngay:
- Muốn sửa code → Vào `src/`
- Muốn config → Xem root

**3. Quy ước chuẩn**
Hầu hết React projects (Create React App, Vite) đều dùng `src/`.

**4. Tránh nhầm lẫn**
Không dùng `src/`:
```
my-app/
├── app/           # ← Code hay config?
├── components/    # ← Code hay config?
├── lib/           # ← Code hay config?
├── public/        # ← Static files
├── package.json   # ← Config
```

Dùng `src/`:
```
my-app/
├── src/           # ← 100% code ở đây!
├── public/        # ← Static files
├── package.json   # ← Config
```

---

##### Khi nào KHÔNG cần `src/`?

- ✅ Project cá nhân, nhỏ (< 10 files)
- ✅ Đang học Next.js lần đầu (ít folder hơn, đơn giản hơn)
- ✅ Muốn setup nhanh, không quan tâm cấu trúc

**Lưu ý:** Bạn có thể bắt đầu không dùng `src/`, sau này dễ dàng chuyển sang dùng `src/` khi project lớn lên.

---

##### Tóm tắt

> **Khuyến nghị:** Chọn **Yes** cho `src/` directory nếu bạn làm project nghiêm túc hoặc làm việc nhóm. Chọn **No** nếu chỉ học thử hoặc làm project nhỏ.

**Quy tắc vàng:** Khi nghi ngờ, chọn **Yes** (dùng `src/`). Nó giúp project dễ maintain hơn về lâu dài.

#### Chạy development server

```bash
cd my-app
npm run dev
```

Mở trình duyệt: `http://localhost:3000`

---

### 2. Cấu trúc thư mục (App Router)

```
my-app/
├── src/
│   ├── app/                 # Routing chính (mỗi folder = 1 route)
│   │   ├── layout.js        # Layout chung cho toàn app
│   │   ├── page.js          # Trang chủ (/)
│   │   ├── about/
│   │   │   └── page.js      # Trang /about
│   │   └── blog/
│   │       ├── page.js      # Trang /blog
│   │       └── [id]/
│   │           └── page.js  # Dynamic route: /blog/123
│   ├── components/          # Các component tái sử dụng
│   └── lib/                 # Utility functions, helpers
├── public/                  # Static files (images, fonts)
├── package.json
└── next.config.js           # Config Next.js
```

**Quy tắc vàng:**
- **`page.js`**: Định nghĩa một trang (route).
- **`layout.js`**: Định nghĩa layout bao quanh các trang con.
- **`loading.js`**: UI hiển thị khi đang tải.
- **`error.js`**: UI hiển thị khi có lỗi.

---

### 3. Server Components vs Client Components

Đây là **khái niệm mới nhất** và quan trọng nhất của Next.js App Router.

#### Mental Model: Nhà hàng

| Loại | Nơi chạy | Ẩn dụ | Khi nào dùng? |
|---|---|---|---|
| **Server Component** | Server (Node.js) | **Bếp** - Nấu xong mới đưa ra | Fetch data, SEO, không cần interactivity |
| **Client Component** | Browser (JavaScript) | **Bàn ăn** - Khách tự phục vụ | Event handlers, useState, useEffect |

#### 3.1. Server Component (Mặc định)

**Đặc điểm:**
- ✅ Chạy trên server, gửi HTML về browser.
- ✅ Có thể truy cập database trực tiếp.
- ✅ Không tăng bundle size JavaScript cho client.
- ❌ **KHÔNG** dùng được `useState`, `useEffect`, event handlers.

**Ví dụ: Fetch data từ API**

```jsx
// src/app/posts/page.js
// Đây là Server Component (mặc định, không cần khai báo gì)

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();  // Fetch data trực tiếp trong component!

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.slice(0, 10).map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Điểm đặc biệt:**
- Component là `async function` - điều này **KHÔNG THỂ** làm trong React thuần!
- Fetch data ngay trong component, không cần `useEffect`.
- Data được fetch trên server → HTML hoàn chỉnh gửi về browser → SEO tốt.

---

#### 3.2. Client Component

**Khi nào cần Client Component?**
- ✅ Cần `useState`, `useEffect`, `useContext`.
- ✅ Cần event handlers (`onClick`, `onChange`).
- ✅ Cần browser APIs (`window`, `localStorage`).
- ✅ Cần thư viện chỉ chạy trên browser.

**Cách khai báo:** Thêm `'use client'` ở đầu file.

**Ví dụ: Counter với useState**

```jsx
// src/components/Counter.js
'use client';  // Bắt buộc phải có dòng này!

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Tăng
      </button>
    </div>
  );
}
```

**Quy tắc quan trọng:**
- Server Component có thể import Client Component.
- Client Component **KHÔNG THỂ** import Server Component.

---

#### 3.3. Kết hợp Server và Client Components: Sức mạnh thực sự của Next.js

**Câu hỏi quan trọng:** Next.js có phải là Server Component hay Client Component?

**Trả lời:** Next.js **KHÔNG PHẢI** chỉ là một trong hai. Nó là framework cho phép bạn **kết hợp cả hai** một cách thông minh trong cùng một ứng dụng.

> **Mental Model: Tòa nhà**  
> - **Kết cấu bê tông (Server Components)**: Tường, sàn, cột → Cứng, không đổi, xây sẵn trên server  
> - **Đồ nội thất (Client Components)**: Cửa, công tắc đèn, tủ lạnh → Có thể tương tác, cần JavaScript  
> - **Next.js = Tòa nhà hoàn chỉnh** (có cả kết cấu và nội thất)

##### Ví dụ thực tế: Trang Blog Post

Một trang blog điển hình sẽ có:
- **Nội dung bài viết** (Server Component) - Không cần JS, SEO tốt
- **Nút Like** (Client Component) - Cần `useState` và `onClick`
- **Form Comment** (Client Component) - Cần `useState` cho input

**Code minh họa:**

```jsx
// src/app/blog/[id]/page.js
// ĐÂY LÀ SERVER COMPONENT (mặc định)

import CommentForm from '@/components/CommentForm';  // Client Component
import LikeButton from '@/components/LikeButton';    // Client Component

// Fetch data trên server (SEO tốt, nhanh)
async function getPost(id) {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.id);  // Server-side fetch

  return (
    <article>
      {/* ===== PHẦN SERVER COMPONENT ===== */}
      {/* Không cần JS, SEO tốt, load nhanh */}
      <h1>{post.title}</h1>
      <p className="author">By {post.author}</p>
      <p className="date">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* ===== PHẦN CLIENT COMPONENT ===== */}
      {/* Cần tương tác, dùng useState */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
      
      <hr />
      
      {/* Form cần useState và onChange */}
      <CommentForm postId={post.id} />
    </article>
  );
}
```

```jsx
// src/components/LikeButton.js
'use client';  // Client Component

import { useState } from 'react';

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    // Gọi API để lưu like
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  };

  return (
    <button 
      onClick={handleLike}
      style={{ 
        fontSize: '20px', 
        border: 'none', 
        background: 'transparent',
        cursor: 'pointer'
      }}
    >
      {isLiked ? '❤️' : '🤍'} {likes} likes
    </button>
  );
}
```

```jsx
// src/components/CommentForm.js
'use client';

import { useState } from 'react';

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
    
    setComment('');
    setIsSubmitting(false);
    alert('Comment đã được gửi!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Để lại bình luận</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Nhập bình luận của bạn..."
        rows={4}
        style={{ width: '100%', padding: '10px' }}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
      </button>
    </form>
  );
}
```

##### Phân tích: Tại sao kết hợp?

| Phần | Loại Component | Lý do |
|---|---|---|
| **Title, Author, Content** | Server Component | ✅ Không cần JS, SEO tốt, load nhanh |
| **Like Button** | Client Component | ✅ Cần `useState` và `onClick` |
| **Comment Form** | Client Component | ✅ Cần `useState` cho input và submit |

##### Lợi ích của việc kết hợp

**1. Performance tối ưu**
- Server Components → Không tăng bundle size JavaScript (nội dung tĩnh không cần JS)
- Client Components → Chỉ tải JS cho phần cần tương tác (buttons, forms)

**2. SEO tốt**
- Nội dung chính (text, images) render trên server → Google đọc được ngay
- Phần tương tác (buttons) không ảnh hưởng SEO

**3. Developer Experience tốt**
- Fetch data trực tiếp trong Server Component (không cần `useEffect`)
- Dùng hooks thoải mái trong Client Component khi cần

**4. Security tốt hơn**
- API keys, database queries chỉ chạy trên server (Server Components)
- Không bao giờ lộ ra browser

##### Quy tắc Composition (Kết hợp)

**✅ QUY TẮC 1: Server Component có thể import Client Component**

```jsx
// ✅ ĐÚNG: Server Component import Client Component
// src/app/page.js (Server Component)

import ClientButton from '@/components/ClientButton';  // ✅ OK

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>  {/* Server-rendered */}
      <ClientButton />   {/* Client-rendered */}
    </div>
  );
}
```

---

**❌ QUY TẮC 2: Client Component KHÔNG THỂ import Server Component**

```jsx
// ❌ SAI: Client Component import Server Component
// src/components/ClientWrapper.js
'use client';

import ServerData from './ServerData';  // ❌ LỖI!

export default function ClientWrapper() {
  return <ServerData />;  // ❌ Không hoạt động
}
```

**Lý do:** Client Component chạy trên browser, không thể chạy code server (database queries, file system).

---

**✅ GIẢI PHÁP: Dùng `children` prop (Composition Pattern)**

Thay vì import trực tiếp, hãy **truyền Server Component qua `children`**:

```jsx
// ✅ ĐÚNG: Server Component pass vào Client Component qua children
// src/app/page.js (Server Component)

import ClientWrapper from '@/components/ClientWrapper';  // Client
import ServerData from '@/components/ServerData';        // Server

export default function Page() {
  return (
    <ClientWrapper>
      {/* ✅ Pass Server Component qua children */}
      <ServerData />
    </ClientWrapper>
  );
}
```

```jsx
// src/components/ClientWrapper.js
'use client';

import { useState } from 'react';

export default function ClientWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Ẩn' : 'Hiện'}
      </button>
      
      {/* ✅ Render Server Component được pass vào */}
      {isOpen && children}
    </div>
  );
}
```

```jsx
// src/components/ServerData.js
// Server Component (mặc định)

async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function ServerData() {
  const data = await getData();
  
  return (
    <div>
      <h2>Server Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

**Giải thích:**
- `ClientWrapper` không import `ServerData` trực tiếp.
- `ServerData` được render ở Server, kết quả (HTML) được pass vào `ClientWrapper` qua `children`.
- `ClientWrapper` chỉ cần toggle hiển thị HTML đó (không cần biết nó từ đâu).

##### Bảng tóm tắt: Quy tắc Composition

| Tình huống | Có được phép? | Cách làm |
|---|---|---|
| Server → Client | ✅ Có | Import trực tiếp |
| Client → Server | ❌ Không | Dùng `children` prop |
| Server → Server | ✅ Có | Import trực tiếp |
| Client → Client | ✅ Có | Import trực tiếp |

##### Khi nào dùng Server, khi nào dùng Client?

**Dùng Server Component khi:**
- ✅ Fetch data từ database/API
- ✅ Cần SEO (blog posts, product pages)
- ✅ Hiển thị nội dung tĩnh (text, images)
- ✅ Dùng API keys/secrets (bảo mật)

**Dùng Client Component khi:**
- ✅ Cần `useState`, `useEffect`, `useContext`
- ✅ Cần event handlers (`onClick`, `onChange`, `onSubmit`)
- ✅ Cần browser APIs (`window`, `localStorage`, `navigator`)
- ✅ Cần thư viện chỉ chạy trên browser (charts, animations)

**Quy tắc vàng:** **Mặc định dùng Server Component**. Chỉ chuyển sang Client Component khi thực sự cần tương tác.

##### Tóm tắt

> **Next.js = React + Server Components + Client Components + Routing + API Routes + Deployment**

Next.js cho phép bạn:
1. Viết **Server Components** để tối ưu performance và SEO
2. Viết **Client Components** khi cần tương tác
3. **Kết hợp cả hai** một cách linh hoạt trong cùng một app

**Đây chính là "Best of Both Worlds" - sức mạnh thực sự của Next.js!** 🚀

---

### 4. Routing: File-based Routing

Next.js dùng **cấu trúc thư mục** để tạo routes tự động.

#### 4.1. Static Routes

| File Path | URL | Ví dụ |
|---|---|---|
| `app/page.js` | `/` | Trang chủ |
| `app/about/page.js` | `/about` | Trang giới thiệu |
| `app/blog/page.js` | `/blog` | Danh sách blog |
| `app/contact/page.js` | `/contact` | Liên hệ |

#### 4.2. Dynamic Routes

Dùng `[tên_biến]` để tạo route động.

**Ví dụ: Blog post detail**

```
app/
└── blog/
    └── [id]/
        └── page.js  → URL: /blog/123, /blog/456, ...
```

**Code:**

```jsx
// src/app/blog/[id]/page.js

async function getPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export default async function BlogPost({ params }) {
  // params.id = "123" (lấy từ URL)
  const post = await getPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

**Truy cập:** `http://localhost:3000/blog/5` → `params.id = "5"`

---

#### 4.3. Navigation: Link Component

```jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Trang chủ</Link>
      <Link href="/about">Giới thiệu</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}
```

**Lưu ý:** Dùng `Link` thay vì `<a>` để có client-side navigation (không reload trang).

---

### 5. Data Fetching: 4 Chiến lược

React và Next.js hỗ trợ 4 cách render và fetch data, mỗi cách phù hợp với một use case riêng biệt.

> **Mental Model:** Hãy nghĩ về **nơi** (WHERE) và **khi nào** (WHEN) dữ liệu được fetch:
> - **CSR**: Fetch ở **Browser**, **sau khi** trang đã load
> - **SSR**: Fetch ở **Server**, **mỗi** request
> - **SSG**: Fetch ở **Server**, **lúc** build time (1 lần)
> - **ISR**: Fetch ở **Server**, **lúc** build + **tự động** regenerate theo thời gian
>
> **Lưu ý:** "Fetch" = Gửi yêu cầu (request) + Nhận phản hồi (response) với dữ liệu.

---

#### Browser ↔ Server "Packet-Level Mental Model"

Để hiểu sâu hơn về CSR, SSR, SSG, hãy xem xét **cách trình duyệt và server trao đổi dữ liệu** ở mức độ kỹ thuật.

##### 0) Baseline: Điều gì luôn xảy ra?

Bất kể phương pháp nào, khi truy cập một trang web luôn có các bước sau:

1. **Browser gửi request** `GET /some-page`
2. **Server phản hồi** với *một thứ gì đó* (HTML + có thể có links đến JS/CSS)
3. **Browser phân tích HTML**, tải CSS/JS/images
4. **JS chạy** (nếu có), trang trở nên interactive

**Sự khác biệt lớn:** **Khi nào và ở đâu nội dung HTML được tạo ra?**

---

##### 1) CSR — Client Side Rendering

**Ý tưởng:** Server gửi HTML *rỗng*. Browser tải JS, sau đó JS xây dựng nội dung trang.

**Điều gì đã có trong browser ban đầu?**
* Gần như không có gì ngoài một container rỗng như `<div id="root"></div>` (và có thể có "loading…")

**Server gửi gì?**
* HTML tối thiểu + links đến JS/CSS bundles

**Browser làm gì?**
* Tải JS
* Chạy React (hoặc framework tương tự)
* Gọi APIs để fetch data
* Xây dựng DOM (HTML) trong browser

**Timeline (đơn giản hóa):**

```
1. Browser → Server: GET /products
2. Server → Browser: index.html (gần như rỗng) + JS bundle link
3. Browser → Server/CDN: download JS bundle
4. Browser chạy JS → Browser → API: GET /api/products
5. API → Browser: JSON data
6. Browser render danh sách sản phẩm
```

**Ưu / Nhược điểm:**
* ✅ Tuyệt vời cho tính tương tác giống app
* ❌ Chậm hơn để hiển thị "nội dung có ý nghĩa đầu tiên" trên thiết bị/mạng chậm
* ❌ SEO khó khăn hơn (Google đã tốt hơn, nhưng vẫn không sạch bằng SSR/SSG)

---

##### 2) SSR — Server Side Rendering

**Ý tưởng:** Với mỗi request, server tạo HTML **ngay lập tức**, sau đó gửi HTML đầy đủ cho browser.

**Điều gì đã có trong browser ban đầu?**
* HTML nội dung thực tế đã có sẵn khi response đến (text, lists, v.v.)

**Server làm gì?**
* Chạy code trang trên server
* Fetch data (DB/API)
* Render HTML string
* Gửi HTML + JS/CSS links

**Browser làm gì?**
* Hiển thị nội dung ngay sau khi nhận HTML
* Tải JS bundle
* "Hydrate" (gắn JS vào HTML đã có sẵn để các nút hoạt động)

> **Hydration** = JS "kết nối" HTML đã được render sẵn. (hydrat hóa / gắn JS vào HTML)

**Timeline:**

```
1. Browser → Server: GET /products
2. Server: fetch products → render HTML
3. Server → Browser: HTML đầy đủ với danh sách sản phẩm + JS bundle link
4. Browser: vẽ nội dung nhanh chóng
5. Browser tải JS
6. Browser hydrate → bây giờ interactive
```

**Ưu / Nhược điểm:**
* ✅ Nội dung đầu tiên nhanh, SEO tốt
* ✅ Luôn mới (nếu bạn muốn)
* ❌ Chi phí server mỗi request (CPU + fetch data)
* ❌ Chậm hơn "time to interactive" nếu JS lớn (vẫn cần hydration)

---

##### 3) SSG — Static Site Generation

**Ý tưởng:** HTML được tạo **trước** (build time). Khi có request, server chỉ serve files.

**Điều gì đã có trong browser ban đầu?**
* HTML nội dung đầy đủ ngay lập tức (trải nghiệm giống SSR)

**Server làm gì (khi có request)?**
* Gần như không làm gì: chỉ trả về file `.html` đã build sẵn (thường từ CDN)

**Server làm gì (lúc build time)?**
* Chạy render trang một lần
* Tạo ra `/products.html`
* Upload lên hosting/CDN

**Timeline (khi có request):**

```
1. Browser → CDN/server: GET /products
2. CDN/server → Browser: HTML đã build sẵn + JS link
3. Browser vẽ nội dung nhanh
4. Browser tải JS
5. Browser hydrate (tùy chọn)
```

**Ưu / Nhược điểm:**
* ✅ Nhanh + rẻ ở quy mô lớn (CDN)
* ✅ SEO tuyệt vời
* ❌ Nội dung có thể cũ cho đến khi rebuild/deploy lần sau
* ❌ Khó cho trang "user-specific" (trừ khi bạn kết hợp với CSR)

---

##### Bảng tóm tắt "Tôi nhận được gì?"

| Mode    | HTML đầu tiên có nội dung thực? | Nội dung HTML được tạo ở đâu? | Browser có fetch data để hiển thị trang ban đầu? | Công việc server mỗi lần truy cập |
| ------- | ------------------------------- | ----------------------------- | ------------------------------------------------- | --------------------------------- |
| **CSR** | Thường **Không** (shell rỗng)  | Browser (JS)                  | **Có** (API fetch)                                | Thấp                              |
| **SSR** | **Có**                          | Server (mỗi request)          | Không (cho hiển thị ban đầu)                      | Cao/trung bình                    |
| **SSG** | **Có**                          | Server (lúc build time)       | Không (cho hiển thị ban đầu)                      | Rất thấp                          |

---

##### Thực tế: Hầu hết các trang web hiện đại là **hybrid** (kết hợp)

**Ví dụ hybrid phổ biến:**

* Dùng **SSG/SSR** cho shell trang ban đầu + nội dung SEO
* Dùng **CSR** cho các phần thay đổi thường xuyên (giá, tồn kho, "sản phẩm đề xuất", comments)

**Tại sao không dùng SSR cho Price, Stock, Recommendations, Comments?**

Đây là câu hỏi rất hay! Nếu **SSR (Server-Side Rendering)** có thể fetch data trên server và gửi trang hoàn chỉnh, tại sao lại phải đợi **CSR (Client-Side Rendering)** fetch những thứ như giá hoặc tồn kho sau?

**Lý do:** Đây là sự đánh đổi (trade-off) giữa **Tốc độ cảm nhận (Perceived Speed)**, **Tải server (Server Load)**, và **Khả năng cache (Caching)**.

---

###### 1. Vấn đề "TTFB" (Time to First Byte)

Khi bạn dùng SSR, server phải hoàn thành **TẤT CẢ** việc fetch data trước khi gửi một byte HTML nào đến browser.

**Nếu bạn SSR mọi thứ:**
- Nếu API "Sản phẩm đề xuất" chậm hoặc dịch vụ "Comments" của bên thứ ba mất 2 giây để phản hồi, user sẽ nhìn vào màn hình trắng trong 2 giây.

**Cách tiếp cận Hybrid:**
- Bạn SSR layout và text ngay lập tức. User thấy trang trong 0.2 giây.
- Sau đó, giá và comments "xuất hiện" qua CSR.
- User **CẢM THẤY** trang web nhanh hơn vì họ có thể bắt đầu đọc ngay lập tức.

**Ví dụ trực quan:**

```
❌ SSR mọi thứ:
User click → Đợi 2s (màn hình trắng) → Thấy trang hoàn chỉnh

✅ Hybrid (SSR + CSR):
User click → 0.2s thấy layout + text → Đọc nội dung → 1.8s sau giá/stock xuất hiện
```

**Mental Model:**
- **SSR mọi thứ** = Đợi cả bữa ăn nấu xong mới được vào nhà hàng
- **Hybrid** = Vào nhà hàng ngay, ngồi xuống, xem menu (SSR), sau đó món ăn được mang ra (CSR)

---

###### 2. Global Caching (Yếu tố CDN)

Kiến trúc web hiện đại phụ thuộc nhiều vào **CDN (Content Delivery Networks)** như Cloudflare hoặc Vercel.

**Nội dung tĩnh (Static Content):**
- Bạn có thể cache HTML của trang sản phẩm (Tên, Mô tả, Hình ảnh) trên các server khắp thế giới.
- Điều này làm trang load **ngay lập tức** bất kể user ở đâu.

**Nội dung động (Dynamic Content):**
- Giá, mức tồn kho, và đề xuất cá nhân hóa thay đổi **quá nhanh** để cache toàn cầu.

**Giải pháp:**
- Bạn serve "Static Shell" từ cache (nhanh)
- Dùng CSR để fetch "Volatile Data" từ database (mới)

**Ví dụ cụ thể:**

```
Trang sản phẩm iPhone:
┌─────────────────────────────────────┐
│ [Tên: iPhone 15 Pro]      ← SSG/SSR │ Cache trên CDN toàn cầu
│ [Mô tả: Chip A17...]      ← SSG/SSR │ (Không đổi)
│ [Hình ảnh]                ← SSG/SSR │
├─────────────────────────────────────┤
│ [Giá: $999]               ← CSR     │ Fetch real-time từ DB
│ [Tồn kho: 5 sản phẩm]    ← CSR     │ (Thay đổi liên tục)
│ [Đề xuất cho bạn]        ← CSR     │ (Cá nhân hóa)
└─────────────────────────────────────┘
```

**Kết quả:**
- User ở Việt Nam: Nhận HTML từ CDN Singapore (10ms)
- User ở Mỹ: Nhận HTML từ CDN California (10ms)
- Cả hai đều fetch giá/stock từ database chính (100ms) - nhưng đã thấy trang rồi!

---

###### 3. Chi phí Server & Khả năng mở rộng (Scalability)

SSR "đắt đỏ" cho server của bạn. Mỗi khi user truy cập trang, server phải chạy code, nói chuyện với database, và tạo chuỗi HTML.

**Vấn đề với SSR mọi thứ:**
- Nếu bạn có 100,000 users truy cập trang SSR cùng lúc, server có thể **crash**.
- Mỗi request phải: Query DB cho giá → Query DB cho stock → Query DB cho recommendations → Render HTML
- Chi phí: CPU + RAM + Database connections

**Với CSR cho phần động:**
- "Công việc nặng" của việc render UI được chuyển sang **máy tính/điện thoại của user**.
- Server chỉ cần gửi dữ liệu JSON thô, **nhẹ hơn nhiều** so với gửi HTML đầy đủ.

**So sánh tải server:**

```
SSR mọi thứ (100,000 requests):
Server: Render 100,000 HTML pages + Fetch 400,000 DB queries
→ Server CPU: 90% | RAM: 85% | DB: Overload ❌

Hybrid (SSG + CSR):
Server: Serve 100,000 cached HTML (nhẹ) + 200,000 API calls (JSON)
→ Server CPU: 30% | RAM: 40% | DB: Normal ✅
```

**Mental Model:**
- **SSR mọi thứ** = Nhà hàng tự nấu + tự giao hàng đến tận nhà (đắt, chậm)
- **Hybrid** = Nhà hàng gửi công thức (HTML) + nguyên liệu (JSON), bạn tự pha chế (CSR)

---

###### 4. Trải nghiệm người dùng (UX) và Tính tương tác

Một số thứ đơn giản **CẢM THẤY TỐT HƠN** khi xử lý ở phía client:

**Comments:**
- Nếu user click "Tải thêm Comments", bạn **không muốn** re-render toàn bộ trang qua SSR.
- Bạn chỉ muốn fetch 10 items nữa và chèn vào.

**Stock Updates:**
- Tưởng tượng "Flash Sale". Nếu stock thay đổi mỗi giây, CSR có thể cập nhật **chỉ số "Stock"** trên màn hình mà không cần user refresh trang.

**Ví dụ: Real-time Stock Updates**

```jsx
// CSR: Cập nhật stock mỗi 5 giây
'use client';

export default function LiveStock({ productId }) {
  const [stock, setStock] = useState(null);
  
  useEffect(() => {
    // Fetch lần đầu
    fetchStock();
    
    // Cập nhật mỗi 5 giây
    const interval = setInterval(fetchStock, 5000);
    return () => clearInterval(interval);
  }, []);
  
  async function fetchStock() {
    const res = await fetch(`/api/stock/${productId}`);
    const data = await res.json();
    setStock(data.quantity);
  }
  
  return (
    <div>
      Còn lại: <strong>{stock ?? '...'}</strong> sản phẩm
      {stock < 5 && <span style={{color: 'red'}}>⚡ Sắp hết!</span>}
    </div>
  );
}
```

**Với SSR:** User phải F5 trang mỗi 5 giây để thấy stock mới → Trải nghiệm tệ!

**Với CSR:** Số stock tự động cập nhật mà không cần refresh → Trải nghiệm mượt mà!

---

###### Bảng so sánh tổng hợp

| Tiêu chí | SSR (Server-Side) | CSR (Client-Side) |
| --- | --- | --- |
| **Initial Load** | Chậm hơn (Đợi tất cả data) | Nhanh hơn (Static shell trước) |
| **SEO** | Xuất sắc | Trung bình/Tốt |
| **Data Freshness** | Fresh tại thời điểm request | Real-time / Có thể cập nhật |
| **Server Load** | Cao (Server làm việc) | Thấp (Client làm việc) |
| **Caching** | Khó (data động) | Dễ (cache shell, fetch data) |
| **Scalability** | Khó mở rộng | Dễ mở rộng |
| **UX cho data thay đổi nhanh** | Phải refresh trang | Cập nhật tự động |

---

###### Ngoại lệ hiện đại

> **Công nghệ mới:** **React Server Components (RSC)** và **Streaming SSR** đang cố gắng thu hẹp khoảng cách này bằng cách "streaming" HTML khi nó sẵn sàng, nhưng với hầu hết các ứng dụng, mô hình Hybrid (SSR + CSR) vẫn là tiêu chuẩn vàng cho hiệu suất.

**Streaming SSR hoạt động như thế nào:**

```
Thay vì:
Server: Đợi tất cả data → Gửi HTML hoàn chỉnh

Streaming SSR:
Server: Gửi layout ngay lập tức
     → Gửi product info khi sẵn sàng
     → Gửi recommendations khi sẵn sàng
     → Gửi comments khi sẵn sàng
```

**Kết quả:** User thấy trang "dần dần xuất hiện" thay vì đợi màn hình trắng.

---

###### Kết luận: Khi nào dùng CSR thay vì SSR?

**Dùng CSR cho:**
- ✅ Dữ liệu thay đổi **rất nhanh** (giá, stock, live chat)
- ✅ Dữ liệu **cá nhân hóa** (recommendations, user-specific content)
- ✅ Tính năng **tương tác** (load more, infinite scroll, real-time updates)
- ✅ Khi bạn muốn **cache static shell** trên CDN

**Dùng SSR cho:**
- ✅ Nội dung **quan trọng cho SEO** (tiêu đề, mô tả, text chính)
- ✅ Dữ liệu **không đổi thường xuyên** nhưng cần fresh mỗi request
- ✅ Khi **initial content** quan trọng hơn **time to interactive**

**Quy tắc vàng:** Kết hợp cả hai! SSR/SSG cho "khung xương" (SEO + fast first paint), CSR cho "nội tạng" (dynamic data + interactivity).

---



* "SSG cho layout và mô tả sản phẩm cơ bản"
* cộng với "CSR cho trạng thái tồn kho trực tiếp"

**Ví dụ cụ thể:**

```jsx
// src/app/product/[id]/page.js

// SSG: Thông tin sản phẩm cơ bản (build time)
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id); // Fetch lúc build
  
  return (
    <div>
      {/* SSG: Nội dung tĩnh, SEO-friendly */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* CSR: Dữ liệu động, real-time */}
      <StockStatus productId={params.id} />  {/* Client Component */}
      <UserReviews productId={params.id} />  {/* Client Component */}
    </div>
  );
}
```

```jsx
// src/components/StockStatus.js
'use client';

import { useState, useEffect } from 'react';

export default function StockStatus({ productId }) {
  const [stock, setStock] = useState(null);
  
  useEffect(() => {
    // CSR: Fetch stock real-time
    fetch(`/api/stock/${productId}`)
      .then(res => res.json())
      .then(data => setStock(data.quantity));
  }, [productId]);
  
  return <p>Còn lại: {stock ?? 'Loading...'} sản phẩm</p>;
}
```

**Kết quả:**
1. Browser nhận HTML với tên + mô tả sản phẩm ngay lập tức (SSG → SEO tốt)
2. JS load và fetch stock real-time (CSR → dữ liệu mới nhất)

---

##### So sánh với WordPress (để dễ hình dung)

**WordPress truyền thống:**

* Thường **giống SSR** (PHP render HTML mỗi request)
* Với caching plugins/CDN, nó hoạt động **giống SSG** cho khách ẩn danh
* Với các tính năng JS, nó trở thành **hybrid SSR + CSR**

**Mental Model:**
* WordPress cũ = SSR (mỗi request chạy PHP)
* WordPress + WP Super Cache = SSG (serve HTML tĩnh)
* WordPress + AJAX comments = Hybrid (SSR/SSG + CSR)

---


#### 5.1. CSR - Client-Side Rendering (Browser-based)

**Khi nào dùng:** 
- Dữ liệu cá nhân hóa (user-specific data)
- Dữ liệu không cần SEO (dashboard, admin panel)
- Progressive enhancement (load trang trước, data sau)

**Cơ chế:** Server gửi HTML rỗng/skeleton → JavaScript load → Browser fetch data → Render.

**Đặc điểm:**
- ✅ **Tốt cho:** Interactive dashboards, user-specific data
- ❌ **Không tốt cho:** SEO, initial page load speed

```jsx
// src/app/dashboard/page.js (Client Component)
'use client';  // Đánh dấu đây là Client Component

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data ở browser (sau khi component mount)
    async function fetchUserData() {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setUserData(data);
      setLoading(false);
    }
    
    fetchUserData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {userData.name}!</h1>
      <p>Your balance: ${userData.balance}</p>
    </div>
  );
}
```

**Timeline:**
1. Browser nhận HTML (rỗng/skeleton)
2. JavaScript load và execute
3. `useEffect` chạy → fetch data
4. Re-render với data

---

#### 5.2. SSR - Server-Side Rendering (Dynamic)

**Khi nào dùng:** 
- Dữ liệu thay đổi liên tục cho mọi user (giá cổ phiếu, tin tức mới nhất)
- Cần SEO + fresh data mọi lúc
- Personalized content cần SEO

**Cơ chế:** Mỗi request → Server fetch data mới → Render HTML → Gửi về browser.

**Giải thích chi tiết:**

SSR (Server-Side Rendering) hoạt động như một **nhà hàng có đầu bếp** - mỗi khi khách đặt món, đầu bếp nấu món ăn mới toanh, sau đó mang ra phục vụ.

##### Bước 1: User gửi request

```
User nhấn vào link hoặc gõ URL → Browser gửi request đến server
Ví dụ: GET https://myapp.com/stocks
```

**Điều gì xảy ra:**
- Browser gửi HTTP request đến Next.js server
- Server nhận request và bắt đầu xử lý

##### Bước 2: Server fetch data MỚI

```
Server → API/Database: "Cho tôi dữ liệu mới nhất!"
API/Database → Server: Trả về JSON data
```

**Điều gì xảy ra:**
- Server chạy code trong component của bạn (ví dụ: `getStocks()`)
- Server gọi API hoặc query database để lấy dữ liệu **real-time**
- **Quan trọng:** Việc này xảy ra **MỖI LẦN** có request, không dùng cache

**Ví dụ cụ thể:**

```javascript
// Code này chạy TRÊN SERVER, không phải browser
async function getStocks() {
  // Server fetch data từ API bên ngoài
  const res = await fetch('https://api.example.com/stocks', {
    cache: 'no-store'  // ← Không cache = luôn fetch mới
  });
  return res.json();
}
```

**Mental Model - So sánh với CSR:**

| Bước | CSR (Client-Side) | SSR (Server-Side) |
|------|-------------------|-------------------|
| **Ai fetch data?** | Browser (JavaScript) | Server (Node.js) |
| **Khi nào fetch?** | Sau khi trang load xong | Trước khi gửi HTML |
| **User thấy gì lúc fetch?** | "Loading..." spinner | Không thấy gì (đang đợi server) |

##### Bước 3: Server RENDER HTML với data

```
Server: Lấy data → Chạy React component → Tạo HTML string
```

**Điều gì xảy ra:**
- Server chạy React component của bạn **trên server** (không phải browser!)
- React "vẽ" component thành chuỗi HTML
- HTML này **ĐÃ CHỨA DỮ LIỆU** (không phải `<div id="root"></div>` rỗng như CSR)

**Ví dụ:**

```javascript
// Component này chạy trên SERVER
export default async function StocksPage() {
  const stocks = await getStocks();  // ← Data đã có sẵn
  
  // React render thành HTML STRING trên server
  return (
    <div>
      <h1>Giá cổ phiếu</h1>
      {stocks.map(stock => (
        <div key={stock.id}>
          {stock.name}: ${stock.price}  {/* ← Data đã có trong HTML */}
        </div>
      ))}
    </div>
  );
}
```

**Kết quả (HTML string mà server tạo ra):**

```html
<div>
  <h1>Giá cổ phiếu</h1>
  <div>Apple: $150.25</div>
  <div>Google: $2800.50</div>
  <div>Tesla: $220.75</div>
</div>
```

##### Bước 4: Server GỬI HTML hoàn chỉnh về browser

```
Server → Browser: Gửi HTML (đã có data) + links đến JS/CSS
```

**Điều gì xảy ra:**
- Server gửi HTML **đầy đủ nội dung** về browser
- Browser nhận được và **hiển thị ngay lập tức** (không cần chờ JS load)
- User thấy nội dung ngay (fast first paint)

**Response từ server:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Stocks</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <!-- ↓ HTML ĐÃ CÓ DATA, không phải rỗng -->
  <div>
    <h1>Giá cổ phiếu</h1>
    <div>Apple: $150.25</div>
    <div>Google: $2800.50</div>
    <div>Tesla: $220.75</div>
  </div>
  
  <!-- JS để hydrate (làm trang interactive) -->
  <script src="/app.js"></script>
</body>
</html>
```

##### Bước 5 (Optional): Browser tải JS và Hydrate

```
Browser tải JS → "Hydrate" HTML → Trang trở nên interactive
```

**Hydration là gì?**
- HTML đã có sẵn nhưng chưa có "sự sống" (không click được button, không có event handlers)
- JS tải về và "gắn" event handlers vào HTML đã có
- Giống như "thổi hồn" vào HTML tĩnh

**Ví dụ:**

```jsx
// Trước hydration: Button hiển thị nhưng click không làm gì
<button>Mua cổ phiếu</button>

// Sau hydration: Button có thể click được
<button onClick={handleBuy}>Mua cổ phiếu</button>
```

---

##### Tóm tắt: SSR vs CSR (So sánh trực quan)

**CSR (Client-Side Rendering):**

```
1. Browser → Server: "Cho tôi trang /stocks"
2. Server → Browser: HTML rỗng + JS bundle
3. Browser tải JS (đợi...)
4. Browser chạy JS
5. Browser → API: "Cho tôi data stocks"
6. API → Browser: JSON data
7. Browser render HTML với data
   ↓
   User phải ĐỢI từ bước 1 → 7 mới thấy nội dung
```

**SSR (Server-Side Rendering):**

```
1. Browser → Server: "Cho tôi trang /stocks"
2. Server → API: "Cho tôi data stocks"
3. API → Server: JSON data
4. Server render HTML với data
5. Server → Browser: HTML hoàn chỉnh (có data)
   ↓
   User thấy nội dung NGAY tại bước 5
6. (Optional) Browser tải JS để hydrate
```

**Sự khác biệt lớn:**
- **CSR**: User thấy trang trắng → Loading spinner → Nội dung
- **SSR**: User thấy nội dung ngay lập tức (nhưng chưa interactive) → Interactive sau khi JS load

---

##### Ví dụ thực tế: Trang tin tức

**Tình huống:** Bạn xây dựng trang tin tức, cần hiển thị 10 bài viết mới nhất.

**Với SSR:**

```jsx
// src/app/news/page.js
async function getLatestNews() {
  const res = await fetch('https://api.news.com/latest', {
    cache: 'no-store'  // Luôn lấy tin mới nhất
  });
  return res.json();
}

export default async function NewsPage() {
  const news = await getLatestNews();  // Fetch trên server
  
  return (
    <div>
      <h1>Tin tức mới nhất</h1>
      {news.map(article => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

**Điều gì xảy ra khi user truy cập:**

1. **9:00 AM** - User A truy cập → Server fetch tin tức lúc 9:00 AM → Gửi HTML
2. **9:05 AM** - User B truy cập → Server fetch tin tức lúc 9:05 AM (có thể có tin mới) → Gửi HTML
3. **9:10 AM** - User C truy cập → Server fetch tin tức lúc 9:10 AM (có thể có tin mới) → Gửi HTML

**Kết quả:** Mỗi user đều thấy tin tức **MỚI NHẤT** tại thời điểm họ truy cập.

---

##### Tại sao gọi là "Server-Side" Rendering?

**"Server-Side"** = Việc render (tạo HTML) xảy ra **ở phía server**, không phải browser.

**So sánh:**

| Khía cạnh | Client-Side (CSR) | Server-Side (SSR) |
|-----------|-------------------|-------------------|
| **Nơi chạy React** | Browser | Server (Node.js) |
| **Nơi fetch data** | Browser | Server |
| **Nơi tạo HTML** | Browser | Server |
| **Browser nhận gì?** | HTML rỗng + JS | HTML đầy đủ + JS |
| **Khi nào user thấy nội dung?** | Sau khi JS chạy xong | Ngay khi nhận HTML |

---

##### Lưu ý quan trọng

**1. SSR ≠ Static (tĩnh)**
- SSR render **mỗi lần có request** → Luôn fresh
- SSG render **1 lần lúc build** → Có thể cũ

**2. SSR tốn server resources**
- Mỗi request phải: fetch data + render HTML
- Nếu có 1000 requests/giây → Server phải làm việc 1000 lần/giây
- Chi phí cao hơn SSG (chỉ serve file tĩnh)

**3. SSR tốt cho SEO**
- Google bot nhận HTML đầy đủ ngay lập tức
- Không cần chờ JS chạy để thấy nội dung
- Tốt hơn CSR cho SEO


- ✅ **Tốt cho:** SEO, fresh data mọi request
- ❌ **Không tốt cho:** Performance (chậm hơn SSG/ISR), server load cao

```jsx
// src/app/stocks/page.js (Server Component - mặc định)

async function getStocks() {
  const res = await fetch('https://api.example.com/stocks', {
    cache: 'no-store'  // Không cache, luôn fetch mới mỗi request
  });
  return res.json();
}

export default async function StocksPage() {
  const stocks = await getStocks();  // Fetch trên server mỗi request
  
  return (
    <div>
      <h1>Giá cổ phiếu (Real-time)</h1>
      {stocks.map(stock => (
        <div key={stock.id}>
          {stock.name}: ${stock.price}
        </div>
      ))}
    </div>
  );
}
```

**Timeline:**
1. User request `/stocks`
2. Server fetch data mới từ API
3. Server render HTML với data
4. Browser nhận HTML hoàn chỉnh (có data)

---

#### 5.3. SSG - Static Site Generation (Static)

**Khi nào dùng:** 
- Dữ liệu ít/không thay đổi (blog posts, documentation, landing pages)
- Ưu tiên performance tối đa
- Traffic cao (static files dễ cache và serve qua CDN)

**Cơ chế:** Build time → Fetch data 1 lần → Tạo HTML tĩnh → Serve HTML cho mọi request.

**Đặc điểm:**
- ✅ **Tốt cho:** Performance cực nhanh, SEO, low server load
- ❌ **Không tốt cho:** Dữ liệu thay đổi thường xuyên (cần rebuild để update)

```jsx
// src/app/docs/page.js (Server Component)

async function getDocs() {
  const res = await fetch('https://api.example.com/docs', {
    cache: 'force-cache'  // Cache vĩnh viễn (SSG)
  });
  return res.json();
}

export default async function DocsPage() {
  const docs = await getDocs();  // Fetch 1 lần lúc build
  
  return (
    <div>
      <h1>Documentation</h1>
      {docs.map(doc => (
        <article key={doc.id}>
          <h2>{doc.title}</h2>
          <p>{doc.content}</p>
        </article>
      ))}
    </div>
  );
}
```

**Build command:**

```bash
npm run build  # Fetch data + Tạo HTML tĩnh
npm start      # Serve HTML tĩnh (không fetch lại data)
```

**Timeline:**
1. Build time: Fetch data → Tạo HTML tĩnh
2. Runtime: Mọi request serve HTML tĩnh (instant)

---

#### 5.4. ISR - Incremental Static Regeneration (SSG + Auto-Update)

**Khi nào dùng:** 
- Dữ liệu thay đổi định kỳ nhưng không cần realtime (product catalog, blog với analytics)
- Muốn kết hợp tốc độ của SSG + freshness của SSR
- Traffic cao nhưng cần data "relatively fresh"

**Cơ chế:** Build tạo HTML tĩnh (như SSG) → Sau X giây → Tự động regenerate HTML mới ở background.

> **Bản chất:** ISR = SSG + Revalidation Timer. Không phải chiến lược riêng biệt mà là **SSG có khả năng tự động update**.

**Đặc điểm:**
- ✅ **Tốt cho:** Best of both worlds (fast như SSG + fresh như SSR)
- ❌ **Không tốt cho:** Realtime data (có độ trễ revalidation period)

```jsx
// src/app/products/page.js (Server Component)

async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }  // Regenerate mỗi 1 giờ (3600 giây)
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Sản phẩm</h1>
      <p><small>Cập nhật mỗi 1 giờ</small></p>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**Timeline (Stale-While-Revalidate Pattern):**
1. **Build time:** Fetch data → Tạo HTML version 1
2. **0-59 phút:** Mọi user nhận HTML version 1 (cached, instant)
3. **Phút 60:** 
   - User A request → Vẫn nhận HTML version 1 (instant)
   - Background: Next.js tự động fetch data mới → Tạo HTML version 2
4. **Phút 61+:** User B request → Nhận HTML version 2

**So sánh ISR vs SSG:**

| Aspect | SSG | ISR |
|---|---|---|
| **Build** | Fetch 1 lần | Fetch 1 lần |
| **Runtime** | Serve static HTML | Serve static HTML **+** auto-regenerate |
| **Update data** | Phải rebuild manually | Tự động sau X giây |
| **Performance** | Instant | Instant (vì vẫn serve static) |

---

#### So sánh 4 chiến lược

| Chiến lược | Render ở đâu? | Khi nào fetch? | Performance | SEO | Fresh Data | Use Case |
|---|---|---|---|---|---|---|
| **CSR** | Browser | Sau khi JS load | Chậm (initial) | ❌ Kém | ✅ Có (mỗi load) | Dashboard, user-specific UI |
| **SSR** | Server | Mỗi request | Trung bình | ✅ Tốt | ✅ Luôn fresh | News, personalized + SEO |
| **SSG** | Server (build) | Build time (1 lần) | ⚡ Cực nhanh | ✅ Tốt | ❌ Static | Blog, docs, landing pages |
| **ISR** | Server (build + revalidate) | Build + định kỳ | ⚡ Cực nhanh | ✅ Tốt | ⚠️ "Fresh enough" | E-commerce, semi-static content |

---

#### Decision Tree: Chọn chiến lược nào?

```
Bạn cần SEO?
│
├─ KHÔNG → CSR (Client-side rendering với useEffect)
│
└─ CÓ → Dữ liệu thay đổi thế nào?
    │
    ├─ KHÔNG BAO GIỜ/RẤT ÍT → SSG (Static generation)
    │
    ├─ ĐỊNH KỲ (giờ/ngày) → ISR (SSG + revalidation)
    │
    └─ MỌI REQUEST (realtime) → SSR (Server-side rendering)
```

---

#### Kết hợp nhiều chiến lược trong 1 app

**Best Practice:** Sử dụng chiến lược phù hợp cho từng trang.

**Ví dụ 1: Multi-purpose App**

```
/                    → SSG (Landing page - static)
/blog                → SSG (Blog list - static)
/blog/[slug]         → ISR (Blog post - cập nhật khi edit)
/products            → ISR (Product catalog - cập nhật định kỳ)
/products/[id]       → ISR (Product detail - revalidate mỗi giờ)
/dashboard           → CSR (User dashboard - personalized data)
/stock-ticker        → SSR (Stock prices - realtime)
/api/user/profile    → API route (Backend cho CSR)
```

**Ví dụ 2: E-commerce Site (Monorepo - 2 Apps riêng biệt)**

> **Kịch bản:** Cùng 1 database, nhưng 2 Next.js apps riêng biệt:
> - `apps/public` → Static export (deploy lên hosting)
> - `apps/admin` → Local-only admin panel (chạy trên laptop)

**Cấu trúc project:**

```
my-ecommerce/
├── apps/
│   ├── public/          → Next.js Public Site (Static Export)
│   │   ├── app/
│   │   │   ├── page.js              → SSG (Homepage)
│   │   │   ├── products/page.js     → SSG (Product list)
│   │   │   └── products/[slug]/page.js → SSG (Product detail)
│   │   ├── next.config.js
│   │   │   output: 'export'  ← Static export
│   │   └── package.json
│   │
│   └── admin/           → Next.js Admin Site (Local Only)
│       ├── app/
│       │   ├── page.js              → CSR (Dashboard)
│       │   ├── products/page.js     → SSR (Product list - fresh data)
│       │   └── products/[id]/page.js → SSR (Product editor)
│       ├── next.config.js
│       │   (no export, runs as dev server)
│       └── package.json
│
└── packages/
    └── database/        → Shared database client (Prisma/Drizzle)
        ├── schema.prisma
        └── client.ts
```

**Routing Architecture:**

```
📦 apps/public (Static Site - Deploy lên Vercel/Netlify)
/                        → SSG (Homepage - static HTML)
/products                → SSG (Product list - build time data)
/products/giay-nike      → SSG (Product detail - static HTML cho mỗi product)
/cart                    → Client-only (localStorage/sessionStorage)
/checkout                → Client-only (không cần backend)

🔧 apps/admin (Local Dev Server - Chỉ chạy trên laptop)
http://localhost:3001/                  → CSR (Admin dashboard)
http://localhost:3001/products          → SSR (Product list - fresh từ DB)
http://localhost:3001/products/123/edit → SSR (Product editor)
http://localhost:3001/orders            → SSR (Order management)
```

**Giải thích luồng hoạt động:**

1. **Admin edit product (Local):**
   - Mở `http://localhost:3001/products/123/edit`
   - SSR fetch data từ database → Always fresh
   - Edit product → Save vào database
   
2. **Rebuild public site:**
   - Admin chạy: `cd apps/public && npm run build`
   - Next.js fetch tất cả products từ database
   - Generate static HTML cho mỗi product page
   - Deploy folder `out/` lên hosting (Vercel/Netlify/S3)

3. **Customer truy cập (Production):**
   - Truy cập `https://myshop.com/products/giay-nike`
   - CDN serve static HTML → Instant load ⚡
   - No server, no database query → Cực nhanh

**So sánh 2 apps:**

| Aspect | `apps/public` | `apps/admin` |
|---|---|---|
| **Kiến trúc** | Static Export (`output: 'export'`) | Dev server (`npm run dev`) |
| **Deploy** | ✅ Deploy lên CDN (Vercel/Netlify) | ❌ Chỉ chạy local |
| **Database** | ❌ No runtime DB connection | ✅ Direct DB connection |
| **Rendering** | SSG (build time only) | SSR/CSR (runtime) |
| **Performance** | ⚡ Instant (static files) | Trung bình (query DB mỗi request) |
| **Update data** | Rebuild + redeploy | Realtime (query DB) |
| **Cost** | 🟢 Miễn phí (static hosting) | 🟡 Không deploy (local only) |

**Ưu điểm kiến trúc này:**

✅ **Tách biệt hoàn toàn:** Public site không có backend code, an toàn tuyệt đối  
✅ **Free hosting:** Static site có thể host miễn phí (Vercel/Netlify/GitHub Pages)  
✅ **No server costs:** Không cần server chạy 24/7, không tốn tiền database hosting  
✅ **Admin đơn giản:** Không cần authentication phức tạp (chỉ chạy local)  
✅ **Performance tối đa:** Customer luôn nhận static HTML (không có API call)

**Trade-offs:**

⚠️ **Manual rebuild:** Mỗi lần update product cần rebuild + redeploy (không tự động như ISR)  
⚠️ **Build time:** Nếu có 10,000 products → Build lâu (có thể dùng Incremental Static Regeneration nếu cần)  
⚠️ **Real-time data:** Không phù hợp nếu cần realtime inventory/pricing (stock real-time, flash sale)

---

### 6. Layout và Metadata: Cấu trúc lồng ghép (Nested Structure)

> **Mental Model:** Layout giống như **Hộp Matryoshka (Russian Nesting Dolls)**. Mỗi trang được bao bọc bởi nhiều lớp layout từ ngoài vào trong: Root Layout → Nested Layout → Page.

---

#### 6.0. Hiểu về cấu trúc thư mục và quan hệ cha-con

**Nguyên tắc vàng trong Next.js App Router:**

Mỗi folder có thể chứa 2 file đặc biệt:
- `layout.js` - Khung bao quanh (wrapper) cho tất cả routes con
- `page.js` - Nội dung thực sự của route

**Cấu trúc thư mục và kết quả:**

```
app/
├── layout.js          → Root Layout (áp dụng cho TẤT CẢ trang)
├── page.js            → Homepage (/)
│
├── blog/
│   ├── layout.js      → Blog Layout (chỉ áp dụng cho /blog/*)
│   ├── page.js        → Blog list (/blog)
│   │
│   └── [slug]/
│       └── page.js    → Blog post (/blog/react-intro)
│
└── products/
    ├── page.js        → Product list (/products)
    │
    └── [id]/
        └── page.js    → Product detail (/products/123)
```

**Quy tắc áp dụng:**

| URL | Layouts được áp dụng (ngoài → trong) | Page |
|---|---|---|
| `/` | `app/layout.js` | `app/page.js` |
| `/blog` | `app/layout.js` → `app/blog/layout.js` | `app/blog/page.js` |
| `/blog/react-intro` | `app/layout.js` → `app/blog/layout.js` | `app/blog/[slug]/page.js` |
| `/products` | `app/layout.js` | `app/products/page.js` |
| `/products/123` | `app/layout.js` | `app/products/[id]/page.js` |

---

#### 6.1. Root Layout (Bắt buộc)

**Root Layout** là lớp ngoài cùng, bao quanh **TẤT CẢ** các trang trong ứng dụng.

```jsx
// app/layout.js (Root Layout)

export const metadata = {
  title: 'My Next.js App',
  description: 'A production-ready React app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/products">Products</a>
          </nav>
        </header>
        
        <main>{children}</main> {/* ← Đây là "lỗ hổng" cho nội dung */}
        
        <footer>
          <p>&copy; 2026 My App</p>
        </footer>
      </body>
    </html>
  );
}
```

**Đặc điểm:**
- ✅ **Bắt buộc**: Mọi Next.js app phải có `app/layout.js`
- ✅ **Luôn render**: Header/Footer hiện ở mọi trang
- ✅ **Props `children`**: Là placeholder cho nội dung con (nested layout hoặc page)

**`children` là gì?**

Khi user truy cập `/blog`, React sẽ render:

```jsx
<RootLayout>
  {/* children = BlogLayout hoặc BlogPage */}
  <BlogLayout>
    <BlogPage />
  </BlogLayout>
</RootLayout>
```

---

#### 6.2. Nested Layout (Layout con)

**Nested Layout** chỉ áp dụng cho một nhóm routes cụ thể.

```jsx
// app/blog/layout.js (Blog Layout)

export default function BlogLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar chỉ hiện trong /blog/* */}
      <aside style={{ width: '200px', background: '#f0f0f0' }}>
        <h3>Categories</h3>
        <ul>
          <li><a href="/blog?category=tech">Tech</a></li>
          <li><a href="/blog?category=lifestyle">Lifestyle</a></li>
        </ul>
      </aside>
      
      <div style={{ flex: 1, padding: '20px' }}>
        {children}  {/* ← Blog page content */}
      </div>
    </div>
  );
}
```

**Kết quả render khi truy cập `/blog`:**

```
┌─────────────────────────────────────┐
│ Header (Root Layout)                │ ← app/layout.js
├─────────────────────────────────────┤
│ ┌─────────┬─────────────────────┐   │
│ │Categories│ Blog List (Page)   │   │ ← app/blog/layout.js + page.js
│ │         │                     │   │
│ │ - Tech  │ • React intro       │   │
│ │ - Life  │ • Next.js guide     │   │
│ └─────────┴─────────────────────┘   │
├─────────────────────────────────────┤
│ Footer (Root Layout)                │ ← app/layout.js
└─────────────────────────────────────┘
```

**Kết quả render khi truy cập `/products` (không có blog layout):**

```
┌─────────────────────────────────────┐
│ Header (Root Layout)                │ ← app/layout.js
├─────────────────────────────────────┤
│ Product List (Page)                 │ ← app/products/page.js
│                                     │    (KHÔNG có sidebar)
│ • Product 1                         │
│ • Product 2                         │
├─────────────────────────────────────┤
│ Footer (Root Layout)                │ ← app/layout.js
└─────────────────────────────────────┘
```

---

#### 6.3. Composition Flow: Hiểu về luồng lồng ghép

**Ví dụ: User truy cập `/blog/react-intro`**

**1. Next.js tìm file theo thứ tự:**

```
app/layout.js               ✅ Tìm thấy (Root Layout)
app/blog/layout.js          ✅ Tìm thấy (Blog Layout)  
app/blog/[slug]/page.js     ✅ Tìm thấy (Blog Post Page)
```

**2. React compose components (ngoài → trong):**

```jsx
// Kết quả cuối cùng (pseudo-code)
<RootLayout>              {/* app/layout.js */}
  <html>
    <body>
      <header>...</header>
      <main>
        <BlogLayout>      {/* app/blog/layout.js */}
          <div style={{ display: 'flex' }}>
            <aside>Sidebar</aside>
            <div>
              <BlogPostPage />  {/* app/blog/[slug]/page.js */}
            </div>
          </div>
        </BlogLayout>
      </main>
      <footer>...</footer>
    </body>
  </html>
</RootLayout>
```

**3. Cách `children` được truyền:**

```jsx
// Bước 1: RootLayout render
<RootLayout children={<BlogLayout>...</BlogLayout>} />

// Bước 2: BlogLayout render
<BlogLayout children={<BlogPostPage />} />

// Bước 3: BlogPostPage render
<BlogPostPage /> // Không có children (leaf node)
```

---

#### 6.4. Layout trong Monorepo (apps/public vs apps/admin)

**Kịch bản:** Cùng database nhưng 2 apps có layout khác nhau.

**apps/public/app/layout.js (Customer Site):**

```jsx
// Minimal, SEO-focused, clean UI
export default function PublicRootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <header className="sticky-header">
          <nav>
            <Logo />
            <SearchBar />
            <CartIcon />
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <SocialLinks />
          <ContactInfo />
        </footer>
      </body>
    </html>
  );
}
```

**apps/admin/app/layout.js (Admin Panel):**

```jsx
// Sidebar navigation, no SEO needed
export default function AdminRootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar cố định */}
          <aside style={{ width: '250px', background: '#2c3e50' }}>
            <h2>Admin Panel</h2>
            <nav>
              <a href="/products">Products</a>
              <a href="/orders">Orders</a>
              <a href="/customers">Customers</a>
            </nav>
          </aside>
          
          {/* Content area */}
          <main style={{ flex: 1, padding: '20px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

**So sánh layouts:**

| Aspect | `apps/public/app/layout.js` | `apps/admin/app/layout.js` |
|---|---|---|
| **Header** | Logo + Search + Cart | Sidebar navigation |
| **Footer** | ✅ Social links, contact | ❌ Không cần |
| **SEO** | ✅ Metadata, structured data | ❌ Không quan trọng |
| **Styling** | Clean, customer-friendly | Functional, admin-focused |

---

#### 6.5. Nested Layout trong Admin App

**apps/admin/app/products/layout.js:**

```jsx
// Layout riêng cho product management
export default function ProductLayout({ children }) {
  return (
    <div>
      {/* Breadcrumb */}
      <nav>
        <a href="/admin">Dashboard</a> / <span>Products</span>
      </nav>
      
      {/* Action bar */}
      <div style={{ marginBottom: '20px' }}>
        <button>+ Add New Product</button>
        <button>Export CSV</button>
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
}
```

**Kết quả khi truy cập `localhost:3001/products`:**

```
┌──────────────────────────────────────────────┐
│ Admin Panel (Root Layout Sidebar)           │
│ ┌──────────────────────────────────────────┐ │
│ │ Dashboard / Products (Breadcrumb)        │ │ ← products/layout.js
│ │ [+ Add] [Export]                         │ │ ← products/layout.js
│ │ ────────────────────────────────────────│ │
│ │ Product List (Page content)              │ │ ← products/page.js
│ │ • Nike Shoes - $100                      │ │
│ │ • Adidas Shirt - $50                     │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

#### 6.6. Best Practices cho Layout

✅ **DO:**
- Đặt navigation, header, footer trong Root Layout
- Dùng nested layout cho shared UI trong một section (ví dụ: blog sidebar)
- Truyền metadata riêng cho từng layout
- Tận dụng `children` để tái sử dụng code

❌ **DON'T:**
- Duplicate header/footer ở mỗi page (dùng layout thay vì)
- Fetch data trong layout (dùng Server Components trong page thay vì)
- Nest quá nhiều layout (tối đa 3 levels: Root → Section → Sub-section)

---

---

### 7. API Routes: Backend Built-in

#### 7.0. Kiến thức nền tảng về API

##### A. API là gì?

**API (Application Programming Interface)** là cách để các ứng dụng "nói chuyện" với nhau.

**Mental Model: Nhà hàng**
- **Khách hàng (Frontend):** Bạn ngồi ở bàn, muốn gọi món.
- **Thực đơn (API Documentation):** Danh sách món ăn bạn có thể gọi.
- **Người phục vụ (API):** Nhận yêu cầu của bạn, chuyển cho bếp, mang món ra.
- **Bếp (Backend/Database):** Nơi thực sự nấu món ăn (xử lý logic, lấy data).

**Ví dụ thực tế:**
```javascript
// Frontend gọi API
fetch('https://api.example.com/users')  // ← Gọi món "danh sách users"
  .then(res => res.json())
  .then(users => console.log(users));   // ← Nhận món (data)
```

**Tại sao cần API?**
- ✅ **Tách biệt Frontend và Backend:** Frontend không cần biết database là gì, chỉ cần gọi API.
- ✅ **Tái sử dụng:** Cùng 1 API có thể dùng cho web, mobile app, desktop app.
- ✅ **Bảo mật:** Database không public, chỉ API được phép truy cập.

---

##### B. REST API là gì?

**REST (Representational State Transfer)** là một kiến trúc thiết kế API phổ biến nhất.

**Nguyên tắc cốt lõi:**
1. **Mỗi resource có một URL duy nhất**
   - Users: `/api/users`
   - User cụ thể: `/api/users/5`
   - Posts của user: `/api/users/5/posts`

2. **Dùng HTTP Methods để thao tác**
   - `GET`: Lấy data (Read)
   - `POST`: Tạo mới (Create)
   - `PATCH/PUT`: Cập nhật (Update)
   - `DELETE`: Xóa (Delete)

**Ví dụ CRUD (Create, Read, Update, Delete):**

| Hành động | HTTP Method | URL | Body |
|---|---|---|---|
| Lấy tất cả users | `GET` | `/api/users` | Không |
| Lấy user ID 5 | `GET` | `/api/users/5` | Không |
| Tạo user mới | `POST` | `/api/users` | `{ name: "An" }` |
| Cập nhật user 5 | `PATCH` | `/api/users/5` | `{ name: "Bình" }` |
| Xóa user 5 | `DELETE` | `/api/users/5` | Không |

---

##### C. HTTP Methods chi tiết

###### 1. GET - Lấy dữ liệu

```javascript
// Client gọi
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => console.log(data));

// Server trả về
// Status: 200 OK
// Body: [{ id: 1, name: "An" }, { id: 2, name: "Bình" }]
```

**Đặc điểm:**
- ✅ Không thay đổi data trên server (Safe)
- ✅ Có thể cache
- ✅ Có thể bookmark URL
- ❌ Không nên gửi data nhạy cảm qua URL

---

###### 2. POST - Tạo mới

```javascript
// Client gọi
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: "Cường", age: 30 })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Server trả về
// Status: 201 Created
// Body: { id: 3, name: "Cường", age: 30 }
```

**Đặc điểm:**
- ✅ Tạo resource mới
- ✅ Gửi data qua body (an toàn hơn URL)
- ❌ Không cache

---

###### 3. PATCH/PUT - Cập nhật

```javascript
// PATCH: Cập nhật một phần
fetch('https://api.example.com/users/3', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ age: 31 })  // Chỉ update age
});

// PUT: Thay thế toàn bộ
fetch('https://api.example.com/users/3', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: "Cường", age: 31 })  // Phải gửi đầy đủ
});
```

**Sự khác biệt:**
- **PATCH:** Cập nhật một vài field → Linh hoạt hơn
- **PUT:** Thay thế toàn bộ object → Ít dùng hơn

---

###### 4. DELETE - Xóa

```javascript
fetch('https://api.example.com/users/3', {
  method: 'DELETE'
});

// Server trả về
// Status: 204 No Content (hoặc 200 OK)
```

---

##### D. API trong React vs Next.js

###### React thuần (Client-side API calls)

```jsx
// React Component
import { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API từ browser
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Đặc điểm:**
- ❌ API call chạy trên **browser** (client-side)
- ❌ Người dùng thấy loading spinner
- ❌ Không tốt cho SEO (Google bot không đợi API)
- ❌ API keys bị lộ (nếu gọi API cần authentication)

---

###### Next.js Server Components (Server-side API calls)

```jsx
// Next.js Server Component
async function getUsers() {
  const res = await fetch('https://api.example.com/users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();  // Chạy trên server!

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Đặc điểm:**
- ✅ API call chạy trên **server** (server-side)
- ✅ HTML đã có data khi gửi về browser → Không loading
- ✅ Tốt cho SEO
- ✅ Có thể dùng API keys an toàn (không lộ ra browser)

---

##### E. API Routes trong Next.js

**API Routes** cho phép bạn tạo backend API ngay trong Next.js project, không cần server riêng (Express, Node.js).

**Mental Model: Nhà hàng tự phục vụ**
- Trước đây: Frontend (nhà hàng) + Backend riêng (bếp ở tòa nhà khác)
- Next.js: Frontend + Backend cùng 1 chỗ (bếp ngay trong nhà hàng)

**Cấu trúc thư mục:**

```
src/app/
├── page.js              → Frontend: http://localhost:3000/
├── about/page.js        → Frontend: http://localhost:3000/about
└── api/                 → Backend API
    ├── users/
    │   └── route.js     → API: http://localhost:3000/api/users
    └── posts/
        └── route.js     → API: http://localhost:3000/api/posts
```

**Quy tắc:**
- File trong `app/api/` → Tạo API endpoint
- File phải tên `route.js` (hoặc `route.ts`)
- Export các hàm: `GET`, `POST`, `PATCH`, `DELETE`

---

##### F. Endpoint là gì?

**Endpoint** là một URL cụ thể mà bạn có thể gọi để lấy/gửi data.

**Ví dụ:**
```
https://api.example.com/users       ← Endpoint 1
https://api.example.com/users/5     ← Endpoint 2
https://api.example.com/posts       ← Endpoint 3
```

**Mental Model: Địa chỉ nhà**
- API = Khu phố
- Endpoint = Địa chỉ cụ thể của từng ngôi nhà

---

##### G. Static vs Dynamic API Routes

###### 1. Static API Route (URL cố định)

**Ví dụ:** `/api/users` - Luôn trả về danh sách tất cả users

```
File: src/app/api/users/route.js
URL:  http://localhost:3000/api/users
```

**Đặc điểm:**
- ✅ URL không thay đổi
- ✅ Dùng cho: Danh sách, tổng quan, thống kê chung

---

###### 2. Dynamic API Route (URL có tham số)

**Ví dụ:** `/api/users/[id]` - Trả về user cụ thể theo ID

```
File: src/app/api/users/[id]/route.js
URL:  http://localhost:3000/api/users/5
      http://localhost:3000/api/users/123
      http://localhost:3000/api/users/abc
```

**Cách hoạt động:**
- `[id]` = Placeholder (biến)
- Next.js tự động extract giá trị từ URL
- Bạn nhận được qua `params.id`

**So sánh:**

| Loại | File Path | URL | Khi nào dùng |
|---|---|---|---|
| **Static** | `api/users/route.js` | `/api/users` | Lấy danh sách |
| **Dynamic** | `api/users/[id]/route.js` | `/api/users/5` | Lấy 1 item cụ thể |
| **Nested Dynamic** | `api/users/[id]/posts/[postId]/route.js` | `/api/users/5/posts/10` | Lấy post 10 của user 5 |

**Ví dụ thực tế:**

```javascript
// Static Route
// File: src/app/api/products/route.js
export async function GET() {
  const products = await db.products.findAll();
  return Response.json(products);
}
// URL: /api/products → Tất cả sản phẩm

// Dynamic Route
// File: src/app/api/products/[id]/route.js
export async function GET(request, { params }) {
  const product = await db.products.findById(params.id);
  return Response.json(product);
}
// URL: /api/products/42 → Sản phẩm ID 42
```

---

##### H. Request và Response trong API Routes

###### 1. Request Object

```javascript
export async function POST(request) {
  // 1. Lấy body (JSON)
  const body = await request.json();
  
  // 2. Lấy query params (?search=abc)
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('search');
  
  // 3. Lấy headers
  const token = request.headers.get('authorization');
  
  console.log({ body, query, token });
  
  return Response.json({ success: true });
}
```

**Ví dụ gọi:**
```javascript
fetch('/api/users?search=An', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abc123'
  },
  body: JSON.stringify({ name: 'An', age: 25 })
});

// Server nhận:
// body = { name: 'An', age: 25 }
// query = 'An'
// token = 'Bearer abc123'
```

---

###### 2. Response Object

```javascript
export async function GET() {
  // 1. Trả về JSON (cách phổ biến nhất)
  return Response.json({ message: 'Hello' });
  
  // 2. Trả về với status code tùy chỉnh
  return Response.json(
    { error: 'Not found' },
    { status: 404 }
  );
  
  // 3. Trả về với headers tùy chỉnh
  return Response.json(
    { data: [...] },
    {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=3600',
        'X-Custom-Header': 'value'
      }
    }
  );
}
```

**HTTP Status Codes phổ biến:**

| Code | Ý nghĩa | Khi nào dùng |
|---|---|---|
| **200** | OK | Request thành công (GET, PATCH, DELETE) |
| **201** | Created | Tạo mới thành công (POST) |
| **204** | No Content | Xóa thành công, không trả data |
| **400** | Bad Request | Client gửi data sai format |
| **401** | Unauthorized | Chưa đăng nhập |
| **403** | Forbidden | Không có quyền truy cập |
| **404** | Not Found | Resource không tồn tại |
| **500** | Internal Server Error | Lỗi server (bug trong code) |

---

##### I. Tóm tắt: Luồng hoạt động của API

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │  Next.js    │                    │  Database   │
│  (Client)   │                    │ API Route   │                    │             │
└─────────────┘                    └─────────────┘                    └─────────────┘
      │                                    │                                  │
      │  1. fetch('/api/users')            │                                  │
      │───────────────────────────────────>│                                  │
      │                                    │                                  │
      │                                    │  2. Query database               │
      │                                    │─────────────────────────────────>│
      │                                    │                                  │
      │                                    │  3. Return data                  │
      │                                    │<─────────────────────────────────│
      │                                    │                                  │
      │  4. Response.json(users)           │                                  │
      │<───────────────────────────────────│                                  │
      │                                    │                                  │
      │  5. Display data                   │                                  │
      │                                    │                                  │
```

**Các bước:**
1. **Client gửi request** → URL + HTTP Method + Body (nếu có)
2. **API Route nhận request** → Xử lý logic (query database, validate, etc.)
3. **Database trả data** → API Route nhận kết quả
4. **API Route trả response** → JSON + Status Code
5. **Client nhận response** → Hiển thị data hoặc xử lý lỗi

---

#### 7.1. Ví dụ thực hành: API CRUD hoàn chỉnh

##### Static Route: Danh sách users

```javascript
// src/app/api/users/route.js

// Giả lập database
let users = [
  { id: 1, name: 'An', email: 'an@example.com' },
  { id: 2, name: 'Bình', email: 'binh@example.com' },
];

// GET: Lấy tất cả users
export async function GET(request) {
  // Hỗ trợ search query: /api/users?search=An
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  
  let result = users;
  if (search) {
    result = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return Response.json(result);
}

// POST: Tạo user mới
export async function POST(request) {
  const body = await request.json();
  
  // Validation
  if (!body.name || !body.email) {
    return Response.json(
      { error: 'Name and email are required' },
      { status: 400 }
    );
  }
  
  // Tạo user mới
  const newUser = {
    id: users.length + 1,
    name: body.name,
    email: body.email
  };
  
  users.push(newUser);
  
  return Response.json(newUser, { status: 201 });
}
```

**Cách gọi từ Frontend:**

```javascript
// GET: Lấy tất cả users
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// GET: Search users
fetch('/api/users?search=An')
  .then(res => res.json())
  .then(data => console.log(data));

// POST: Tạo user mới
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Cường', email: 'cuong@example.com' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

##### Dynamic Route: User cụ thể

```javascript
// src/app/api/users/[id]/route.js

// Giả lập database (trong thực tế dùng chung với route.js ở trên)
let users = [
  { id: 1, name: 'An', email: 'an@example.com' },
  { id: 2, name: 'Bình', email: 'binh@example.com' },
];

// GET: Lấy 1 user theo ID
export async function GET(request, { params }) {
  const userId = parseInt(params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return Response.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  return Response.json(user);
}

// PATCH: Cập nhật user
export async function PATCH(request, { params }) {
  const userId = parseInt(params.id);
  const body = await request.json();
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return Response.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  // Cập nhật (chỉ các field được gửi lên)
  users[userIndex] = {
    ...users[userIndex],
    ...body
  };
  
  return Response.json(users[userIndex]);
}

// DELETE: Xóa user
export async function DELETE(request, { params }) {
  const userId = parseInt(params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return Response.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  users.splice(userIndex, 1);
  
  return Response.json(
    { message: 'User deleted successfully' },
    { status: 200 }
  );
}
```

**Cách gọi từ Frontend:**

```javascript
// GET: Lấy user ID 1
fetch('/api/users/1')
  .then(res => res.json())
  .then(data => console.log(data));

// PATCH: Cập nhật user ID 1
fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'An Nguyễn' })
})
  .then(res => res.json())
  .then(data => console.log(data));

// DELETE: Xóa user ID 1
fetch('/api/users/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

#### 7.2. Ví dụ đơn giản hơn (cho người mới bắt đầu)

##### Ví dụ: API trả về danh sách users

```javascript
// src/app/api/users/route.js

export async function GET(request) {
  const users = [
    { id: 1, name: 'An' },
    { id: 2, name: 'Bình' },
  ];
  
  return Response.json(users);
}

export async function POST(request) {
  const body = await request.json();
  
  // Lưu vào database (giả lập)
  console.log('New user:', body);
  
  return Response.json({ success: true, data: body }, { status: 201 });
}
```

**Truy cập:**
- GET: `http://localhost:3000/api/users`
- POST: `http://localhost:3000/api/users` (với body JSON)

---

#### Ví dụ: Dynamic API Route

```javascript
// src/app/api/users/[id]/route.js

export async function GET(request, { params }) {
  const userId = params.id;
  
  // Giả lập fetch từ database
  const user = { id: userId, name: 'User ' + userId };
  
  return Response.json(user);
}
```

**Truy cập:** `http://localhost:3000/api/users/5` → `{ id: "5", name: "User 5" }`

---

### 8. Loading và Error Handling

#### 8.1. Loading UI

```jsx
// src/app/blog/loading.js

export default function Loading() {
  return (
    <div>
      <p>Đang tải dữ liệu...</p>
      <div className="spinner"></div>
    </div>
  );
}
```

**Cơ chế:** Khi `/blog` đang fetch data, Next.js tự động hiển thị `loading.js`.

---

#### 8.2. Error UI

```jsx
// src/app/blog/error.js
'use client';  // Error components phải là Client Component

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Có lỗi xảy ra!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Thử lại</button>
    </div>
  );
}
```

**Cơ chế:** Nếu `page.js` throw error, Next.js hiển thị `error.js`.

---

### 9. Deployment: Vercel (1-Click Deploy)

#### Bước 1: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-app.git
git push -u origin main
```

#### Bước 2: Deploy lên Vercel

1. Truy cập: [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Chọn repository `my-app`
5. Click **"Deploy"**

**Kết quả:** Sau 1-2 phút, app của bạn sẽ live tại `https://my-app.vercel.app`

**Tự động deploy:** Mỗi lần push code lên GitHub → Vercel tự động deploy lại.

---

### 10. State Management: Quản lý trạng thái toàn cục

#### 10.1. Tại sao cần State Management Libraries?

**Vấn đề với Context API:**

Context API (đã học ở Phần 5) tốt cho:
- ✅ Chia sẻ data đơn giản (theme, user info)
- ✅ Ứng dụng nhỏ, vừa

Nhưng có hạn chế:
- ❌ Re-render không cần thiết (mọi component dùng context đều re-render khi context thay đổi)
- ❌ Không có DevTools để debug
- ❌ Khó tổ chức code khi app lớn

**Giải pháp:** Dùng State Management Libraries chuyên nghiệp.

---

#### 10.2. Redux vs Zustand

| Tiêu chí | Redux | Zustand |
|---|---|---|
| **Độ phức tạp** | Cao (nhiều boilerplate) | Thấp (code ít hơn) |
| **Learning curve** | Khó | Dễ |
| **DevTools** | ✅ Mạnh mẽ | ✅ Có |
| **Performance** | Tốt | Tốt hơn |
| **Khi nào dùng?** | App lớn, team lớn | App vừa/nhỏ, cần đơn giản |

**Khuyến nghị:** Bắt đầu với **Zustand** (dễ học hơn), sau đó học Redux nếu cần.

---

#### 10.3. Zustand - State Management đơn giản

##### A. Cài đặt

```bash
npm install zustand
```

##### B. Tạo Store (Kho lưu trữ state)

```javascript
// src/store/useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set) => ({
  // State
  items: [],
  totalPrice: 0,
  
  // Actions (Hành động thay đổi state)
  addItem: (product) => set((state) => ({
    items: [...state.items, product],
    totalPrice: state.totalPrice + product.price
  })),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId),
    totalPrice: state.items
      .filter(item => item.id !== productId)
      .reduce((sum, item) => sum + item.price, 0)
  })),
  
  clearCart: () => set({ items: [], totalPrice: 0 })
}));

export default useCartStore;
```

##### C. Sử dụng trong Component

```jsx
// src/components/ProductCard.js
'use client';

import useCartStore from '@/store/useCartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
```

```jsx
// src/components/Cart.js
'use client';

import useCartStore from '@/store/useCartStore';

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  
  return (
    <div>
      <h2>Giỏ hàng ({items.length} sản phẩm)</h2>
      
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => removeItem(item.id)}>Xóa</button>
        </div>
      ))}
      
      <p>Tổng: ${totalPrice}</p>
      <button onClick={clearCart}>Xóa tất cả</button>
    </div>
  );
}
```

**Ưu điểm Zustand:**
- ✅ Code ngắn gọn, dễ hiểu
- ✅ Không cần Provider wrapper
- ✅ Tự động tối ưu re-render (chỉ component dùng state nào thì re-render khi state đó thay đổi)

---

#### 10.4. Redux Toolkit - State Management cho App lớn

##### A. Cài đặt

```bash
npm install @reduxjs/toolkit react-redux
```

##### B. Tạo Slice (Phần state)

```javascript
// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalPrice += action.payload.price;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.totalPrice -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

##### C. Tạo Store

```javascript
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});
```

##### D. Setup Provider (Next.js App Router)

```jsx
// src/app/layout.js
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

##### E. Sử dụng trong Component

```jsx
// src/components/ProductCard.js
'use client';

import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => dispatch(addItem(product))}>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
```

```jsx
// src/components/Cart.js
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '@/store/cartSlice';

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();
  
  return (
    <div>
      <h2>Giỏ hàng ({items.length} sản phẩm)</h2>
      
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => dispatch(removeItem(item.id))}>Xóa</button>
        </div>
      ))}
      
      <p>Tổng: ${totalPrice}</p>
      <button onClick={() => dispatch(clearCart())}>Xóa tất cả</button>
    </div>
  );
}
```

**Khi nào dùng Redux?**
- ✅ App có nhiều state phức tạp
- ✅ Cần time-travel debugging (xem lại lịch sử thay đổi state)
- ✅ Team lớn, cần quy chuẩn code

---

#### 10.5. So sánh Context API vs Zustand vs Redux

| Tính năng | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| **Setup** | Dễ | Dễ | Trung bình |
| **Boilerplate** | Ít | Rất ít | Trung bình |
| **Performance** | ⚠️ Re-render nhiều | ✅ Tối ưu | ✅ Tối ưu |
| **DevTools** | ❌ Không | ✅ Có | ✅ Mạnh mẽ |
| **Learning Curve** | Dễ | Dễ | Khó hơn |
| **Use Case** | App nhỏ | App vừa | App lớn |

**Lộ trình học:**
1. Context API (đã học ở Phần 5)
2. Zustand (học tiếp)
3. Redux Toolkit (nếu cần)

---

### 11. Authentication: Xác thực người dùng với NextAuth.js

#### 11.1. Tại sao cần Authentication?

**Authentication (Xác thực)** là quá trình xác định "bạn là ai" (đăng nhập).

**Use cases:**
- Đăng nhập/Đăng ký
- Bảo vệ trang (chỉ user đã đăng nhập mới xem được)
- Phân quyền (admin, user thường)

---

#### 11.2. NextAuth.js - Giải pháp Authentication cho Next.js

**NextAuth.js** là thư viện authentication chính thức cho Next.js.

**Tính năng:**
- ✅ Đăng nhập bằng Email/Password
- ✅ Đăng nhập bằng OAuth (Google, GitHub, Facebook)
- ✅ Session management
- ✅ JWT tokens
- ✅ Database integration

---
##### A. Cài đặt

```bash
npm install next-auth
```

##### B. Tạo API Route cho NextAuth

```javascript
// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    // 1. Đăng nhập bằng Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // 2. Đăng nhập bằng Email/Password
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Kiểm tra email/password (ví dụ đơn giản)
        if (credentials.email === 'user@example.com' && credentials.password === '123456') {
          return { id: 1, name: 'User', email: 'user@example.com' };
        }
        return null;  // Đăng nhập thất bại
      }
    })
  ],
  
  // Tùy chỉnh pages
  pages: {
    signIn: '/login',  // Trang đăng nhập tùy chỉnh
  },
  
  // Callbacks
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  },
  
  // Secret key (tạo bằng: openssl rand -base64 32)
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

##### C. Tạo file .env.local

```bash
# .env.local

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (lấy từ Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

##### D. Tạo trang đăng nhập

```jsx
// src/app/login/page.js
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/dashboard'
    });
  };
  
  return (
    <div>
      <h1>Đăng nhập</h1>
      
      {/* Đăng nhập bằng Google */}
      <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        Đăng nhập bằng Google
      </button>
      
      <hr />
      
      {/* Đăng nhập bằng Email/Password */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
```

##### E. Sử dụng Session trong Component

```jsx
// src/components/UserProfile.js
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <p>Đang tải...</p>;
  }
  
  if (status === 'unauthenticated') {
    return <p>Bạn chưa đăng nhập</p>;
  }
  
  return (
    <div>
      <p>Xin chào, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Đăng xuất</button>
    </div>
  );
}
```

##### F. Bảo vệ trang (Protected Route)

```jsx
// src/app/dashboard/page.js
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  // Nếu chưa đăng nhập → Redirect về trang login
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Chào mừng, {session.user.name}!</p>
    </div>
  );
}
```

##### G. Bảo vệ API Route

```javascript
// src/app/api/protected/route.js
import { getServerSession } from 'next-auth';

export async function GET(request) {
  const session = await getServerSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // User đã đăng nhập
  return Response.json({
    message: 'Protected data',
    user: session.user
  });
}

```

---

#### 11.3. Deep Dive: Cơ chế Session Authentication (Browser ↔ Server)

> **Mental Model:** Session giống như **Vé xem phim**. Khi vào rạp (login), bạn nhận vé (cookie). Mỗi lần vào phòng chiếu (request), bạn đưa vé → nhân viên check (server validate) → cho vào.

Trước khi học NextAuth.js, cần hiểu bản chất của session authentication ở mức HTTP. Đây là kiến thức nền tảng áp dụng cho mọi framework.

---

##### A. Trước khi đăng nhập: Mọi request đều "ẩn danh"

**Browser → Server**

Khi visitor mới mở site lần đầu:

```http
GET /dashboard HTTP/1.1
Host: example.com
```

**Vấn đề:** Không có cookie, server không biết bạn là ai.

**Server → Browser**

Server phản hồi:
- Hiển thị trang public, hoặc
- Redirect về trang login:

```http
HTTP/1.1 302 Found
Location: /login
```

---

##### B. Bước đăng nhập: Server tạo Session

User submit form đăng nhập (hoặc hoàn tất Google login callback).

**Browser → Server**

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

email=phuong@example.com&password=....
```

**Server internal actions (quan trọng)**

Server thực hiện:

1. **Verify credentials** (hoặc verify Google identity)
2. **Tạo session object** trong server storage (DB/Redis/memory):

```javascript
// Example internal storage
session_id = "a8f3c9...random..."  // Random string (không có ý nghĩa)

session_store[a8f3c9...] = {
  user_id: 123,
  created_at: "2026-01-31T10:00:00Z",
  expires_at: "2026-02-07T10:00:00Z",  // 7 ngày sau
  roles: ["admin"]
}
```

> **Key point:** `session_id` chỉ là khóa random, vô nghĩa nếu đứng riêng. Giá trị thật nằm trong `session_store`.

**Server → Browser (Set-Cookie)**

Server reply với header `Set-Cookie`:

```http
HTTP/1.1 302 Found
Set-Cookie: session_id=a8f3c9...; Path=/; HttpOnly; Secure; SameSite=Lax
Location: /dashboard
```

Browser lưu cookie này.

**Cookie properties (nền tảng bảo mật):**

| Property | Ý nghĩa | Tại sao quan trọng |
|---|---|---|
| `HttpOnly` | JavaScript không thể đọc cookie | ✅ Reduce XSS theft (nếu hacker inject JS, không lấy được cookie) |
| `Secure` | Chỉ gửi qua HTTPS | ✅ Prevent man-in-the-middle attacks (HTTP plain text) |
| `SameSite=Lax` | Cookie không gửi từ external sites | ✅ Reduce CSRF (Cross-Site Request Forgery) |
| `Path=/` | Cookie gửi cho tất cả routes | ✅ Apply to whole app |

---

##### C. Sau khi đăng nhập: Browser tự động gửi Cookie mọi request

User truy cập `/dashboard`.

**Browser → Server (Automatic)**

Browser **tự động** gắn cookie vào request:

```http
GET /dashboard HTTP/1.1
Host: example.com
Cookie: session_id=a8f3c9...
```

> **Quan trọng:** Developer không cần code gì. Browser engine tự làm.

**Server internal actions**

Server:

1. Đọc `session_id` từ cookie header
2. Lookup trong session store: `session_store[a8f3c9...]`
3. Lấy được `user_id=123`
4. Load user data/roles nếu cần
5. Allow access

**Server → Browser**

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
  <h1>Welcome, Phuong!</h1>
  ...
</html>
```

**Từ giờ trở đi, mọi request đều có "chứng minh":**
- Cookie chứa `session_id`
- Server map nó về user

---

##### D. Session Expiration: Cơ chế "tự động đăng xuất"

Sessions có thời hạn sử dụng:

**1. Server-side expiry**

```javascript
session_store[a8f3c9...] = {
  expires_at: "2026-02-07T10:00:00Z"  // 7 ngày
}
```

**2. Cookie expiry (optional)**

```http
Set-Cookie: session_id=a8f3c9...; Expires=Fri, 07 Feb 2026 10:00:00 GMT
```

hoặc dùng **session cookie** (xóa khi đóng browser):

```http
Set-Cookie: session_id=a8f3c9...; (no Expires)
```

**Validation mỗi request:**

```javascript
// Server checks
if (session.expires_at < now) {
  // Session expired → Treat as logged out
  redirect('/login');
}
```

---

##### E. Logout: Cách hoạt động

Logout phải làm **2 việc**:

**1. Kill server-side session**

```javascript
// Delete from storage
delete session_store[a8f3c9...];
```

**2. Remove cookie in browser**

Server gửi header xóa cookie:

```http
HTTP/1.1 302 Found
Set-Cookie: session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Location: /login
```

> **Tại sao phải làm cả 2?**  
> - Nếu chỉ xóa cookie → Hacker có backup cookie vẫn dùng được (server vẫn có session)
> - Nếu chỉ xóa server session → Cookie vẫn gửi lên (dù server reject)  
> → **Phải xóa cả 2** để đảm bảo an toàn

---

##### F. Tại sao gọi là "Stateful" Authentication?

Because server phải **giữ trạng thái (state)**:
- Một table/store chứa sessions (`session_id` → `user_data`)
- Validation yêu cầu lookup (database/Redis query)

**Thách thức với nhiều servers:**

```
        Load Balancer
           ↓
    ┌──────┴──────┐
    ↓             ↓
Server 1      Server 2      Server 3
```

**Vấn đề:** User login ở Server 1 → Session lưu ở Server 1.  
Nhưng request tiếp theo → Load balancer route về Server 2 → **Không tìm thấy session!**

**Giải pháp:** Dùng **shared session store** (Redis, database):

```
Server 1 ──┐
Server 2 ──┼──→ Redis (shared session store)
Server 3 ──┘
```

Tất cả servers đều đọc/ghi vào cùng 1 Redis → Session works across servers.

---

##### G. Mental Model đơn giản nhất

> **Cookie = Chìa khóa (`session_id`)**  
> **Server = Tủ khóa (session store)**

**Mỗi request:**
1. Browser đưa chìa khóa (cookie)
2. Server mở tủ khóa (lookup session)
3. Biết bạn là ai → Cho phép truy cập

**Khi logout:**
1. Server vứt chìa khóa (delete session)
2. Browser quên chìa khóa (delete cookie)

---

##### H. So sánh: Stateful vs Stateless (JWT)

| Aspect | Stateful Session (Cookie-based) | Stateless JWT (Token-based) |
|---|---|---|
| **Storage** | Server lưu session (DB/Redis) | Không lưu gì, tất cả info trong token |
| **Validation** | Lookup database mỗi request | Chỉ verify signature (không query DB) |
| **Logout** | Xóa session từ DB | Không thể "xóa" token (phải đợi expire) |
| **Scalability** | Cần shared storage (Redis) | Dễ scale (stateless) |
| **Security** | Revoke ngay lập tức (xóa session) | Không revoke được (token còn hạn vẫn valid) |

**Khi nào dùng gì?**
- **Stateful Session:** Web apps truyền thống, cần revoke tức thì (admin ban user)
- **JWT:** Mobile apps, microservices, không cần revoke ngay

---

#### 11.3. OAuth với Google - Hướng dẫn setup

**Bước 1: Tạo Google OAuth Credentials**

1. Truy cập: [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy **Client ID** và **Client Secret** vào `.env.local`

**Bước 2: Test**

```bash
npm run dev
```

Truy cập `http://localhost:3000/login` → Click "Đăng nhập bằng Google"

---

#### 11.4. Best Practices

**✅ NÊN:**
- Dùng `NEXTAUTH_SECRET` mạnh (random string)
- Lưu session vào database (production)
- Validate user input
- Dùng HTTPS (production)

**❌ KHÔNG NÊN:**
- Commit `.env.local` lên Git
- Lưu password dạng plain text
- Dùng HTTP (production)

---

### 12. Testing: Kiểm thử ứng dụng

#### 12.1. Tại sao cần Testing?

**Testing** giúp:
- ✅ Phát hiện bug sớm
- ✅ Tự tin khi refactor code
- ✅ Document code (test = ví dụ sử dụng)
- ✅ Giảm bug ở production

**Các loại test:**
1. **Unit Test** - Test từng function/component riêng lẻ
2. **Integration Test** - Test nhiều components hoạt động cùng nhau
3. **E2E Test** - Test toàn bộ user flow (như user thật)

---

#### 12.2. Jest - Unit Testing

**Jest** là framework test phổ biến nhất cho JavaScript/React.

##### A. Cài đặt

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

##### B. Cấu hình Jest

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

##### C. Viết Unit Test

**Test một function:**

```javascript
// src/lib/utils.js
export function add(a, b) {
  return a + b;
}

export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}
```

```javascript
// src/lib/utils.test.js
import { add, formatPrice } from './utils';

describe('Utils', () => {
  test('add() cộng 2 số', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
  
  test('formatPrice() format giá tiền', () => {
    expect(formatPrice(10)).toBe('$10.00');
    expect(formatPrice(9.99)).toBe('$9.99');
  });
});
```

**Test một Component:**

```jsx
// src/components/Button.js
export default function Button({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

```javascript
// src/components/Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('render text đúng', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('gọi onClick khi click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('disabled khi có prop disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

##### D. Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm test -- --coverage

# Chạy tests ở watch mode
npm test -- --watch
```

---

#### 12.3. Cypress - End-to-End Testing

**Cypress** test ứng dụng như một user thật (mở browser, click, nhập text).

##### A. Cài đặt

```bash
npm install --save-dev cypress
```

##### B. Khởi tạo Cypress

```bash
npx cypress open
```

##### C. Viết E2E Test

```javascript
// cypress/e2e/login.cy.js

describe('Login Flow', () => {
  it('đăng nhập thành công', () => {
    // 1. Mở trang login
    cy.visit('http://localhost:3000/login');
    
    // 2. Nhập email
    cy.get('input[type="email"]').type('user@example.com');
    
    // 3. Nhập password
    cy.get('input[type="password"]').type('123456');
    
    // 4. Click nút đăng nhập
    cy.get('button[type="submit"]').click();
    
    // 5. Kiểm tra redirect về dashboard
    cy.url().should('include', '/dashboard');
    
    // 6. Kiểm tra hiển thị tên user
    cy.contains('Xin chào, User').should('be.visible');
  });
  
  it('hiển thị lỗi khi sai password', () => {
    cy.visit('http://localhost:3000/login');
    
    cy.get('input[type="email"]').type('user@example.com');
    cy.get('input[type="password"]').type('wrong-password');
    cy.get('button[type="submit"]').click();
    
    // Kiểm tra hiển thị thông báo lỗi
    cy.contains('Email hoặc mật khẩu không đúng').should('be.visible');
  });
});
```

```javascript
// cypress/e2e/shopping-cart.cy.js

describe('Shopping Cart', () => {
  it('thêm sản phẩm vào giỏ hàng', () => {
    cy.visit('http://localhost:3000/products');
    
    // Click nút "Thêm vào giỏ hàng" của sản phẩm đầu tiên
    cy.get('[data-testid="add-to-cart"]').first().click();
    
    // Kiểm tra số lượng sản phẩm trong giỏ hàng
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // Mở giỏ hàng
    cy.get('[data-testid="cart-icon"]').click();
    
    // Kiểm tra sản phẩm có trong giỏ hàng
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });
});
```

##### D. Chạy Cypress tests

```bash
# Mở Cypress UI
npx cypress open

# Chạy headless (CI/CD)
npx cypress run
```

---

#### 12.4. Best Practices

**Unit Tests:**
- ✅ Test logic phức tạp (utils, helpers)
- ✅ Test components có nhiều states
- ✅ Nhanh, chạy thường xuyên

**E2E Tests:**
- ✅ Test user flows quan trọng (đăng nhập, thanh toán)
- ✅ Test trước khi deploy
- ⚠️ Chậm hơn unit tests

**Quy tắc vàng:**
- Viết tests cho code quan trọng (authentication, payment)
- Không cần test mọi thứ (UI đơn giản không cần test)
- Test behavior, không test implementation

---

#### 12.5. Test Coverage

**Coverage** = Tỷ lệ code được test.

```bash
npm test -- --coverage
```

**Output:**
```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.5  |   78.2   |   90.1  |   85.5  |
 components/        |   92.3  |   85.7   |   100   |   92.3  |
  Button.js         |   100   |   100    |   100   |   100   |
  Card.js           |   85.7  |   75     |   100   |   85.7  |
 lib/               |   78.9  |   70.5   |   80.2  |   78.9  |
  utils.js          |   100   |   100    |   100   |   100   |
--------------------|---------|----------|---------|---------|
```

**Mục tiêu:** 70-80% coverage là tốt. 100% không cần thiết.

---

### 13. So sánh Next.js vs React thuần

| Tính năng | React (CRA) | Next.js |
|---|---|---|
| **Routing** | Cần cài `react-router-dom` | ✅ Built-in, file-based |
| **SEO** | ❌ Kém (CSR) | ✅ Tốt (SSR/SSG) |
| **Performance** | Phải tự tối ưu | ✅ Tự động (code splitting, image optimization) |
| **API Backend** | Cần server riêng (Express, Node.js) | ✅ API Routes built-in |
| **Deployment** | Phức tạp | ✅ 1-click với Vercel |
| **Learning Curve** | Dễ hơn | Khó hơn (nhiều khái niệm mới) |

---

### 14. Khi nào dùng Next.js?

**✅ Dùng Next.js khi:**
- Cần SEO tốt (blog, e-commerce, landing page).
- Cần performance cao (SSG/ISR).
- Muốn full-stack app (frontend + API backend).
- Muốn deploy nhanh.

**❌ Không cần Next.js khi:**
- App nội bộ (không cần SEO).
- Dashboard/Admin panel (ít người dùng).
- Đang học React cơ bản (nên học React thuần trước).

---

### 15. Tài nguyên học thêm

- **Official Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tutorial:** [nextjs.org/learn](https://nextjs.org/learn)
- **Examples:** [github.com/vercel/next.js/tree/canary/examples](https://github.com/vercel/next.js/tree/canary/examples)

---

## PHẦN 8: KIẾN THỨC BỔ SUNG ĐỂ HIỂU NEXT.JS

### Giới thiệu

Bạn đã học React rất tốt qua các phần trước. Tuy nhiên, để hiểu và viết Next.js code hiệu quả, bạn cần bổ sung thêm một số kiến thức về JavaScript nâng cao và web development. Phần này sẽ giúp bạn lấp đầy những khoảng trống đó.

> **Tỷ lệ kiến thức:** Với React mastery từ tài liệu này, bạn đã có **~70%** kiến thức cần thiết. Phần 8 này sẽ bổ sung **30%** còn lại.

---

### 1. Async/Await: Xử lý bất đồng bộ ⭐⭐⭐

**Tại sao quan trọng?** Next.js Server Components dùng `async/await` rất nhiều để fetch data.

#### 1.1. Vấn đề: JavaScript là đơn luồng (Single-threaded)

JavaScript chỉ có **1 luồng xử lý**. Nếu một tác vụ chậm (gọi API, đọc file) chạy đồng bộ → Toàn bộ chương trình bị "đóng băng".

**Ví dụ sai (Đồng bộ - Blocking):**

```javascript
// Giả sử hàm này mất 5 giây
function fetchData() {
  // ... chờ 5 giây ...
  return { name: "An" };
}

console.log("1. Bắt đầu");
const data = fetchData();  // ← Chương trình đóng băng 5 giây ở đây!
console.log("2. Data:", data);
console.log("3. Kết thúc");

// Output:
// 1. Bắt đầu
// ... (đợi 5 giây) ...
// 2. Data: { name: "An" }
// 3. Kết thúc
```

**Vấn đề:** Trong 5 giây đó, trình duyệt/server không làm gì được (UI đóng băng, không xử lý request khác).

---

#### 1.2. Giải pháp: Promise và Async/Await

**Promise** là một object đại diện cho kết quả của một tác vụ bất đồng bộ trong tương lai.

**Mental Model: Phiếu lấy số ở ngân hàng**
- Bạn đến ngân hàng → Lấy phiếu số 42 (Promise)
- Bạn ngồi chờ, làm việc khác (không đóng băng)
- Khi đến lượt → Nhân viên gọi số 42 → Bạn nhận kết quả

##### A. Promise Basics

```javascript
// Tạo một Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ name: "An" });  // Thành công
    } else {
      reject(new Error("Failed"));  // Thất bại
    }
  }, 2000);  // 2 giây
});

// Sử dụng Promise (cách cũ - .then/.catch)
promise
  .then(data => console.log("Success:", data))
  .catch(error => console.log("Error:", error));
```

##### B. Async/Await (Cách hiện đại - Dễ đọc hơn)

```javascript
// Hàm async tự động trả về Promise
async function fetchUser() {
  // await = "đợi Promise hoàn thành, nhưng không block code khác"
  const response = await fetch('https://api.example.com/user/1');
  const data = await response.json();
  return data;
}

// Sử dụng
async function main() {
  console.log("1. Bắt đầu");
  
  const user = await fetchUser();  // Đợi kết quả
  console.log("2. User:", user);
  
  console.log("3. Kết thúc");
}

main();
```

**Quy tắc:**
- Hàm có `async` → Tự động trả về Promise
- `await` chỉ dùng được trong hàm `async`
- `await` = "tạm dừng" hàm này, nhưng không block toàn bộ chương trình

---

#### 1.3. Error Handling với try/catch

```javascript
async function fetchUserSafe() {
  try {
    const response = await fetch('https://api.example.com/user/1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch:", error.message);
    return null;  // Trả về giá trị mặc định
  }
}
```

---

#### 1.4. Async/Await trong Next.js

**Server Component (Next.js):**

```jsx
// src/app/users/page.js
// Component này là async function!

async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();  // Fetch data trực tiếp!
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Điểm khác biệt với React thuần:**
- React thuần: Phải dùng `useEffect` + `useState`
- Next.js Server Component: Dùng `async/await` trực tiếp trong component

---

#### 1.5. Bài tập thực hành

**Bài 1:** Viết hàm `delay(ms)` trả về Promise chờ `ms` milliseconds:

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sử dụng
async function demo() {
  console.log("Bắt đầu");
  await delay(2000);  // Chờ 2 giây
  console.log("Sau 2 giây");
}
```

**Bài 2:** Fetch data từ API và xử lý lỗi:

```javascript
async function fetchPosts() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
    return posts.slice(0, 5);  // Lấy 5 posts đầu
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
```

---

### 2. HTTP & REST API Concepts ⭐⭐⭐

#### 2.0. Kiến thức nền tảng: JSON.stringify() và JSON.parse()

Trước khi làm việc với APIs, bạn cần hiểu cách chuyển đổi giữa JavaScript objects và JSON strings.

##### A. JSON là gì?

**JSON (JavaScript Object Notation)** là định dạng text để trao đổi dữ liệu giữa client và server.

**Mental Model:** JSON giống như "ngôn ngữ chung" mà cả JavaScript và server đều hiểu.

**Ví dụ:**

```javascript
// JavaScript Object (trong code)
const user = {
  name: "An",
  age: 25,
  hobbies: ["coding", "gaming"]
};

// JSON String (gửi qua mạng)
const jsonString = '{"name":"An","age":25,"hobbies":["coding","gaming"]}';
```

**Sự khác biệt:**

| JavaScript Object | JSON String |
|---|---|
| Dùng trong code | Gửi qua HTTP |
| Keys không có dấu ngoặc kép | Keys **phải** có dấu ngoặc kép |
| `{ name: "An" }` | `'{"name":"An"}'` |

---

##### B. JSON.stringify() - Object → String

**Mục đích:** Chuyển JavaScript object thành JSON string để gửi lên server.

```javascript
const user = {
  name: "An",
  age: 25,
  isActive: true
};

// Chuyển object → JSON string
const jsonString = JSON.stringify(user);
console.log(jsonString);
// Output: '{"name":"An","age":25,"isActive":true}'

console.log(typeof jsonString);  // "string"
```

**Khi nào dùng?**
- ✅ Gửi data lên server qua `fetch()` (POST, PATCH)
- ✅ Lưu data vào `localStorage`
- ✅ Debug (xem cấu trúc object)

**Ví dụ thực tế:**

```javascript
// Gửi data lên server
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: "An", age: 25 })  // ← Object → String
});
```

---

##### C. JSON.parse() - String → Object

**Mục đích:** Chuyển JSON string (từ server) thành JavaScript object để dùng trong code.

```javascript
const jsonString = '{"name":"An","age":25}';

// Chuyển JSON string → object
const user = JSON.parse(jsonString);
console.log(user.name);  // "An"
console.log(user.age);   // 25

console.log(typeof user);  // "object"
```

**Khi nào dùng?**
- ✅ Nhận data từ server (response.json() tự động gọi JSON.parse())
- ✅ Đọc data từ `localStorage`
- ✅ Parse JSON string từ bất kỳ nguồn nào

**Ví dụ thực tế:**

```javascript
// Fetch data từ server
const response = await fetch('https://api.example.com/users/1');
const jsonString = await response.text();  // Lấy raw string
const user = JSON.parse(jsonString);       // String → Object

// Hoặc dùng shortcut (Next.js/React thường dùng):
const user = await response.json();  // Tự động parse!
```

---

##### D. Lỗi thường gặp

**❌ Lỗi 1: Stringify một object đã là string**

```javascript
const user = '{"name":"An"}';  // Đã là string rồi
const result = JSON.stringify(user);
console.log(result);  // '"{\\"name\\":\\"An\\"}"' ← Sai! String lồng string
```

**✅ Sửa:** Chỉ stringify object, không stringify string.

---

**❌ Lỗi 2: Parse một object (không phải string)**

```javascript
const user = { name: "An" };  // Đã là object rồi
const result = JSON.parse(user);  // ❌ Error: Unexpected token o in JSON
```

**✅ Sửa:** Chỉ parse string, không parse object.

---

**❌ Lỗi 3: Parse JSON không hợp lệ**

```javascript
const invalidJson = "{name: 'An'}";  // ❌ Keys không có dấu ngoặc kép
const result = JSON.parse(invalidJson);  // ❌ Error: Unexpected token n
```

**✅ Sửa:** Đảm bảo JSON string hợp lệ (keys phải có dấu ngoặc kép).

---

##### E. Bảng tóm tắt

| Hàm | Input | Output | Khi nào dùng? |
|---|---|---|---|
| **`JSON.stringify()`** | JavaScript Object | JSON String | Gửi data lên server |
| **`JSON.parse()`** | JSON String | JavaScript Object | Nhận data từ server |

**Quy tắc vàng:**
- Gửi data → `JSON.stringify()`
- Nhận data → `JSON.parse()` (hoặc `response.json()`)

---

#### 2.1. HTTP Methods (CRUD Operations)

| Method | Mục đích | Ví dụ | Có body? |
|---|---|---|---|
| **GET** | Lấy dữ liệu | Xem danh sách users | ❌ Không |
| **POST** | Tạo mới | Tạo user mới | ✅ Có |
| **PUT** | Cập nhật toàn bộ | Sửa toàn bộ thông tin user | ✅ Có |
| **PATCH** | Cập nhật một phần | Chỉ sửa tên user | ✅ Có |
| **DELETE** | Xóa | Xóa user | ❌ Không |

#### 2.2. Fetch API - Các ví dụ thực tế

##### A. GET - Lấy dữ liệu

```javascript
// Lấy danh sách users
async function getUsers() {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();
  return users;
}

// Lấy 1 user cụ thể
async function getUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();
  return user;
}
```

##### B. POST - Tạo mới

```javascript
async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),  // Chuyển object → JSON string
  });
  
  const newUser = await response.json();
  return newUser;
}

// Sử dụng
const user = await createUser({ name: 'An', email: 'an@example.com' });
```

##### C. PATCH - Cập nhật

```javascript
async function updateUser(id, updates) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  return response.json();
}

// Sử dụng
await updateUser(1, { name: 'Bình' });  // Chỉ sửa tên
```

##### D. DELETE - Xóa

```javascript
async function deleteUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'DELETE',
  });
  
  return response.ok;  // true nếu thành công
}
```

---

#### 2.3. HTTP Status Codes

| Code | Ý nghĩa | Khi nào xảy ra? |
|---|---|---|
| **200** | OK | Request thành công |
| **201** | Created | Tạo mới thành công (POST) |
| **204** | No Content | Xóa thành công (DELETE) |
| **400** | Bad Request | Dữ liệu gửi lên sai format |
| **401** | Unauthorized | Chưa đăng nhập |
| **403** | Forbidden | Không có quyền truy cập |
| **404** | Not Found | Không tìm thấy resource |
| **500** | Server Error | Lỗi server |

**Kiểm tra status code:**

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Không tìm thấy dữ liệu');
    } else if (response.status === 401) {
      throw new Error('Vui lòng đăng nhập');
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  }
  
  return response.json();
}
```

---

#### 2.4. Headers (Request & Response)

**Request Headers** - Gửi lên server:

```javascript
fetch('https://api.example.com/data', {
  headers: {
    'Content-Type': 'application/json',      // Loại dữ liệu gửi đi
    'Authorization': 'Bearer token123',      // Token xác thực
    'Accept-Language': 'vi-VN',              // Ngôn ngữ mong muốn
  }
})
```

**Response Headers** - Server trả về:

```javascript
const response = await fetch('https://api.example.com/data');

console.log(response.headers.get('Content-Type'));  // "application/json"
console.log(response.headers.get('Cache-Control')); // "max-age=3600"
```

---

#### 2.5. Next.js API Routes

Next.js cho phép tạo API endpoints ngay trong project:

```javascript
// src/app/api/users/route.js

export async function GET(request) {
  // Lấy query params: /api/users?page=2
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  
  const users = [
    { id: 1, name: 'An' },
    { id: 2, name: 'Bình' },
  ];
  
  return Response.json({ users, page });
}

export async function POST(request) {
  const body = await request.json();  // Parse JSON body
  
  // Validate
  if (!body.name) {
    return Response.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }
  
  // Lưu vào database (giả lập)
  const newUser = { id: Date.now(), ...body };
  
  return Response.json(newUser, { status: 201 });
}
```

---

### 3. Environment Variables (Biến môi trường)

#### 3.1. Tại sao cần Environment Variables?

**Vấn đề:** Bạn có những thông tin nhạy cảm không nên commit lên Git:
- API keys
- Database passwords
- Secret tokens

**Giải pháp:** Lưu vào file `.env.local` (file này được Git ignore).

---

#### 3.2. Cách sử dụng trong Next.js

**Tạo file `.env.local`:**

```bash
# .env.local (ở root project)

# Server-only variables (chỉ dùng ở server)
DATABASE_URL=postgres://user:pass@localhost/mydb
API_SECRET_KEY=super-secret-key-123

# Client-accessible variables (dùng được ở browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_NAME=My App
```

**Quy tắc quan trọng:**
- Biến **KHÔNG** có prefix `NEXT_PUBLIC_` → Chỉ dùng được ở **server**
- Biến **CÓ** prefix `NEXT_PUBLIC_` → Dùng được ở **cả server và client**

---

#### 3.3. Sử dụng trong code

**Server Component / API Route:**

```javascript
// src/app/api/data/route.js

export async function GET() {
  // ✅ OK - Chạy trên server
  const dbUrl = process.env.DATABASE_URL;
  const apiKey = process.env.API_SECRET_KEY;
  
  // Kết nối database, gọi API...
  
  return Response.json({ success: true });
}
```

**Client Component:**

```javascript
// src/components/Header.js
'use client';

export default function Header() {
  // ✅ OK - Có NEXT_PUBLIC_
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // ❌ undefined - Không có NEXT_PUBLIC_
  const dbUrl = process.env.DATABASE_URL;  // undefined!
  
  return <h1>{siteName}</h1>;
}
```

---

#### 3.4. Các file .env khác nhau

| File | Khi nào dùng? | Commit lên Git? |
|---|---|---|
| `.env.local` | Development (local machine) | ❌ Không |
| `.env.development` | Development (shared settings) | ✅ Có thể |
| `.env.production` | Production (Vercel tự động dùng) | ❌ Không |
| `.env` | Default cho tất cả môi trường | ✅ Có thể |

**Thứ tự ưu tiên:** `.env.local` > `.env.development` > `.env`

---

#### 3.5. Bảo mật

**❌ KHÔNG BAO GIỜ:**
- Commit `.env.local` lên Git
- Để API keys trong code
- Dùng `NEXT_PUBLIC_` cho thông tin nhạy cảm

**✅ NÊN:**
- Thêm `.env*.local` vào `.gitignore`
- Dùng Vercel Environment Variables cho production
- Document các biến cần thiết trong README

---

### 4. JavaScript ES6+ Features

#### 4.1. Optional Chaining (`?.`)

**Vấn đề:** Truy cập nested properties có thể gây lỗi nếu object null/undefined.

```javascript
// ❌ Lỗi nếu user null
const name = user.profile.name;  // TypeError: Cannot read property 'profile' of null

// ✅ Cách cũ - Kiểm tra từng cấp
const name = user && user.profile && user.profile.name;

// ✅ Cách mới - Optional chaining
const name = user?.profile?.name;  // undefined nếu user hoặc profile null
```

**Trong Next.js:**

```jsx
export default function UserProfile({ user }) {
  return (
    <div>
      <h1>{user?.name ?? 'Guest'}</h1>
      <p>{user?.profile?.bio ?? 'No bio'}</p>
      <img src={user?.avatar?.url ?? '/default.png'} />
    </div>
  );
}
```

---

#### 4.2. Nullish Coalescing (`??`)

**Khác biệt với `||`:**

```javascript
const value1 = 0;
const value2 = '';
const value3 = null;

// || - Coi 0, '', false là "falsy" → Dùng default
console.log(value1 || 10);  // 10 (vì 0 là falsy)
console.log(value2 || 'default');  // 'default' (vì '' là falsy)

// ?? - Chỉ coi null/undefined là "nullish" → Dùng default
console.log(value1 ?? 10);  // 0 (vì 0 không phải null/undefined)
console.log(value2 ?? 'default');  // '' (vì '' không phải null/undefined)
console.log(value3 ?? 'default');  // 'default' (vì null)
```

**Khi nào dùng `??`:**
- Khi `0`, `''`, `false` là giá trị hợp lệ
- Chỉ muốn fallback khi `null` hoặc `undefined`

---

#### 4.3. Dynamic Imports

**Vấn đề:** Import tất cả components → Bundle size lớn.

**Giải pháp:** Chỉ load component khi cần (Code Splitting).

```javascript
// src/app/page.js
import dynamic from 'next/dynamic';

// Component nặng chỉ load khi cần
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Đang tải biểu đồ...</p>,
  ssr: false,  // Không render trên server (nếu dùng browser APIs)
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />  {/* Chỉ load khi component này render */}
    </div>
  );
}
```

---

### 5. Tóm tắt: Checklist kiến thức

Trước khi học Next.js, hãy chắc chắn bạn hiểu:

**JavaScript:**
- ✅ Async/Await và Promises
- ✅ `try/catch` error handling
- ✅ Optional chaining (`?.`)
- ✅ Nullish coalescing (`??`)

**HTTP/API:**
- ✅ HTTP methods (GET, POST, PUT, DELETE)
- ✅ Fetch API
- ✅ Request/Response headers
- ✅ Status codes (200, 404, 500, etc.)

**Next.js Specific:**
- ✅ Environment variables (`.env.local`, `NEXT_PUBLIC_`)
- ✅ Server vs Client concepts
- ✅ File-based routing

---

### 6. Lộ trình học đề xuất

**Tuần 1: JavaScript Async (Quan trọng nhất!)**
1. Học Promise basics (1 ngày)
2. Học Async/Await (2 ngày)
3. Thực hành fetch API (2 ngày)

**Tuần 2: HTTP & APIs**
1. Hiểu REST API (1 ngày)
2. Thực hành CRUD với fetch (2 ngày)
3. Học về headers, status codes (1 ngày)

**Tuần 3: Next.js Basics**
1. Setup project, hiểu cấu trúc (1 ngày)
2. Server vs Client Components (2 ngày)
3. File-based routing (2 ngày)

**Tuần 4: Practice**
1. Build một blog app đơn giản
2. Fetch data từ API
3. Tạo API routes
4. Deploy lên Vercel

---

### 7. Tài nguyên học tập

**JavaScript Async:**
- [JavaScript.info - Async/Await](https://javascript.info/async-await) ⭐
- [MDN - Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

**HTTP/REST API:**
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://httpstatuses.com/)

**Next.js:**
- [Next.js Learn Course](https://nextjs.org/learn) ⭐ **Bắt đầu từ đây!**
- [Next.js Docs](https://nextjs.org/docs)

---

### 8. Kết luận

**Bạn đã có từ React (70%):**
- ✅ Components, JSX, Props, State
- ✅ Hooks (useState, useEffect, useContext)
- ✅ Event handling, Forms, Lists

**Bạn cần bổ sung (30%):**
- 🎯 **Async/Await** (Quan trọng nhất!)
- 🎯 HTTP/REST API concepts
- 🎯 Environment variables
- 🎯 Server vs Client thinking

**Thời gian ước tính:** 3-4 tuần học part-time (2-3 giờ/ngày)

**Lời khuyên cuối:** Đừng cố học hết lý thuyết. Sau khi hiểu async/await và fetch API, hãy **bắt đầu build một project Next.js nhỏ ngay**. Learning by doing là cách nhanh nhất! 🚀

---


## PHẦN 9: CHIẾN LƯỢC DEPLOY REACT TRÊN CHEAP HOSTING

### Giới thiệu: React trên hosting giá rẻ như WordPress?

**Câu hỏi phổ biến:** "Tôi đã quen với WordPress hosting giá rẻ (shared hosting). Liệu có thể deploy React/Next.js mà không cần mua VPS đắt đỏ?"

**Câu trả lời:** **CÓ!** Nhưng bạn cần hiểu sự khác biệt giữa các chiến lược deploy.

**Mental Model:**
- **WordPress truyền thống:** Server chạy PHP + MySQL → Tạo HTML mỗi request → Gửi về browser
- **React hiện đại:** Nhiều cách khác nhau, từ "hoàn toàn tĩnh" (như WordPress + cache) đến "hybrid" (tĩnh + dynamic)

**Mục tiêu của phần này:**
- ✅ Deploy React/Next.js trên hosting giá rẻ (shared hosting, static hosting)
- ✅ Dùng công nghệ hiện đại nhưng chi phí thấp
- ✅ Hiểu trade-offs giữa các phương pháp

---

### Tổng quan: 2 Hướng tiếp cận chính

| Công nghệ | Phương pháp | Chi phí | Độ phức tạp |
|-----------|-------------|---------|-------------|
| **1. Next.js** | Monorepo (SSG + SSR) | Trung bình - Cao | Cao |
| **2. Vite + React** | Static-first (SSG/SPA) | Rất thấp | Thấp - Trung bình |

---

## 1. Next.js: Monorepo Approach

### Ý tưởng

Chia ứng dụng thành **2 phần** trong cùng một monorepo:

1. **Phần SSG (Static Site Generation):** Deploy lên cheap hosting
2. **Phần SSR (Server-Side Rendering):** Chạy local hoặc VPS nhỏ, kết nối database

**Mental Model:** Giống như có 2 website:
- Website tĩnh (marketing, blog) → Hosting giá rẻ
- API/Admin backend → Server riêng (có thể là máy tính cá nhân)

---

### Cấu trúc Monorepo

```
my-project/
├── apps/
│   ├── public-site/        # Next.js SSG → Deploy lên cheap hosting
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── page.js           # Trang chủ (SSG)
│   │   │       ├── about/page.js     # Về chúng tôi (SSG)
│   │   │       └── blog/
│   │   │           └── [slug]/page.js # Blog posts (SSG)
│   │   └── next.config.js
│   │       # output: 'export' → Tạo static files
│   │
│   └── admin-api/          # Next.js SSR → Chạy local/VPS
│       ├── src/
│       │   └── app/
│       │       ├── api/
│       │       │   ├── posts/route.js    # API CRUD posts
│       │       │   └── products/route.js # API CRUD products
│       │       └── admin/
│       │           └── page.js           # Admin dashboard (SSR)
│       └── next.config.js
│           # Không có output: 'export' → Chạy như server
│
├── packages/               # Shared code
│   └── database/          # Database models, queries
│       └── prisma/
│
└── package.json
```

---

### Workflow: Cập nhật nội dung

**Kịch bản:** Bạn muốn thêm bài blog mới.

```
1. Mở admin dashboard (local: http://localhost:3001/admin)
   ↓
2. Viết bài blog mới → Lưu vào database (MongoDB/PostgreSQL)
   ↓
3. Rebuild public-site:
   cd apps/public-site
   npm run build  # Fetch data từ DB → Tạo static HTML
   ↓
4. Upload static files lên cheap hosting:
   rsync -avz out/ user@cheaphost.com:/public_html/
   ↓
5. Website cập nhật với bài blog mới!
```

**Timeline:**

```
User viết bài → Lưu DB (1s) → Build static (30s) → Upload (1 phút) → Live (tổng ~2 phút)
```

---

### Ưu/Nhược điểm

**✅ Ưu điểm:**
- Public site cực nhanh (static files)
- Chi phí thấp cho phần public (shared hosting ~$5/tháng)
- SEO tuyệt vời (HTML tĩnh)
- Bảo mật tốt (admin không public)

**❌ Nhược điểm:**
- Cần rebuild + redeploy mỗi lần cập nhật nội dung
- Phức tạp hơn (2 apps, monorepo setup)
- Cần server riêng cho admin (có thể là máy tính cá nhân)

**Khi nào dùng:**
- ✅ Blog, marketing site với nội dung không đổi thường xuyên
- ✅ Bạn OK với việc rebuild khi cập nhật
- ✅ Muốn performance tối đa + chi phí thấp

---

### Code Example: Public Site (SSG)

```javascript
// apps/public-site/src/app/blog/[slug]/page.js

import { db } from '@my-project/database';

// Tạo static paths cho tất cả blog posts lúc build time
export async function generateStaticParams() {
  const posts = await db.post.findMany();
  return posts.map(post => ({ slug: post.slug }));
}

// Fetch data cho mỗi post lúc build time
export default async function BlogPost({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  });
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

```javascript
// apps/public-site/next.config.js

module.exports = {
  output: 'export',  // ← Tạo static files thay vì server
  images: {
    unoptimized: true  // Static hosting không hỗ trợ Image Optimization
  }
};
```

**Kết quả build:**

```
apps/public-site/out/
├── index.html              # Trang chủ
├── about.html              # Về chúng tôi
├── blog/
│   ├── first-post.html     # Blog post 1
│   ├── second-post.html    # Blog post 2
│   └── ...
└── _next/                  # JS/CSS assets
```

---

### Code Example: Admin API (SSR)

```javascript
// apps/admin-api/src/app/api/posts/route.js

import { db } from '@my-project/database';

// API để tạo post mới
export async function POST(request) {
  const { title, content, slug } = await request.json();
  
  const post = await db.post.create({
    data: { title, content, slug }
  });
  
  return Response.json({ success: true, post });
}

// API để lấy tất cả posts
export async function GET() {
  const posts = await db.post.findMany();
  return Response.json(posts);
}
```

```javascript
// apps/admin-api/src/app/admin/page.js
'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, slug: slugify(title) })
    });
    
    alert('Post created! Now rebuild public-site.');
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## 2. Vite + React: Static-First Approach

### Tổng quan

Với **Vite + React**, bạn có 3 chiến lược chính:

```
A) Build-time static (SSG/export)
   ├── A1: Static SPA (Single Page App)
   └── A2: True SSG / Prerender (nhiều HTML files)

B) Static frontend + Supabase (Backend-as-a-Service)

C) Static frontend + Custom API + MongoDB Atlas
```

---

### A) Build-time Static (SSG/Export)

**Ý tưởng:** Tạo static files (HTML/JS/CSS) → Upload lên cheap hosting.

**Workflow:**

```
1. Edit content locally (hoặc trong local admin)
   ↓
2. Build/export → Tạo static files
   ↓
3. Upload lên cheap hosting
   ↓
4. Nội dung live cố định cho đến khi rebuild
   (Update = Rebuild + Redeploy)
```

**Mental Model:**
- Giống như xuất bản sách: In xong thì nội dung cố định, muốn sửa phải in lại.

---

### A1 — Static SPA (Single Page App)

**Đặc điểm:**
- **1 file HTML duy nhất** (`index.html`)
- React xây dựng "pages" trong browser
- Routing: client-side (React Router)

**Cấu trúc sau khi build:**

```
dist/
├── index.html          # ← Chỉ 1 file HTML
├── assets/
│   ├── index-abc123.js   # React bundle
│   └── index-def456.css
└── images/
```

**Cách hoạt động:**

```
1. Browser tải index.html (rất nhỏ, ~1KB)
   ↓
2. Browser tải JS bundle (~200KB)
   ↓
3. React chạy và render mọi thứ (home, products, product detail...) trong browser
   ↓
4. User click link → React Router thay đổi component (không reload trang)
```

**Routing:**
- Client-side (React Router)
- Nếu user mở `/products/abc` trực tiếp, server phải redirect về `index.html` hoặc sẽ 404

**SEO:**
- ❌ Yếu hơn (Google có thể handle một số, nhưng không mạnh bằng HTML-per-page)

**Khi nào dùng:**
- ✅ Dashboards, internal tools
- ✅ Simple brochure sites không cần SEO mạnh
- ✅ Apps cần interactivity cao

---

#### Code Example: Vite SPA

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Không cần config đặc biệt, mặc định là SPA
});
```

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  </BrowserRouter>
);
```

**Build:**

```bash
npm run build
# → Tạo dist/ với 1 index.html + assets
```

**Upload lên hosting:**

```bash
# Cấu hình .htaccess cho Apache (shared hosting)
# Redirect tất cả requests về index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### A2 — True SSG / Prerender (Nhiều HTML files)

**Đặc điểm:**
- **Nhiều HTML files**, mỗi route = 1 HTML file
- HTML đã chứa nội dung (product title, description, etc.)
- JS load sau và "hydrate" (thêm interactivity)

**Cấu trúc sau khi build:**

```
dist/
├── index.html                    # Trang chủ
├── products/
│   ├── index.html                # /products
│   └── abc/
│       └── index.html            # /products/abc
├── about/
│   └── index.html                # /about
└── assets/
    ├── index-abc123.js
    └── index-def456.css
```

**Cách hoạt động:**

```
1. Browser tải HTML page đã có nội dung (product title, description...)
   ↓
2. User thấy nội dung ngay lập tức
   ↓
3. JS load sau và hydrate (thêm event handlers, interactivity)
```

**Routing:**
- Server serve real files cho mỗi route
- Deep links hoạt động tự nhiên (`/products/abc` → `products/abc/index.html`)

**SEO:**
- ✅ Mạnh (search engines thấy real HTML ngay lập tức)

**Khi nào dùng:**
- ✅ Product catalogs, blogs, marketing sites
- ✅ SEO quan trọng
- ✅ Nội dung không đổi thường xuyên

---

#### Code Example: Vite SSG với vite-plugin-ssr

```bash
npm install vite-plugin-ssr
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig({
  plugins: [react(), ssr()]
});
```

```jsx
// pages/products/@id/+Page.jsx
export { Page };

function Page({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

```javascript
// pages/products/@id/+data.js
export { data };

async function data(pageContext) {
  const { id } = pageContext.routeParams;
  
  // Fetch data lúc build time
  const product = await fetchProduct(id);
  
  return { product };
}

// Tạo static paths cho tất cả products
export async function prerender() {
  const products = await fetchAllProducts();
  
  return products.map(p => `/products/${p.id}`);
}
```

**Build:**

```bash
npm run build
# → Tạo dist/ với nhiều HTML files
```

**Kiểm tra:**

```bash
ls dist/
# index.html
# products/
#   index.html
#   abc/
#     index.html
#   xyz/
#     index.html
```

---

### Cách phân biệt A1 vs A2

**Test đơn giản:** Nhìn vào folder `dist/` sau khi build:

```
Nếu chỉ thấy 1 HTML → A1 (SPA)
Nếu thấy nhiều HTML files/folders → A2 (SSG/Prerender)
```

**So sánh:**

| Tiêu chí | A1 (SPA) | A2 (SSG) |
|----------|----------|----------|
| **Số file HTML** | 1 file | Nhiều files |
| **Nội dung trong HTML** | Rỗng (chỉ `<div id="root">`) | Đầy đủ (title, text, etc.) |
| **SEO** | Yếu | Mạnh |
| **Deep links** | Cần config server | Hoạt động tự nhiên |
| **Build time** | Nhanh | Chậm hơn (tạo nhiều HTML) |

---

### B) Static Frontend + Supabase

**Ý tưởng:**
- Frontend vẫn là static (A1 hoặc A2)
- Data + Auth được xử lý bởi **Supabase** (Backend-as-a-Service)

**Supabase cung cấp:**
- ✅ PostgreSQL database (hosted)
- ✅ Authentication (login, signup, OAuth)
- ✅ Real-time subscriptions
- ✅ Storage (file uploads)
- ✅ Auto-generated REST APIs

**Workflow:**

```
1. Build static frontend → Upload lên cheap hosting
   ↓
2. Frontend fetch data từ Supabase APIs
   ↓
3. Nội dung live có thể thay đổi ngay khi DB thay đổi
   (KHÔNG cần rebuild frontend!)
```

**Mental Model:**
- Frontend = Giao diện cửa hàng (tĩnh, không đổi)
- Supabase = Kho hàng + nhân viên (data động, thay đổi liên tục)

---

#### Code Example: Vite + Supabase

```bash
npm install @supabase/supabase-js
```

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

```jsx
// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*');
      
      setProducts(data);
    }
    
    fetchProducts();
  }, []);
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**Ưu điểm:**
- ✅ Nội dung cập nhật real-time (không cần rebuild)
- ✅ Không cần quản lý server/database
- ✅ Authentication built-in
- ✅ Chi phí thấp (Supabase free tier rộng rãi)

**Nhược điểm:**
- ❌ SEO yếu hơn (data fetch ở client)
- ❌ Phụ thuộc vào Supabase (vendor lock-in)

**Khi nào dùng:**
- ✅ Apps cần real-time data
- ✅ Không muốn quản lý backend
- ✅ SEO không quan trọng lắm

---

### C) Static Frontend + Custom API + MongoDB Atlas

**Ý tưởng:**
- Frontend vẫn là static
- Bạn tự xây dựng backend API (Node.js/Express, serverless functions)
- Database: MongoDB Atlas (hoặc PostgreSQL, MySQL hosted)

**Kiến trúc:**

```
┌─────────────────┐
│ Static Frontend │ → Hosted trên cheap hosting ($5/tháng)
│ (Vite + React)  │
└────────┬────────┘
         │ Fetch data qua API
         ↓
┌─────────────────┐
│   Your API      │ → Hosted trên Vercel/Railway/Render (free tier)
│ (Node.js/Next)  │    hoặc VPS nhỏ ($5/tháng)
└────────┬────────┘
         │ Query database
         ↓
┌─────────────────┐
│ MongoDB Atlas   │ → Free tier (512MB)
│   (Database)    │
└─────────────────┘
```

**Workflow:**

```
1. Build static frontend → Upload lên cheap hosting
   ↓
2. Deploy API lên serverless platform (Vercel, Railway) hoặc VPS
   ↓
3. Frontend fetch data từ API của bạn
   ↓
4. API query MongoDB Atlas → Trả về JSON
   ↓
5. Nội dung live cập nhật khi DB thay đổi (không cần rebuild frontend)
```

---

#### Code Example: API với Next.js API Routes

```javascript
// api-server/src/app/api/products/route.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET() {
  await client.connect();
  const db = client.db('mystore');
  const products = await db.collection('products').find({}).toArray();
  
  return Response.json(products);
}

export async function POST(request) {
  const { name, price } = await request.json();
  
  await client.connect();
  const db = client.db('mystore');
  const result = await db.collection('products').insertOne({ name, price });
  
  return Response.json({ success: true, id: result.insertedId });
}
```

**Frontend fetch data:**

```jsx
// frontend/src/pages/Products.jsx
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('https://your-api.vercel.app/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p._id}>
          <h2>{p.name}</h2>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**Ưu điểm:**
- ✅ Kiểm soát hoàn toàn backend
- ✅ Không vendor lock-in
- ✅ Có thể implement auth/permissions tùy chỉnh
- ✅ Chi phí thấp (free tiers + cheap hosting)

**Nhược điểm:**
- ❌ Phải tự quản lý API + database
- ❌ Phức tạp hơn Supabase
- ❌ SEO yếu hơn (data fetch ở client)

**Khi nào dùng:**
- ✅ Muốn kiểm soát hoàn toàn
- ✅ Có kinh nghiệm backend
- ✅ Cần logic phức tạp không có sẵn trong Supabase

---

## So sánh tổng hợp các phương pháp

| Phương pháp | Chi phí | SEO | Real-time Update | Độ phức tạp | Khi nào dùng |
|-------------|---------|-----|------------------|-------------|--------------|
| **Next.js Monorepo (SSG + SSR)** | Trung bình | ⭐⭐⭐⭐⭐ | ❌ (Cần rebuild) | Cao | Blog, marketing site, content ít đổi |
| **Vite SPA (A1)** | Rất thấp | ⭐⭐ | ❌ | Thấp | Dashboards, internal tools |
| **Vite SSG (A2)** | Rất thấp | ⭐⭐⭐⭐⭐ | ❌ (Cần rebuild) | Trung bình | Product catalogs, blogs |
| **Static + Supabase (B)** | Thấp | ⭐⭐⭐ | ✅ | Thấp | Apps cần real-time, không muốn quản lý backend |
| **Static + Custom API (C)** | Thấp | ⭐⭐⭐ | ✅ | Trung bình | Muốn kiểm soát hoàn toàn, logic phức tạp |

---

## Khuyến nghị theo Use Case

### 1. Blog cá nhân / Portfolio

**Phương pháp:** Vite SSG (A2) hoặc Next.js SSG

**Lý do:**
- Nội dung ít thay đổi
- SEO quan trọng
- Chi phí cực thấp (~$5/tháng)

**Hosting:** Netlify, Vercel (free tier), hoặc shared hosting

---

### 2. E-commerce nhỏ (< 100 sản phẩm)

**Phương pháp:** Next.js Monorepo hoặc Vite SSG + Supabase

**Lý do:**
- Cần SEO cho product pages
- Giá/stock có thể cập nhật qua admin
- Chi phí thấp

**Hosting:**
- Frontend: Netlify/Vercel (free)
- Admin/API: Vercel (free tier) hoặc VPS nhỏ

---

### 3. Dashboard / Internal Tool

**Phương pháp:** Vite SPA (A1) + Supabase

**Lý do:**
- Không cần SEO
- Cần real-time data
- Nhanh chóng setup

**Hosting:** Netlify/Vercel (free tier)

---

### 4. Social Media / Real-time App

**Phương pháp:** Vite SPA + Custom API + MongoDB Atlas

**Lý do:**
- Cần real-time updates
- Logic phức tạp (chat, notifications)
- Kiểm soát hoàn toàn

**Hosting:**
- Frontend: Netlify (free)
- API: Railway/Render (free tier) hoặc VPS
- DB: MongoDB Atlas (free 512MB)

---

## Tóm tắt

**Quy tắc vàng:**

1. **Cần SEO mạnh + nội dung ít đổi?** → SSG (Next.js hoặc Vite A2)
2. **Cần real-time data + không muốn quản lý backend?** → Static + Supabase
3. **Cần kiểm soát hoàn toàn + logic phức tạp?** → Static + Custom API
4. **Internal tool, không cần SEO?** → SPA (Vite A1)

**Chi phí tổng:**
- Tối thiểu: **$0** (Netlify + Supabase free tiers)
- Tối đa: **$10-20/tháng** (Shared hosting + VPS nhỏ)

**So với WordPress:**
- WordPress: ~$5-10/tháng (hosting + domain)
- React modern: ~$0-20/tháng (tùy phương pháp)

**Kết luận:** Bạn hoàn toàn có thể deploy React/Next.js với chi phí tương đương hoặc thấp hơn WordPress, nhưng với hiệu suất và trải nghiệm người dùng tốt hơn nhiều! 🚀

---
The Bridge (ORM): In Mongo, you likely use Mongoose. In the Postgres world, Prisma or Drizzle are the gold standards. They give you full TypeScript safety, so your IDE knows exactly what your database looks like.

Postgres



## PHẦN KẾT: TỪ HỌC GIẢ ĐẾN KỸ SƯ

Chúc mừng bạn! Chúng ta đã đi từ những viên gạch cơ bản nhất (Element Object) đến kiến trúc một ứng dụng hoàn chỉnh.

_Hết tài liệu._