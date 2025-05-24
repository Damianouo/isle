import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";

function SearchModal() {
  return (
    <dialog id="searchModal" className="modal">
      <div className="modal-box flex min-h-[500px] max-w-[600px] flex-col gap-2 p-2">
        <SearchInput />
        <SearchResult />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default SearchModal;
