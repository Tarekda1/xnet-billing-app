import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/_actions/globalActions";
import { Button, Input } from "semantic-ui-react";
import { searchKey } from "@/_containers/isp/Constants";

const SearchBar = ({ searchKeyFetch, searchKeyProp }) => {
  const [searchterm, setSearchterm] = useState("");
  const [searchMap, setSearchMap] = useState(new Map());
  //const searchMap = new Map();
  useEffect(() => {
    console.log("run");
    searchMap.set(searchKey.userAcc.fetch, () =>
      globalActions.fetchInternetUserAccounts({
        pageSizeParam: 50,
      })
    );
    //console.log(searchMap.size);
    searchMap.set(searchKey.user.fetch, () =>
      globalActions.fetchInternetUsers({
        pageSizeParam: 50,
      })
    );
    searchMap.set(searchKey.user.search, (search) =>
      globalActions.searchForUsers(search)
    );
    searchMap.set(searchKey.userAcc.search, (search) =>
      globalActions.searchForUserAcc(search)
    );
  }, []);
  const dispatch = useDispatch();
  const showSearching = useSelector((state) => state.global.showSearching);
  const handleSearchInputChange = (e) => {
    setSearchterm(e.target.value);
    console.log(e.target.value);
    if (e.target.value.trim() === "") {
      //setSearching(false);
      dispatch(searchMap.get(searchKeyFetch)());
    }
  };

  const onSearchSubmit = (e) => {
    //trigger search on enter key or button press
    if (
      ((e && e.key === "Enter") ||
        (e && e.target.name === "searchButton" && searchKeyProp)) &&
      searchterm.trim() !== ""
    ) {
      console.log(searchKeyProp);
      dispatch(searchMap.get(searchKeyProp)(searchterm.toLowerCase()));
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
