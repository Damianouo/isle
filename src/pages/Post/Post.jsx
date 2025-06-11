function Post({ loaderData }) {
  const postData = loaderData[0];
  const paragraphs = postData?.content.split(/\r?\n/);
  return (
    <>
      {postData ? (
        <div className="prose pt-4">
          <p className="flex items-center gap-2">
            <span>{postData?.author}</span>
            <span className="bg-base-content/70 size-0.75 rounded-full"></span>
            <span>{postData?.date}</span>
          </p>
          <h1>{postData?.title}</h1>

          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <div className="prose pt-4">
          <p>
            From <b>Drifter</b>
          </p>
          <h1>The post you're looking for no longer exists.</h1>
          <p>It has been deleted.</p>
        </div>
      )}
    </>
  );
}

export default Post;
