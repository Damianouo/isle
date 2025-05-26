const post = {
  id: "postdata1",
  title: "You got a problem.",
  author: "Drifter",
  date: "5/24",
  content: `
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet hic impedit iure. Dignissimos excepturi fugiat iste iure quis quisquam suscipit voluptatem voluptatibus?\nAd assumenda expedita harum illum ipsum libero omnis provident reiciendis tenetur? Accusantium aliquid amet fugit magnam nisi nobis odio quisquam, unde veritatis voluptas? Ad adipisci, alias aliquam aperiam autem beatae commodi deserunt dolore, doloremque eligendi est ex explicabo inventore iure molestias necessitatibus nihil nobis perferendis quaerat quasi quia quibusdam recusandae repellendus repudiandae saepe sequi veniam voluptates!\nAliquam error reprehenderit repudiandae tempore. Accusamus debitis dolores eaque eius eos eveniet illum labore modi mollitia odit, possimus quaerat, quam sunt. Excepturi!`,
};

const paragraphs = post.content.split(/\r?\n/);

function Post() {
  return (
    <div className="prose pt-4">
      <p className="flex items-center gap-2">
        <span>{post.author}</span>
        <span className="bg-base-content/70 size-0.75 rounded-full"></span>
        <span>{post.date}</span>
      </p>
      <h1>{post.title}</h1>

      {paragraphs.map((paragraph) => (
        <p>{paragraph}</p>
      ))}
    </div>
  );
}

export default Post;
