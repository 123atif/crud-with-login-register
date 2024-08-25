import React, { useContext } from "react";
import { fieldStyle } from "../../utils/commonStyles";
import { BsSearch } from "react-icons/bs";
import { TasksContext } from "../../contexts/TaskContext";
const SearchBar = () => {
  const { setQuery, setLoader } = useContext(TasksContext);
  const handleChange = (event) => {
    setQuery(event.target.value);
    if (!event.target.value) {
      setLoader(false);
    } else {
      <h1>Not found</h1>;
    }
  };
  return (
    <div className="absolute">
      <input
        type="search"
        placeholder="Search Task"
        className={fieldStyle.input + " pl-9"}
        onChange={handleChange}
      />
      <BsSearch className="mt-[-1.8rem] ml-2" />
    </div>
  );
};

export default SearchBar;
