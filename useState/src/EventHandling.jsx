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
function EventHandling() {

  const handleDelete = () => {
    alert("Đang xóa dữ liệu...");
  };

  const handleSave = () => {
    alert("Đã lưu thành công!");
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

export default EventHandling;
