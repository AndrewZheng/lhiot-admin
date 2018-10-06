
const Main = (resolve) => require(['@/components/main'], resolve);
const ParentView= (resolve) => require(['@/components/parent-view'], resolve);
const Home = (resolve) => require(['@/view/single-page/home'], resolve);
const JoinPage = (resolve) => require(['@/view/join-page.vue'], resolve);
const CountTo = (resolve) => require(['@/view/components/count-to/count-to.vue'], resolve);
const DragList = (resolve) => require(['@/view/components/drag-list/drag-list.vue'], resolve);
const Tables = (resolve) => require(['@/view/components/tables/tables.vue'], resolve);
const SplitPane = (resolve) => require(['@/view/components/split-pane/split-pane.vue'], resolve);
const MarkDown = (resolve) => require(['@/view/components/markdown/markdown.vue'], resolve);
const Editor = (resolve) => require(['@/view/components/editor/editor.vue'], resolve);
const TinymceEditor = (resolve) => require(['@/view/components/tinymce-editor/tinymce-editor.vue'], resolve);
const Icons = (resolve) => require(['@/view/components/icons/icons.vue'], resolve);

export default {
  Main,
  ParentView,
  Home,
  JoinPage,
  CountTo,
  DragList,
  Tables,
  SplitPane,
  MarkDown,
  Editor,
  TinymceEditor,
  Icons
};
