import { Link } from "react-router";

function Posts() {
  return <div className="">
    <div className='skeleton aspect-[5/1] mb-8'>
    </div>
  <PostsList />

  </div>;
}

export default Posts;

const postsData = [
  {id:'postdata1',title:'You have a problem.',author:'Drifter',date:'5/24'},
  {id:'postdata2',title:'Its never easy.',author:'NONAME',date:'5/25'},
  {id:'postdata3',title:'I tried, but I failed.',author:'Drifter',date:'5/26'},
  {id:'postdata4',title:'Miss the love Ive never had.',author:'Drifter',date:'5/27'},
  {id:'postdata5',title:'We are so COOKED.',author:'NONAME',date:'5/28'},
]

function PostsList(){
  return (
    <ul className='menu w-full text-base'>
      {postsData.map(post => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}className='block'>
            <h2 className='line-clamp-1 text-2xl font-bold'>{post.title}</h2>
            <p className='flex gap-2 text-base-content/70 items-center'>
              <span>{post.author}</span>
              <div className='size-0.5 rounded-full bg-base-content/70'></div>
              <span>{post.date}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
