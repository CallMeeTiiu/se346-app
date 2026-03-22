export const sampleProfile = [
  {
    id: "u1",
    username: "student1",
    password: "password", // demo only
    name: "Student One",
    email: "student1@example.com",
  },
  {
    id: "u2",
    username: "student2",
    password: "password", // demo only
    name: "Student Two",
    email: "student2@example.com",
  },
];

export const samplePosts = [
  {
    id: "p1",
    authorId: "u2",
    title: "Lỡ hẹn với người yêu cũ, tôi đã làm gì? (Demo Post 1)",
    body: "Tôi đã từng có một mối tình đẹp với người yêu cũ, nhưng vì một số lý do mà chúng tôi đã phải chia tay. Sau khi chia tay, tôi đã trải qua một khoảng thời gian khó khăn và cảm thấy rất đau khổ. Tuy nhiên, thay vì chìm đắm trong nỗi buồn, tôi đã quyết định tập trung vào bản thân và phát triển sự nghiệp của mình. Tôi đã học hỏi thêm nhiều kỹ năng mới, tham gia các hoạt động xã hội và kết bạn với những người mới. Dần dần, tôi đã tìm thấy niềm vui và hạnh phúc trong cuộc sống mà không cần phải dựa vào người yêu cũ nữa.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    authorId: "u2",
    title: "Những bài học tôi rút ra sau khi chia tay (Demo Post 2)",
    body: "Bước qua một cuộc chia tay không bao giờ là dễ dàng, nhưng nó đã dạy tôi rất nhiều bài học quý giá về tình yêu và cuộc sống. Đầu tiên, tôi nhận ra rằng không phải mọi mối quan hệ đều có thể kéo dài mãi mãi, và đôi khi chia tay là điều tốt nhất cho cả hai bên. Thứ hai, tôi học được cách yêu thương bản thân mình hơn và không đặt quá nhiều kỳ vọng vào người khác để hạnh phúc. Cuối cùng, tôi hiểu rằng thời gian sẽ chữa lành mọi vết thương, và dù có đau đớn đến đâu thì cũng sẽ có ngày tôi có thể nhìn lại và cười với những kỷ niệm đó.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    authorId: "u2",
    title: "Hành trình tìm lại chính mình sau chia tay (Demo Post 3)",
    body: "Giữa những ngày tháng sau khi chia tay, tôi đã cảm thấy lạc lõng và mất phương hướng. Tuy nhiên, tôi đã quyết định không để nỗi buồn chiếm lấy cuộc sống của mình. Tôi bắt đầu tham gia vào các hoạt động mà trước đây tôi chưa từng thử, như học một môn thể thao mới, tham gia các lớp học nghệ thuật và thậm chí là đi du lịch một mình. Qua những trải nghiệm đó, tôi đã dần tìm lại được chính mình và nhận ra rằng tôi có thể hạnh phúc mà không cần phải dựa vào người khác. Chia tay đã trở thành một bước ngoặt quan trọng giúp tôi trưởng thành và mạnh mẽ hơn.",
    createdAt: new Date().toISOString(),
  },
];
