import { State } from "@/core/Store";
import "./chatPage.scss";
import { withStore } from "@/hocs/withStore";
import { ChatPage as ChatBase } from "./ChatPage";

const mapStateToProps = (state: State) => ({
  chatsList: state.chats,
  currentChat: state.selectedChat?.[0],
});

export const ChatPage = withStore(mapStateToProps)(ChatBase);
