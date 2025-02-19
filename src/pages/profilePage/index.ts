import { State } from "@/core/Store";
import { ProfilePage as BaseProfile } from "./ProfilePage";
import "./profilePage.scss";
import { withStore } from "@/hocs/withStore";

const mapStateToProps = (state: State) => ({ user: state.user });

export const ProfilePage = withStore(mapStateToProps)(BaseProfile);
