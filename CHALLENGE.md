#  thách thức: Hackémon - The Case of the Stolen Pokédex

**Thể loại:** Web, SQL Injection  
**Tác giả:** Professor Oak (với sự trợ giúp từ Cascade)

---

### Báo cáo tình báo

Xin chào các huấn luyện viên! 

Một thảm họa đã xảy ra! Team Rocket khét tiếng đã xâm nhập vào phòng thí nghiệm của tôi và đánh cắp nguyên mẫu cho Pokédex kỹ thuật số mới của tôi. Họ đã khóa nó bằng một hệ thống tìm kiếm rẻ tiền, nhưng tôi nghi ngờ mã của họ cũng cẩu thả như mọi khi. 

Nhiệm vụ của bạn, nếu bạn chọn chấp nhận nó, là xâm nhập vào hệ thống của họ và lấy lại dữ liệu của tôi. Tôi đã giấu một lá cờ bí mật bên trong một mục "Pokémon" đặc biệt như một biện pháp an toàn. Nếu bạn có thể tìm thấy nó, bạn sẽ chứng minh được kỹ năng của mình và làm thất bại kế hoạch của Team Rocket!

### Mục tiêu

1.  Phân tích chức năng tìm kiếm của Pokédex bị xâm nhập.
2.  Tìm và khai thác lỗ hổng SQL Injection để bỏ qua cơ chế tìm kiếm.
3.  Truy xuất lá cờ ẩn trong cơ sở dữ liệu. Lá cờ có định dạng `CTF{...}`.

### Gợi ý

*   Team Rocket đã để lại một vài mồi nhử. Đừng để bị lừa bởi những lá cờ giả!
*   Hãy thử nhập các ký tự đặc biệt (`'`, `"`, `;`, `--`) vào thanh tìm kiếm để xem hệ thống phản ứng như thế nào.
*   Hãy suy nghĩ về cách bạn có thể thao tác câu lệnh SQL `SELECT` để trả về nhiều hơn những gì nó dự định.

Chúc may mắn, các huấn luyện viên! Tương lai của nghiên cứu Pokémon nằm trong tay bạn.

--- 

### Giải pháp dự kiến

Người tham gia cần tạo một chuỗi đầu vào để thao tác truy vấn SQL ở phần backend.

Truy vấn dễ bị tấn công là: `SELECT * FROM pokemon WHERE name = '[INPUT]';`

Một tải trọng thành công sẽ giống như sau:

```sql
' OR 1=1 --
```

Hoặc, để nhắm mục tiêu cụ thể hơn vào lá cờ:

```sql
' UNION SELECT * FROM pokemon WHERE name = 'flag' --
```

Thao tác này sẽ khiến cơ sở dữ liệu trả về tất cả các mục, bao gồm cả mục `flag` thực sự, tiết lộ `CTF{gotta_catch_all_the_queries}`.
