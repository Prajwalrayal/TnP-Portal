import { combineReducers } from "redux";
import sidebarSlice from "./reducers/sidebarSlice";
import searchSlice from "./reducers/searchSlice";
import menuSlice from "./reducers/menuSlice";
import sectionSlice from "./reducers/sectionSlice";
import hrSlice from "./reducers/hrSlice";
import activitiesSlice from "./reducers/activitiesSlice";
import companySlice from "./reducers/companySlice";
import userSlice from "./reducers/userSlice";

export default combineReducers({
  menu: menuSlice,
  sidebar: sidebarSlice,
  searchBar: searchSlice,
  section: sectionSlice,
  hr: hrSlice,
  activities: activitiesSlice,
  companies: companySlice,
  user: userSlice,
});
