const UI_STRUCTURE = `
搜尋：[ ChatGPT 教材            ]

類型：
[全部] [教學] [推薦] [討論] [新聞]

Hashtag：
[#AI] [#教育科技] [#英文教學]

作者：
[@username]

----------------------------------

ChatGPT 用於英文教材製作的實務分享

#AI #教育科技 #英文教學

這篇討論主要提到……
`;

const { data, error } = await supabase
  .from('threads_documents')
  .select('*')
  .contains('tags', ['日本旅遊']);
