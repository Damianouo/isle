import { Link } from "react-router";

const result = [
  { id: "post1", title: "Cambridge Dictionary | English Dictionary", author: "Drifter" },
  { id: "post2", title: "Your Daily Dose of Internet", author: "Daily Dose of Internet" },
  { id: "post3", title: "This team has to be studied", author: "team_lover" },
  { id: "post4", title: "Cambridge Dictionary | English Dictionary", author: "Drifter" },
  { id: "post5", title: "Your Daily Dose of Internet", author: "Daily Dose of Internet" },
];

function SearchResult({ id }) {
  return (
    <ul className="menu rounded-box w-full text-lg">
      {result.map((item) => (
        <li key={item.id}>
          <Link
            to={`/post/${item.id}`}
            className="grid grid-cols-[1fr_auto] py-4"
            onClick={() => document.getElementById(id).close()}
          >
            <span className="line-clamp-1">{item.title}</span>
            <span className="text-base">{`--${item.author}`}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default SearchResult;
