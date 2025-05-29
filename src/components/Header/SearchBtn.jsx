import SearchIcon from "../../assets/icons/SearchIcon.jsx";
import SearchModal from "./SearchModal.jsx";

function SearchBtn() {
  const id = "searchModal";
  return (
    <div className="flex flex-1 justify-center">
      <button
        className="btn bg-base-100 hover:bg-base-200 max-w-100 flex-1 gap-0"
        onClick={() => document.getElementById(id).showModal()}
      >
        <SearchIcon className="mr-4 size-4" />
        <p className="text-base-content/50 text-xllg flex-1 text-left">Search</p>
      </button>
      <SearchModal id={id} />
    </div>
  );
}

export default SearchBtn;
