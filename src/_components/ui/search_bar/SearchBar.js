import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/_actions/globalActions";
import { Button, Input } from "semantic-ui-react";

const SearchBar = ({ searchKeyFetch, searchKey }) => {
  const [searchterm, setSearchterm] = useState("");
  const [searchMap, setSearchMap] = useState(new Map());
  //const searchMap = new Map();
  useEffect(() => {
    console.log("run");
    searchMap.set(
      "userAccFetch",
      globalActions.fetchInternetUserAccounts({
        pageSizeParam: 50,
      })
    );
    //console.log(searchMap.size);
    searchMap.set(
      "usersFetch",
      globalActions.fetchInternetUsers({
        pageSizeParam: 50,
      })
    );
    searchMap.set(
      "users",
      globalActions.fetchInternetUsers({
        pageSizeParam: 50,
      })
    );
    searchMap.set(
      "userAcc",
      globalActions.searchForUserAcc(searchterm.toLowerCase())
    );
  }, []);
  const dispatch = useDispatch();
  const showSearching = useSelector((state) => state.global.showSearching);
  const handleSearchInputChange = (e) => {
    setSearchterm(e.target.value);
    if (e.target.value.trim() === "") {
      //setSearching(false);
      dispatch(searchMap.get(searchKeyFetch));
    }
  };

  const onSearchSubmit = (e) => {
    //console.log(e.target.name);
    if ((e && e.key === "Enter") || (e && e.target.name === "searchButton")) {
      // console.log(searchMap.size);
      // console.log(searchMap.get("userAccFetch"));
      if (searchterm) {
        // for (let item of searchMap.keys()) {
        //   console.log(item);
        // }
        //console.log(searchMap.get(searchKey));
        //dispatch(searchMap.get(searchKey));
        dispatch(searchMap.get(searchKey));
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingBottom: "10px",
      }}
    >
      <Input
        name="search"
        icon="users"
        onChange={handleSearchInputChange}
        iconPosition="left"
        loading={showSearching}
        placeholder="Search users..."
        onKeyPress={onSearchSubmit}
      />
      <Button
        className="useraccounts__search primary-button"
        icon="search"
        name="searchButton"
        onClick={onSearchSubmit}
      />
    </div>
  );
};

export { SearchBar };
