import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";

function SearchModal({ id }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box flex min-h-[500px] max-w-[600px] flex-col gap-2 p-2">
        <SearchInput />
        <SearchResult id={id} />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default SearchModal;
