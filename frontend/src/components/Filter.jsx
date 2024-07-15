const Filter = ({ filter, handleNewFilter }) => {
    return (
      <form> filter the names with
        <input value={filter} onChange={handleNewFilter}/>
      </form>
    );
  };

  export default Filter;